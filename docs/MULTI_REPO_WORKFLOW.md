# Working with Multiple Repositories in Cursor

Best practices for working on multiple unrelated repositories simultaneously without confusion.

## Best Approach: Separate Windows + Workspace Files

### 1. Use Separate Cursor Windows

**Recommended workflow:**
- Open each repository in its own Cursor window
- Use **File → New Window** to create a new window for each repo
- Each window maintains its own isolated context

**Benefits:**
- Complete isolation between projects
- No confusion between codebases
- Easier to switch between projects (Cmd+` on Mac)
- Separate terminal sessions per project

### 2. Use Workspace Files

**For each repository:**
- Create a `.code-workspace` file in the repo root
- Always open the workspace file (not just the folder)
- Name it descriptively: `repo-name.code-workspace`

**Example:**
```json
{
  "folders": [
    {
      "name": "Your Repo Name",
      "path": "."
    }
  ],
  "settings": {
    "files.exclude": {
      "**/.git": true,
      "**/node_modules": true
    }
  }
}
```

**Opening workspaces:**
- **File → Open Workspace from File...**
- Or from command line: `cursor repo-name.code-workspace`

### 3. Use .cursorrules Files

**Each repository should have a `.cursorrules` file** at its root to:
- Define project-specific context for AI
- Prevent AI from mixing concepts between repos
- Set project-specific coding standards

**Example `.cursorrules`:**
```
# Project-Specific Rules

This is the [PROJECT NAME] project.
[Brief description of what this project does]

Key concepts:
- [Concept 1]
- [Concept 2]

Important files:
- [Important file paths]
```

### 4. Organization Tips

#### Folder Structure
```
~/LOCAL_DEV/
  ├── repo1/
  │   ├── .code-workspace
  │   ├── .cursorrules
  │   └── ...
  ├── repo2/
  │   ├── .code-workspace
  │   ├── .cursorrules
  │   └── ...
  └── repo3/
      ├── .code-workspace
      ├── .cursorrules
      └── ...
```

#### Naming Conventions
- Use descriptive window names/titles
- Keep workspace files with clear names
- Use `.cursorrules` to document each project

### 5. Troubleshooting: Repos Getting Confused

If Cursor starts mixing up repositories (especially persistent associations):

#### Quick Fix
1. Close all Cursor windows completely
2. Clear workspace storage:
   ```bash
   # Backup first (optional)
   cp -r ~/Library/Application\ Support/Cursor/User/workspaceStorage ~/Library/Application\ Support/Cursor/User/workspaceStorage.backup
   
   # Clear storage
   rm -rf ~/Library/Application\ Support/Cursor/User/workspaceStorage
   ```
3. Restart Cursor
4. Open each repo using its workspace file in a new window

#### Persistent Association Issue

If a workspace file keeps getting associated with the wrong repo (even after clearing cache):

1. **Rename the workspace file** to force a new association:
   ```bash
   cd /path/to/repo
   mv repo-name.code-workspace repo-name-new.code-workspace
   cursor repo-name-new.code-workspace
   ```

2. **Ensure workspace file uses absolute paths** (not relative `.`):
   ```json
   {
     "folders": [
       {
         "name": "Repo Name",
         "path": "/absolute/path/to/repo"
       }
     ]
   }
   ```

3. **Use timestamped workspace files** for complete isolation:
   ```bash
   cp repo.code-workspace repo-$(date +%Y%m%d).code-workspace
   cursor repo-$(date +%Y%m%d).code-workspace
   ```

4. **Check workspace storage** for conflicting associations:
   ```bash
   find ~/Library/Application\ Support/Cursor/User/workspaceStorage/ -name "workspace.json" -exec grep -l "wrong-repo-name" {} \;
   ```

See `FIX_CURSOR_WORKSPACE.md` in the repo root for detailed solutions.

#### Verify Correct Association
After opening:
- Check the workspace name in Cursor's title bar
- Verify git remote is correct: `git remote -v`
- Confirm `.cursorrules` content matches the project

### 6. Command Line Workflow

**Opening multiple repos:**
```bash
# Terminal 1
cd ~/LOCAL_DEV/repo1
cursor repo1.code-workspace

# Terminal 2 (new terminal)
cd ~/LOCAL_DEV/repo2
cursor repo2.code-workspace

# Terminal 3 (new terminal)
cd ~/LOCAL_DEV/repo3
cursor repo3.code-workspace
```

Each `cursor` command opens a new window if no window is available, or you can force it:
```bash
cursor -n repo1.code-workspace  # New window
```

### 7. Git Remote Considerations

**Important:** Ensure git remotes are correct for each repo:
```bash
# In each repo, verify:
git remote -v

# Should point to the correct repository
# If wrong, update:
git remote set-url origin https://github.com/user/correct-repo.git
```

Cursor sometimes uses git remote URLs as part of workspace identification, so incorrect remotes can cause confusion.

### 8. Workspace Storage Location

Cursor stores workspace data at:
- **macOS:** `~/Library/Application Support/Cursor/User/workspaceStorage/`
- **Linux:** `~/.config/Cursor/User/workspaceStorage/`
- **Windows:** `%APPDATA%\Cursor\User\workspaceStorage\`

Each workspace gets a hash-based directory that contains:
- Workspace settings
- Window state
- Cache data
- Extension state

### Summary Checklist

For each repository:
- [ ] Create/verify `.code-workspace` file exists
- [ ] Create/verify `.cursorrules` file exists with project context
- [ ] Verify git remote is correct
- [ ] Open in separate Cursor window
- [ ] Use workspace file to open (not just folder)

**When opening multiple repos:**
1. Use **File → New Window** for each additional repo
2. Open workspace file for each repo
3. Verify workspace name matches project
4. Check that AI context is correct (via `.cursorrules`)
