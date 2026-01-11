# Fix Cursor Workspace Association Issue

If Cursor is associating this project with the wrong workspace (like `glydways-vr-visualizer`), try these solutions:

## Solution 1: Clear Cursor Workspace Storage (Recommended)

Close Cursor completely, then run:

```bash
# Backup first (optional)
cp -r ~/Library/Application\ Support/Cursor/User/workspaceStorage ~/Library/Application\ Support/Cursor/User/workspaceStorage.backup

# Remove workspace storage
rm -rf ~/Library/Application\ Support/Cursor/User/workspaceStorage

# Restart Cursor and open the project fresh
```

Then reopen Cursor and open this folder directly:
```bash
cd /Users/markmanfrey/LOCAL_DEV/figma-to-html-passes
cursor .
```

## Solution 2: Use the Workspace File

1. Close Cursor completely
2. Open Cursor
3. **File** → **Open Workspace from File...**
4. Navigate to `/Users/markmanfrey/LOCAL_DEV/figma-to-html-passes/`
5. Select `figma-to-html-passes.code-workspace`
6. Click **Open**

## Solution 3: Create New Window

1. In Cursor, go to **File** → **New Window**
2. **File** → **Open Folder...**
3. Navigate to `/Users/markmanfrey/LOCAL_DEV/figma-to-html-passes/`
4. Click **Open**

This ensures Cursor creates a fresh workspace association.

## Solution 4: Command Line

Open the workspace file directly:

```bash
cd /Users/markmanfrey/LOCAL_DEV/figma-to-html-passes
cursor figma-to-html-passes.code-workspace
```

## Solution 5: Rename Workspace File (If Persistent Association)

If the workspace file itself is associated with the wrong repo, rename it to force a new association:

```bash
cd /Users/markmanfrey/LOCAL_DEV/figma-to-html-passes
mv figma-to-html-passes.code-workspace figma-html-passes.code-workspace
# Or use a completely unique name
mv figma-to-html-passes.code-workspace figma-to-html-passes-$(date +%s).code-workspace
```

Then open the newly named workspace file.

**Note:** The workspace file has been updated to use absolute paths instead of relative paths (`.`) to help Cursor better identify it.

## Solution 6: Clear Specific Workspace (Advanced)

If you want to be more selective, you can manually check and remove specific workspace associations:

```bash
# List all workspaces
ls ~/Library/Application\ Support/Cursor/User/workspaceStorage/

# Check each workspace.json to find the wrong one
# Inspect workspace.json files to find the one associated with glydways-vr-visualizer
find ~/Library/Application\ Support/Cursor/User/workspaceStorage/ -name "workspace.json" -exec grep -l "glydways" {} \;

# Then remove the specific directory
rm -rf ~/Library/Application\ Support/Cursor/User/workspaceStorage/[hash-of-wrong-workspace]
```

## Solution 7: Clear Additional Cursor Caches (Nuclear Option)

If the issue persists, clear all Cursor caches:

```bash
# Close Cursor completely first!

# Backup everything (optional but recommended)
mkdir -p ~/cursor-backup-$(date +%Y%m%d)
cp -r ~/Library/Application\ Support/Cursor/User/workspaceStorage ~/cursor-backup-$(date +%Y%m%d)/workspaceStorage
cp -r ~/Library/Application\ Support/Cursor/User/History ~/cursor-backup-$(date +%Y%m%d)/History 2>/dev/null || true

# Clear workspace storage
rm -rf ~/Library/Application\ Support/Cursor/User/workspaceStorage

# Clear state (optional - this removes more cache)
rm -rf ~/Library/Application\ Support/Cursor/User/History
rm -rf ~/Library/Application\ Support/Cursor/User/globalStorage
rm -rf ~/Library/Application\ Support/Cursor/Cache

# Restart Cursor and open workspace file
```

## Solution 8: Use Unique Workspace File Name Per Session

Create a timestamped workspace file for isolation:

```bash
cd /Users/markmanfrey/LOCAL_DEV/figma-to-html-passes
cp figma-to-html-passes.code-workspace figma-to-html-passes-$(date +%Y%m%d).code-workspace
cursor figma-to-html-passes-$(date +%Y%m%d).code-workspace
```

## Why This Happens

Cursor stores workspace associations based on:
- Folder path hash
- Git remote URL (may be pointing to wrong repo)
- Workspace file path/name
- Some internal project identifier
- File content hash of workspace file

If a workspace file was previously used in another repo (like `glydways-vr-visualizer`), Cursor may maintain that association even after moving/renaming.

## Current Workspace File Status

The workspace file has been updated to:
- Use **absolute paths** instead of relative paths (`.`) - this helps Cursor better identify the workspace
- Include unique watcher exclude patterns
- Be recreated fresh to break any old associations

## Verify It's Fixed

After trying one of the solutions above:
1. Close Cursor completely
2. Open the workspace file using **File → Open Workspace from File...**
3. Check the workspace name in Cursor's title bar (should show "Figma to HTML Passes")
4. Verify git remote: `git remote -v` (should show correct repo)
5. Verify file associations work correctly
6. Check that project-specific settings are correct
7. Confirm `.cursorrules` file is being recognized (check AI behavior matches this project)
