# Instructions for Pushing Code to GitHub

## Option 1: Allow the Secret Through GitHub (Easiest)

Since you've already removed the API key from the current code and the exposed key is likely to be revoked anyway, the simplest approach is to allow GitHub to ignore this specific secret:

1. Visit the link GitHub provided in the error message:
   ```
   https://github.com/mian-abd/GTG/security/secret-scanning/unblock-secret/2wBOdSbos1SLeAz49vJIMT6i3NA
   ```

2. Login to GitHub if needed

3. Click the "I understand, allow me to push this secret" button

4. Provide a reason such as "API key has been removed from current codebase and revoked"

5. Try your push again with:
   ```
   git push origin main
   ```

## Option 2: Clean Git History (More Complex but Thorough)

If you need to completely remove the API key from all git history:

### First, install git-filter-repo:

```bash
# For Windows with pip
pip install git-filter-repo

# For Windows with pip3
pip3 install git-filter-repo
```

### Then clean the git history:

```bash
# Create a backup branch first
git checkout -b backup_main

# Return to main
git checkout main

# Use git-filter-repo to remove the API key
git filter-repo --replace-text <<EOF
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==>YOUR_API_KEY_HERE
EOF

# Force push to GitHub
git push -f origin main
```

### Alternative method if git-filter-repo is not working:

```bash
# Use git filter-branch (slower but built-in)
git filter-branch --force --index-filter \
  "git ls-files -z | xargs -0 sed -i 's/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/YOUR_API_KEY_HERE/g'" \
  --prune-empty --tag-name-filter cat -- --all

# Force push
git push -f origin main
```

## Option 3: Create a New Repository

If all else fails, you can create a new repository:

1. Create a new repository on GitHub 
2. Remove the `.git` directory from your local project
3. Initialize a new git repository
4. Add your files (without API keys)
5. Commit and push to the new repository

## Important: Revoke and Rotate API Keys

Regardless of which method you choose, you should:

1. Immediately revoke the exposed SendGrid API key
2. Generate a new API key for SendGrid
3. Update your application to use the new key
4. Ensure you're following the best practices in API_KEYS_README.md 