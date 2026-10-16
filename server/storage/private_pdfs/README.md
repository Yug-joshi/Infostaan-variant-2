# Private PDF Storage

This directory holds the raw PDF binary files uploaded by authorized administrators.

## Security Controls
- **Not Publicly Served**: This directory is outside the public web root and is never served by static middleware.
- **Access Control**: Downloading or accessing raw files requires server-side validation and authorization.
- **Direct Link Prevention**: File names are sanitized and assigned random UUID suffixes upon ingestion to prevent enumeration attacks.
