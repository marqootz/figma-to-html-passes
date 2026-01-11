# Python Version Requirement

## Important: Python 3.10+ Required

**Python 3.9 will be deprecated on January 27th, 2026.**

Please use **Python version 3.10 and up** for all Python-based tools.

## Affected Tools

### oauth2l (via pip)

If installing `oauth2l` via pip (Linux/Windows), you need Python 3.10+:

```bash
# Check your Python version first
python3 --version

# Should show Python 3.10.x or higher
# If not, upgrade Python first, then:
pip install oauth2l
```

### Python HTTP Server

If using Python's built-in HTTP server for local development:

```bash
# Python 3.10+ required
python3 -m http.server 8080
```

## Checking Your Python Version

### macOS/Linux
```bash
python3 --version
```

Should output something like:
```
Python 3.10.9
```
or higher (3.11, 3.12, 3.13, etc.)

### Windows
```bash
python --version
```

## Upgrading Python

### macOS (using Homebrew)
```bash
brew install python@3.12
# or
brew install python@3.11
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install python3.10 python3-pip
# or
sudo apt install python3.11 python3-pip
```

### Windows
Download Python 3.10+ from: https://www.python.org/downloads/

## Alternative: Use gcloud CLI Instead

If you prefer to avoid Python version issues, use `gcloud` CLI instead of `oauth2l`:

```bash
# Install gcloud (no Python version concerns)
brew install google-cloud-sdk  # macOS

# Get token directly
gcloud auth application-default login
gcloud auth print-access-token --scopes=https://www.googleapis.com/auth/drive
```

See `docs/GET_TOKEN_WITH_GCLOUD.md` for full instructions.

## Summary

✅ **Use Python 3.10+** for pip-based tools like oauth2l  
✅ **Check version** before installing: `python3 --version`  
✅ **Upgrade if needed** before January 27, 2026  
✅ **Alternative**: Use `gcloud` CLI (no Python version requirements)

---

**See also:**
- `docs/GET_TOKEN_WITH_GCLOUD.md` - Using gcloud CLI (no Python needed)
- `docs/USING_PLUGIN_WITHOUT_BACKEND.md` - Token methods
- `docs/OAUTH_ALTERNATIVES.md` - OAuth token alternatives
