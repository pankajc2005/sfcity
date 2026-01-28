# Git Setup Guide

## What's Excluded from Git

The `.gitignore` file is configured to exclude:

- **Virtual Environment**: `myenv312/` - This folder is large (11,951 files) and should be recreated locally
- **Python Cache**: `__pycache__/` and `*.pyc` files
- **Database**: `instance/` folder containing SQLite databases
- **Environment Variables**: `.env` file (contains sensitive configuration)
- **IDE Settings**: `.vscode/`, `.idea/`
- **OS Files**: `.DS_Store`, `Thumbs.db`

## Setup Instructions for New Clone

After cloning this repository, run:

```bash
# Create virtual environment
python -m venv myenv312

# Activate virtual environment
# On Windows:
myenv312\Scripts\activate
# On Mac/Linux:
source myenv312/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (copy from .env.example if provided)
# Add your environment variables

# Initialize database if needed
python seed_data.py
```

## Files Included in Git

- Source code: `*.py` files
- Configuration: `requirements.txt`
- Documentation: `*.md` files
- Data: `mumbai_fir_dummy_land_only.csv`
- Templates: `templates/` folder
- Static assets: `static/` folder

## Repository Size

With the optimized `.gitignore`, the repository only tracks essential files (~50KB of code) instead of the entire 11,951+ files in the virtual environment.
