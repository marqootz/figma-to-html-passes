# LOCAL_DEV Directory and Git Setup

## Should LOCAL_DEV Be a Git Repository?

**Short answer: NO** - LOCAL_DEV should **NOT** be a git repository.

## Why?

LOCAL_DEV is a parent directory containing multiple unrelated projects, each with their own git repositories:

```
LOCAL_DEV/
├── figma-to-html-passes/       (git repo)
├── glydways-vr-visualizer/     (git repo)
├── figma-to-html/              (git repo)
├── anno/                       (git repo)
└── ... (many other projects)
```

### Problems if LOCAL_DEV is a Git Repository

1. **Cursor workspace confusion**: Cursor may try to associate workspace files with the parent git repository
2. **Git nesting issues**: Having a git repo inside another git repo can cause confusion
3. **Unintended commits**: Changes to one project might appear as changes to another
4. **Workspace association**: Cursor uses git remote URLs to identify workspaces - having a parent repo can override individual project associations

## How to Check

```bash
# Check if LOCAL_DEV is a git repository
cd /Users/markmanfrey/LOCAL_DEV
test -d .git && echo "LOCAL_DEV IS a git repo - should remove!" || echo "LOCAL_DEV is NOT a git repo (good)"

# Check git status
cd /Users/markmanfrey/LOCAL_DEV
git status 2>&1
# If it says "not a git repository" - you're good!
# If it shows git status - LOCAL_DEV is a git repo and should be cleaned up
```

## How to Fix (If LOCAL_DEV is a Git Repository)

### Option 1: Remove Git Repository (Recommended)

If LOCAL_DEV was accidentally initialized as a git repository:

```bash
cd /Users/markmanfrey/LOCAL_DEV

# Check what would be lost (optional - see what's tracked)
git status

# Backup .git directory if you want to be safe (optional)
cp -r .git .git.backup

# Remove the git repository
rm -rf .git
rm -f .gitignore .gitattributes  # Remove any git config files at this level
```

**Important:** This only removes the git repository at the LOCAL_DEV level. Each individual project's git repository is unaffected.

### Option 2: Add LOCAL_DEV to Gitignore (If You Must Keep It)

If for some reason you need LOCAL_DEV to be tracked elsewhere, add a `.gitignore` in LOCAL_DEV:

```bash
cd /Users/markmanfrey/LOCAL_DEV
cat > .gitignore << 'EOF'
# Ignore all subdirectories - each project manages its own git
*/
!*.md
EOF
```

**But this is NOT recommended** - it's better to remove the git repository entirely.

## Verify Individual Projects Are Still Git Repos

After removing git from LOCAL_DEV, verify each project still works:

```bash
# Check figma-to-html-passes
cd /Users/markmanfrey/LOCAL_DEV/figma-to-html-passes
git status
git remote -v

# Check glydways-vr-visualizer
cd /Users/markmanfrey/LOCAL_DEV/glydways-vr-visualizer
git status
git remote -v
```

Each should show their own git repository status and remote URLs.

## Best Practice for LOCAL_DEV

LOCAL_DEV should be:
- ✅ A plain directory (not a git repository)
- ✅ A parent folder for organizing projects
- ✅ Each subdirectory is its own independent git repository
- ✅ No `.git` directory at the LOCAL_DEV level
- ✅ No `.gitignore` or `.gitattributes` at the LOCAL_DEV level (unless for local tooling)

## Why This Matters for Cursor

Cursor identifies workspaces using:
1. **Folder path** - each project's absolute path
2. **Git remote URL** - from the project's git repository
3. **Workspace file path** - the `.code-workspace` file location

If LOCAL_DEV is a git repository:
- Cursor might use LOCAL_DEV's git remote instead of the individual project's remote
- Workspace files might get associated with the wrong repository
- Projects can get confused with each other

**Solution:** Keep LOCAL_DEV as a plain directory, and ensure each project has its own git repository with correct remotes.
