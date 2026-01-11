# Install gcloud CLI with Homebrew (macOS)

**Quick guide for installing Google Cloud SDK on macOS using Homebrew.**

## Installation (2 Steps)

### Step 1: Install with Homebrew

```bash
brew install google-cloud-sdk
```

This will:
- Install Google Cloud SDK
- Add `gcloud` command to your PATH
- Install all required components

**Time:** ~2-5 minutes depending on your internet speed

### Step 2: Verify Installation

After installation completes, verify it worked:

```bash
gcloud --version
```

You should see output like:
```
Google Cloud SDK 450.0.0
...
```

## First-Time Setup (Optional)

After installation, you may want to initialize gcloud:

```bash
gcloud init
```

This will:
- Ask you to log in with your Google account
- Select or create a default project
- Set default configuration

**Note:** This is optional - you can skip this and just use `gcloud auth application-default login` when you need to get tokens.

## Verify Installation

Check that gcloud is available:

```bash
which gcloud
```

Should output something like:
```
/opt/homebrew/bin/gcloud
```

## Troubleshooting

### "brew: command not found"
You need to install Homebrew first:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Then try installing gcloud again:
```bash
brew install google-cloud-sdk
```

### "gcloud: command not found" after installation

After installing, you may need to restart your terminal or add to PATH:

```bash
# Add to your shell profile (~/.zshrc or ~/.bash_profile)
echo 'source "$(brew --prefix)/share/google-cloud-sdk/path.bash.inc"' >> ~/.zshrc
echo 'source "$(brew --prefix)/share/google-cloud-sdk/completion.bash.inc"' >> ~/.zshrc

# Reload shell
source ~/.zshrc
```

Or just restart your terminal.

### "Permission denied" errors

Make sure Homebrew has proper permissions:

```bash
sudo chown -R $(whoami) /opt/homebrew
```

Or if using Intel Mac:
```bash
sudo chown -R $(whoami) /usr/local
```

### Python 3.9 deprecation / Python path error

If you see an error like:
```
ERROR: (gcloud.config.virtualenv.create) /opt/homebrew/opt/python@3.13/libexec/bin/python3: command not found
WARNING: Python 3.9 will be deprecated on January 27th, 2026. Please use Python version 3.10 and up.
```

**Solution 1: Set CLOUDSDK_PYTHON to your working Python 3.10+**

First, find your Python 3.10+ path:
```bash
which python3
python3 --version  # Should show 3.10.x or higher
```

Then set the environment variable:
```bash
# Add to your ~/.zshrc (or ~/.bash_profile)
echo 'export CLOUDSDK_PYTHON=$(which python3)' >> ~/.zshrc

# Reload shell
source ~/.zshrc
```

**Solution 2: Install Python 3.10+ and point gcloud to it**

```bash
# Install Python 3.12 (or 3.11, 3.13)
brew install python@3.12

# Find the path
which python3.12

# Set CLOUDSDK_PYTHON to it
echo 'export CLOUDSDK_PYTHON=$(which python3.12)' >> ~/.zshrc
source ~/.zshrc
```

**Solution 3: Reinstall gcloud components**

```bash
gcloud components reinstall
```

This will prompt you to install a compatible Python version if needed.

**Verify the fix:**
```bash
echo $CLOUDSDK_PYTHON  # Should show a valid Python 3.10+ path
gcloud --version  # Should work now
```

## Next Steps

Once installed, you can get a Google Drive token:

```bash
# Authenticate (first time)
gcloud auth application-default login

# Get token
gcloud auth print-access-token --scopes=https://www.googleapis.com/auth/drive
```

## See Also

- `docs/GET_TOKEN_WITH_GCLOUD.md` - How to get tokens with gcloud
- `docs/USING_PLUGIN_WITHOUT_BACKEND.md` - Using plugin without backend
