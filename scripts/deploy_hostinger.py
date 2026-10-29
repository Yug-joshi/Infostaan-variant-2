import os
import sys
import ftplib
from pathlib import Path

def get_env(key, default=None):
    val = os.environ.get(key, default)
    if not val:
        print(f"Error: Missing required environment variable {key}", file=sys.stderr)
        sys.exit(1)
    return val

def main():
    host = get_env('HOSTINGERFTPHOST')
    user = get_env('HOSTINGERFTPUSERNAME')
    passwd = get_env('HOSTINGERFTPPASSWORD')
    port = int(os.environ.get('HOSTINGERFTPPORT', '21'))

    dist_dir = Path('dist')
    if not dist_dir.is_dir():
        print(f"Error: {dist_dir} directory does not exist!", file=sys.stderr)
        sys.exit(1)

    print(f"Connecting to FTP {host}:{port} as {user}...")
    ftp = ftplib.FTP()
    ftp.connect(host, port, timeout=60)
    ftp.login(user, passwd)
    print("FTP Login successful!")

    initial_pwd = ftp.pwd()
    print(f"Initial working directory: {initial_pwd}")

    root_files = []
    try:
        root_files = ftp.nlst()
        print(f"Files/folders in initial directory: {root_files}")
    except Exception as e:
        print(f"Could not list initial directory: {e}")

    # Determine target document root:
    # We want to find where the live website's index.html lives.
    target_dir = initial_pwd

    # Check common Hostinger folder structures:
    # Structure A: initial_pwd has 'domains' folder (e.g. domains/infostaan.com/public_html)
    # Structure B: initial_pwd has 'public_html' folder
    # Structure C: initial_pwd IS the public_html folder already (index.html is right there in root_files)
    
    if 'domains' in root_files:
        print("Found 'domains' directory. Checking inside domains/...")
        try:
            domains_list = ftp.nlst('domains')
            print(f"Inside domains: {domains_list}")
            for d in domains_list:
                if 'infostaan' in d.lower():
                    cand = f"{d}/public_html" if not d.endswith('/public_html') else d
                    print(f"Found infostaan domain folder: {cand}")
                    target_dir = cand
                    break
        except Exception as e:
            print(f"Error checking domains: {e}")

    elif 'public_html' in root_files:
        # Check if index.html is already in the root, or if it is inside public_html
        if 'index.html' in root_files and 'public_html' in root_files:
            # Check what's inside public_html
            try:
                pub_files = ftp.nlst('public_html')
                print(f"Inside public_html: {pub_files}")
                # If public_html has another public_html, it was our nested upload!
                # If public_html has assets or index.html, target public_html
                target_dir = 'public_html'
            except Exception:
                target_dir = 'public_html'
        else:
            target_dir = 'public_html'
    else:
        print("Neither 'domains' nor 'public_html' found as subfolder. Uploading directly to current working directory.")
        target_dir = '.'

    print(f"\n===> Selected target upload directory: '{target_dir}'")
    ftp.cwd(target_dir)
    print(f"Current working directory is now: {ftp.pwd()}")
    print("Directory listing before upload:", ftp.nlst())

    # Recursive upload helper
    total_files = 0
    total_bytes = 0

    def upload_dir(local_path: Path, remote_prefix=""):
        nonlocal total_files, total_bytes
        for item in sorted(local_path.iterdir()):
            if item.is_file():
                filename = item.name
                rel_remote = f"{remote_prefix}/{filename}".lstrip('/')
                size = item.stat().st_size
                with open(item, 'rb') as f:
                    ftp.storbinary(f"STOR {filename}", f)
                total_files += 1
                total_bytes += size
                print(f"  [+] Uploaded {rel_remote} ({size:,} bytes)")
            elif item.is_dir():
                dirname = item.name
                rel_remote = f"{remote_prefix}/{dirname}".lstrip('/')
                try:
                    ftp.mkd(dirname)
                    print(f"  [DIR] Created remote directory: {rel_remote}")
                except ftplib.error_perm:
                    # Directory likely already exists
                    pass
                ftp.cwd(dirname)
                upload_dir(item, rel_remote)
                ftp.cwd("..")

    print(f"\nStarting upload of {dist_dir} contents...")
    upload_dir(dist_dir)
    print(f"\nUpload complete! Successfully transferred {total_files} files ({total_bytes:,} bytes).")

    print("\nVerifying uploaded files in target directory:")
    final_listing = ftp.nlst()
    print("Files in target directory:", final_listing)

    ftp.quit()
    print("FTP Connection closed cleanly.")

if __name__ == '__main__':
    main()
