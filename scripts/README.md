# PDF Password Remover

This script removes password protection from PDF files.

## Installation

1. Make sure you have Python 3.6 or higher installed
2. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Usage

The script can be used in two ways:

1. Overwrite the original file:
   ```bash
   python remove_pdf_password.py input.pdf password
   ```

2. Create a new file without password:
   ```bash
   python remove_pdf_password.py input.pdf password output.pdf
   ```

### Arguments

- `input.pdf`: Path to the password-protected PDF file
- `password`: The password of the PDF file
- `output.pdf`: (Optional) Path for the output PDF file. If not provided, the input file will be overwritten.

### Example

```bash
# Overwrite the original file
python remove_pdf_password.py statement.pdf mypassword

# Create a new file
python remove_pdf_password.py statement.pdf mypassword statement_no_password.pdf
```

## Notes

- The script will check if the PDF is actually password protected before attempting to remove the password
- If an invalid password is provided, the script will fail with an error message
- The script uses a temporary file during processing to ensure data safety
- If the script fails, it will clean up any temporary files 