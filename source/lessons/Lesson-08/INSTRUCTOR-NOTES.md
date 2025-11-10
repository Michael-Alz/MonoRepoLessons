# Instructor Notes - Lesson 08: React CI/CD Exercise

## Overview

This lesson has been adapted for a **45-minute team exercise** where students learn CI/CD with GitHub Actions.

## Key Changes from Original Plan

### ✅ Time Adjusted
- **Original:** 60 minutes
- **Updated:** 45 minutes
- Students skip the "build from scratch" portion and use the provided application

### ✅ Team-Based Approach
- Students work in teams
- One team member creates the repository
- All team members and the professor are invited as collaborators
- Professor's GitHub ID: **sillyfunnypedro**

### ✅ Pre-Built Application
- Complete React TypeScript application provided in `react-cicd-demo/` directory
- All configuration files included (TypeScript, Vite, Jest, Babel)
- Tests are ready to run
- Students can focus on CI/CD rather than setup
- TypeScript provides type safety and better IDE support

## Time Breakdown

1. **Team Setup (5 min)** - Create empty repo on GitHub, invite team and professor
2. **Understanding the App (5 min)** - Explore provided code, run tests locally
3. **Git Setup (5 min)** - Clone empty repo, copy files, commit and push
4. **GitHub Actions (15 min)** - Create and configure CI/CD workflow
5. **Test Pipeline (15 min)** - Make changes, test PR workflow, observe deployment

## Student Workflow

Students have **two main workflows** to choose from in Part 2:

### Workflow A: Local-First with GitHub CLI (Fastest)
**Recommended for CLI-comfortable students**

1. Navigate to provided application directory
2. `git init` in the directory
3. `git add` and `git commit` locally
4. `gh repo create --source=. --push` creates repo and pushes in one command
5. Invite collaborators after pushing

**Advantages:**
- Fastest approach (3 commands after setup)
- No file copying needed
- Matches what you (instructor) did!
- Teaches modern Git workflow

### Workflow B: Clone-First (Traditional)
**Default for web interface users**

1. **Create empty repository on GitHub first** (web UI or `gh repo create`)
2. **Clone the empty repository** to local machine
3. **Copy the provided application files** into cloned directory
4. **Commit and push** to GitHub

**Advantages:**
- More explicit steps (good for beginners)
- Works without GitHub CLI
- Traditional Git workflow

### GitHub CLI Note
Students can use `gh repo create` and `gh repo set-access` if they have the GitHub CLI installed. Workflow A is significantly faster but optional. Most students will likely use Workflow B with the web interface.

## What Students Will Learn

- ✅ How to set up GitHub Actions workflows
- ✅ Continuous Integration (automated testing)
- ✅ Continuous Deployment (automatic deployment to GitHub Pages)
- ✅ Pull Request workflows
- ✅ Team collaboration with Git
- ✅ How failing tests prevent merges

## Student Deliverables

Students should have:
1. A public GitHub repository with their team
2. Working GitHub Actions CI/CD pipeline
3. Application deployed to GitHub Pages
4. At least one merged PR showing the pipeline in action
5. Professor invited as collaborator

## Files Provided

### Application Structure
```
react-cicd-demo/
├── .babelrc              # Babel configuration
├── .gitignore           # Git ignore rules
├── index.html           # HTML template
├── jest.config.js       # Jest testing configuration
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── tsconfig.node.json   # TypeScript config for Node
├── vite.config.ts       # Vite bundler config (TypeScript)
├── README.md            # Application README
└── src/
    ├── App.css          # Styling
    ├── App.tsx          # Main React component (TypeScript)
    ├── App.test.tsx     # Test suite (TypeScript)
    ├── main.tsx         # React entry point (TypeScript)
    └── setupTests.ts    # Jest setup with jest-dom matchers (TypeScript)
```

## Common Issues to Watch For

### 1. Copying Files (Most Common!)
- Students may forget to copy hidden files (`.gitignore`, `.babelrc`)
- On Mac/Linux, they can use: `cp -r source-dir/. destination-dir/`
- Or use a file browser with "Show Hidden Files" enabled
- Verify all files are present before committing

### 2. GitHub Pages Not Working
- Ensure repository is **public**
- Check that `gh-pages` branch is selected in Settings → Pages
- Verify `base` path in `vite.config.ts` matches repository name

### 3. Tests Failing in CI
- Check Node.js version consistency
- Ensure all dependencies are in package.json
- TypeScript compilation errors will prevent builds

### 4. Team Collaboration Issues
- Students may push directly to main instead of using PRs
- Remind them to create feature branches
- **First-time PR users:** The instructions now include detailed steps for creating a PR
- Watch for students who skip the PR process entirely

### 5. Pull Request Process
- Exercise 1 is the first time students create a PR - monitor for confusion
- The yellow "Compare & pull request" banner only shows for ~24 hours after push
- If banner is gone, they can use "Pull requests" tab → "New pull request"
- Emphasize the CI check results (green checkmark vs red X)

### 6. Professor Access
- Make sure students actually invite **sillyfunnypedro**
- They often forget this step!

## Extension Activities

If teams finish early, suggest:
- Add ESLint for code quality checks
- Implement code coverage reporting
- Add a new feature with tests (e.g., multiply/divide buttons)
- Set up branch protection rules

## Assessment Criteria

Consider evaluating:
- ✅ Repository properly set up with team access
- ✅ CI/CD pipeline configured correctly
- ✅ Tests pass in GitHub Actions
- ✅ Application successfully deploys to GitHub Pages
- ✅ Evidence of PR workflow usage
- ✅ Team collaboration evident in commit history

