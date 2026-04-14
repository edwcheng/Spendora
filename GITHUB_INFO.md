# 🚨 CRITICAL: Read This First

> ⚠️ This file prevents common mistakes. READ BEFORE ANY GIT OPERATIONS!

## ⚡ Quick Reference

| Item | Value | Notes |
|------|-------|-------|
| **Working Directory** | `/home/z/my-project/spendora` | ALWAYS `cd` here first! |
| **Branch** | `main` | NOT master! |
| **Token File** | `/home/z/my-project/.private_notes` | Read for push access |

---

## 🛑 Common Mistakes to Avoid

### ❌ Mistake 1: Wrong Directory
```bash
# WRONG - You're in parent directory
pwd
# /home/z/my-project

# CORRECT - Always work in spendora directory
cd /home/z/my-project/spendora
pwd
# /home/z/my-project/spendora
```

### ❌ Mistake 2: Wrong Branch
```bash
# WRONG - This repo uses master
git branch
# * master

# CORRECT - Spendora uses main
cd /home/z/my-project/spendora
git branch
# * main
```

### ❌ Mistake 3: Parent Directory Has Extra .git
```bash
# If you see this, you're in the WRONG directory:
git status
# On branch master  <-- WRONG! Should be main

# Solution:
cd /home/z/my-project/spendora
git status
# On branch main  <-- CORRECT!
```

---

## ✅ Correct Workflow

### Before ANY Git Operation:
```bash
# Step 1: Go to correct directory
cd /home/z/my-project/spendora

# Step 2: Verify you're on main branch
git branch
# Should show: * main

# Step 3: If pushing, read token
cat /home/z/my-project/.private_notes
```

### Git Commands Template:
```bash
# ALWAYS start with cd!
cd /home/z/my-project/spendora

# Then do your git work
git status
git add -A
git commit -m "your message"
git push https://YOUR_TOKEN@github.com/edwcheng/Spendora.git main
```

### Or use git -C (safer):
```bash
# This explicitly specifies the directory
git -C /home/z/my-project/spendora status
git -C /home/z/my-project/spendora add -A
git -C /home/z/my-project/spendora commit -m "message"
git -C /home/z/my-project/spendora push https://TOKEN@github.com/edwcheng/Spendora.git main
```

---

## 🔍 Health Check Commands

Run these if something seems wrong:

```bash
# Check you're in the right place
pwd
# Expected: /home/z/my-project/spendora

# Check the branch
git branch
# Expected: * main

# Check remote
git remote -v
# Expected: origin https://github.com/edwcheng/Spendora.git

# Check for uncommitted changes
git status
# Expected: nothing to commit, working tree clean
```

---

## 🧹 Cleanup If Broken

If parent directory accidentally has a `.git` folder:

```bash
# Remove the extra git repo (NOT the spendora one!)
rm -rf /home/z/my-project/.git

# Verify spendora still works
git -C /home/z/my-project/spendora status
```

---

*Last updated: 2024-03-23*
