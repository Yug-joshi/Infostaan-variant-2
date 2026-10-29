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

    # Determine targets:
    # If index.html is in root_files, root '.' is the primary web root for the domain.
    # To be 100% sure regardless of whether Hostinger serves from '.' or 'public_html',
    # we upload to '.' AND to 'public_html' if it exists.
    targets = ['.']
    if 'public_html' in root_files:
        targets.append('public_html')

    print(f"\n===> Deployment targets: {targets}")

    # Recursive upload helper
    def upload_dir(local_path: Path, remote_prefix=""):
        count = 0
        total_size = 0
        for item in sorted(local_path.iterdir()):
            if item.is_file():
                filename = item.name
                rel_remote = f"{remote_prefix}/{filename}".lstrip('/')
                size = item.stat().st_size
                with open(item, 'rb') as f:
                    ftp.storbinary(f"STOR {filename}", f)
                count += 1
                total_size += size
                print(f"  [+] Uploaded {rel_remote} ({size:,} bytes)")
            elif item.is_dir():
                dirname = item.name
                rel_remote = f"{remote_prefix}/{dirname}".lstrip('/')
                try:
                    ftp.mkd(dirname)
                    print(f"  [DIR] Created remote directory: {rel_remote}")
                except ftplib.error_perm:
                    pass
                ftp.cwd(dirname)
                c, s = upload_dir(item, rel_remote)
                count += c
                total_size += s
                ftp.cwd("..")
        return count, total_size

    for target in targets:
        print(f"\n==========================================")
        print(f"Deploying build to target: '{target}'")
        print(f"==========================================")
        ftp.cwd(initial_pwd)
        if target != '.':
            try:
                ftp.cwd(target)
            except Exception as e:
                print(f"Could not enter {target}: {e}")
                continue
        print(f"Current directory: {ftp.pwd()}")
        files_uploaded, bytes_uploaded = upload_dir(dist_dir)
        print(f"Finished uploading to '{target}': {files_uploaded} files ({bytes_uploaded:,} bytes).")

    ftp.cwd(initial_pwd)
    ftp.quit()
    print("\nFTP deployment successfully completed for all targets!")

if __name__ == '__main__':
    main()
