# React CI/CD Exercise with GitHub Actions

**Time Required:** ~45 minutes  
**Learning Objectives:**
- Understand a React TypeScript application with automated testing
- Implement continuous integration (CI) with GitHub Actions
- Deploy automatically to GitHub Pages (CD)
- Experience the full CI/CD pipeline
- Practice team collaboration with Git workflows

## Prerequisites
- Node.js and npm installed
- Git installed
- GitHub account
- Basic familiarity with React and command line
- (Optional) GitHub CLI (`gh`) for faster repository setup

## 📦 Application Location

The starter application is provided in the `react-cicd-demo/` directory. Copy this entire directory to begin the exercise.

## Team Setup (5 minutes)

**This is a team exercise. One team member should:**

1. Create a new repository on GitHub named `react-cicd-demo`
   
   **Option A: Using GitHub Web Interface**
   - Go to github.com and click the **"+"** in the top-right → **"New repository"**
   - Repository name: `react-cicd-demo`
   - Make it **public** (required for GitHub Pages)
   - Do NOT initialize with README, .gitignore, or license
   - Click **"Create repository"**
   
   **Option B: Using GitHub CLI** (if you have `gh` installed)
   ```bash
   gh repo create react-cicd-demo --public --description "React CI/CD Demo"
   ```
   This creates the repository without cloning it yet.
   
   **Option C: Skip this step** if you plan to use Workflow A in Part 2 (local-first with `gh` CLI) - it will create the repo automatically.

2. Invite team members as collaborators:
   
   **Note:** If using Workflow A (local-first), do this AFTER pushing your code in Part 2.
   
   **Option A: Using GitHub Web Interface**
   - Go to repository **Settings** → **Collaborators**
   - Click **Add people**
   - Add each team member's GitHub username
   - Add the professor: **sillyfunnypedro**
   
   **Option B: Using GitHub CLI**
   ```bash
   # Invite team members (replace with actual usernames)
   gh repo set-access react-cicd-demo --user teammate1 --permission push
   gh repo set-access react-cicd-demo --user teammate2 --permission push
   
   # Invite the professor
   gh repo set-access react-cicd-demo --user sillyfunnypedro --permission push
   ```

3. **Important:** Make sure the professor **sillyfunnypedro** is invited!

4. If using Workflow B, keep the repository page open - you'll clone it in Part 2

**All other team members should:**
- Accept the collaboration invitation (check email or GitHub notifications)
- Clone the repository once the first member has pushed the initial code

## Part 1: Understanding the Provided Application (5 minutes)

**The application has been created for you.** Take a few minutes to explore the files and understand the structure.

### Project Structure
```
react-cicd-demo/
├── src/
│   ├── App.tsx          # Main component with counter logic (TypeScript)
│   ├── App.test.tsx     # Test suite for App component (TypeScript)
│   ├── main.tsx         # React entry point (TypeScript)
│   ├── setupTests.ts    # Jest setup with jest-dom matchers
│   └── App.css          # Styling
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── tsconfig.node.json   # TypeScript config for Node
├── vite.config.ts       # Vite bundler configuration (TypeScript)
├── jest.config.js       # Jest test configuration
├── .babelrc            # Babel transpiler configuration
└── .gitignore          # Git ignore rules
```

### Key Features
- **TypeScript** for type safety and better developer experience
- **Simple counter app** with increment and reset buttons
- **Comprehensive test suite** using React Testing Library
- **Vite** for fast development and building
- **Jest** configured for testing TypeScript

### Install Dependencies and Test Locally
```bash
# Navigate to the provided application directory
cd react-cicd-demo

# Install all dependencies
npm install

# Run tests (should all pass)
npm test

# Start development server (optional)
npm run dev
```

If you run the dev server, visit `http://localhost:5173` to see your app running.

**Checkpoint:** Make sure all tests pass before continuing!

**Note:** Don't worry about git yet - you'll set that up in Part 2 after cloning your team's repository.

## Part 2: Push Application to GitHub (5 minutes)

**The designated team member who created the GitHub repo should choose ONE of these workflows:**

---

### Workflow A: Local-First with GitHub CLI (Fastest!)

**If you have `gh` CLI installed and already have the application files:**

```bash
# Navigate to the provided application directory
cd react-cicd-demo

# Initialize git repository
git init

# Add all files
git add -A

# Create initial commit
git commit -m "Initial commit: React TypeScript app with tests"

# Create GitHub repo and push in one command
gh repo create react-cicd-demo --public --source=. --remote=origin --push
```

That's it! Your code is now on GitHub. Skip to Part 3.

---

### Workflow B: Clone Empty Repository First

**If you prefer the traditional workflow or don't have `gh` CLI:**

#### Step 1: Clone the Empty Repository
```bash
# Replace YOUR-USERNAME with your actual GitHub username
git clone https://github.com/YOUR-USERNAME/react-cicd-demo.git

# Navigate into the cloned repository
cd react-cicd-demo
```

#### Step 2: Copy the Application Files

**Important:** You need to copy ALL files including hidden files (`.gitignore`, `.babelrc`, etc.)

**Option 1: Using Command Line (Mac/Linux)**
```bash
# Navigate to where your empty repo is
cd react-cicd-demo

# Copy all files (including hidden ones) from the provided directory
# Replace /path/to/provided/react-cicd-demo with the actual path
cp -r /path/to/provided/react-cicd-demo/. .

# Verify hidden files were copied
ls -la
```

**Option 2: Using Finder (Mac) or File Explorer (Windows)**
1. Open the provided `react-cicd-demo` folder in Finder/File Explorer
2. Press `Cmd+Shift+.` (Mac) or enable "Show hidden files" (Windows)
3. Select ALL files and folders (including hidden files starting with `.`)
4. Copy them to your cloned `react-cicd-demo` directory
5. Verify `.gitignore` and `.babelrc` are present

#### Step 3: Verify Files Before Committing
```bash
# Check what files were copied (should see hidden files too)
ls -la

# You should see at least these files:
# .babelrc, .gitignore, index.html, jest.config.js,
# package.json, tsconfig.json, tsconfig.node.json, vite.config.ts,
# and the src/ directory (which includes setupTests.ts)

# If any are missing, go back to Step 2 and copy them
```

#### Step 4: Add, Commit, and Push
```bash
# Add all files to git
git add .

# Check what will be committed
git status

# Create initial commit
git commit -m "Initial commit: React TypeScript app with tests"

# Push to GitHub
git push origin main
```

---

### Verify on GitHub (Both Workflows)

Regardless of which workflow you used:

- Visit your repository on GitHub
- Confirm all files are present (especially `.gitignore` and `.babelrc`)
- Check that the commit history shows your initial commit

**Teammates can now clone and set up:**
```bash
git clone https://github.com/YOUR-USERNAME/react-cicd-demo.git
cd react-cicd-demo
npm install
```

## Part 3: Configure GitHub Actions for CI/CD (15 minutes)

### Step 1: Create GitHub Actions Workflow
Create `.github/workflows/ci-cd.yml`:
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
      
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm test
      
    - name: Build application
      run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
      
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build application
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### Step 2: Commit and Push Workflow
```bash
git add .github/
git commit -m "Add CI/CD workflow"
git push
```

### Step 3: Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Source", select **Deploy from a branch**
4. Select branch: **gh-pages** and folder: **/ (root)**
5. Click **Save**

### Step 4: Verify the Pipeline
1. Go to the **Actions** tab in your repository
2. You should see your workflow running
3. Watch as it runs tests and deploys
4. Once complete, your site will be available at: `https://YOUR-USERNAME.github.io/react-cicd-demo/`

## Part 4: Test the CI/CD Pipeline (15 minutes)

### Exercise 1: Make a Feature Change
1. Create a new branch:
   ```bash
   git checkout -b feature/add-decrement
   ```

2. Modify `src/App.tsx` to add a decrement button:
   ```typescript
   <button onClick={() => setCount(count - 1)}>
     Decrement
   </button>
   ```

3. Add a test in `src/App.test.tsx`:
   ```typescript
   test('decrement button decreases count', () => {
     render(<App />)
     const incrementButton = screen.getByText(/Increment/i)
     const decrementButton = screen.getByText(/Decrement/i)
     
     fireEvent.click(incrementButton)
     fireEvent.click(incrementButton)
     fireEvent.click(decrementButton)
     
     const count = screen.getByText(/Click count: 1/i)
     expect(count).toBeInTheDocument()
   })
   ```

4. Commit and push:
   ```bash
   git add .
   git commit -m "Add decrement button"
   git push origin feature/add-decrement
   ```

5. **Create a Pull Request on GitHub:**
   
   After pushing, you'll see a message in your terminal with a link, or:
   
   - Go to your repository on GitHub
   - You'll see a **yellow banner** at the top saying "**feature/add-decrement** had recent pushes" with a green **"Compare & pull request"** button
   - Click **"Compare & pull request"**
   
   **Alternative method** (if you don't see the banner):
   - Click the **"Pull requests"** tab at the top
   - Click the green **"New pull request"** button
   - Select your branch from the "compare" dropdown
   
   Fill in the PR details:
   - **Title**: "Add decrement button" (auto-filled from commit message)
   - **Description**: Add a brief description like "Adds a decrement button to decrease the counter"
   - Click **"Create pull request"**

6. **Observe**: GitHub Actions runs tests automatically on your PR
   - Look for the "Checks" section below your PR description
   - You'll see "CI/CD Pipeline" running
   - Wait for it to complete (should show a green checkmark ✓)

7. **Merge the PR after tests pass:**
   - Once tests pass, click the **"Merge pull request"** button
   - Click **"Confirm merge"**
   - Optionally, click **"Delete branch"** to clean up

8. **Observe**: The deploy job runs automatically
   - Go to the **Actions** tab
   - You'll see the deployment running for the main branch
   - Wait for it to complete

9. Visit your GitHub Pages site to see the changes live:
   - `https://YOUR-USERNAME.github.io/react-cicd-demo/`
   - You should now see the decrement button!

### Exercise 2: Break the Build (Intentionally)
1. Create another branch:
   ```bash
   git checkout main
   git pull
   git checkout -b feature/broken-test
   ```

2. Modify `src/App.tsx` to change the heading text:
   ```typescript
   <h1>React CI/CD Updated</h1>
   ```

3. Don't update the test (so it will fail)

4. Push and create a PR:
   ```bash
   git add .
   git commit -m "Update heading"
   git push origin feature/broken-test
   ```

5. **Observe**: Tests fail in the PR, preventing merge
   - Create the PR the same way as Exercise 1
   - Notice the **red X** instead of a green checkmark
   - Click on "Details" to see which test failed
   - GitHub won't let you merge (if branch protection is enabled)

6. Fix the test in `src/App.test.tsx`:
   ```typescript
   const heading = screen.getByText(/React CI\/CD Updated/i)
   ```

7. Commit and push the fix:
   ```bash
   git add .
   git commit -m "Fix test for updated heading"
   git push origin feature/broken-test
   ```
   - **Observe**: Tests automatically re-run and should now pass ✓

8. Merge the PR and observe automatic deployment

## Discussion Questions

1. **What is the purpose of the `needs: test` line in the deploy job?**
   - Answer: It ensures deployment only happens if tests pass

2. **Why do we run tests on pull requests before merging?**
   - Answer: To catch bugs before they reach the main branch

3. **What happens if you push broken code directly to main?**
   - Answer: Tests will fail but code is already merged; deployment may fail

4. **How could you add code linting to this pipeline?**
   - Answer: Add ESLint and a linting step before tests

5. **What are the benefits of automated deployment?**
   - Answer: Consistency, speed, reduced human error, immediate feedback

## Extension Ideas

- Add ESLint for code quality checks
- Add code coverage reporting
- Set up multiple environments (staging, production)
- Add Slack or email notifications for build failures
- Implement semantic versioning and automated releases
- Add security scanning with tools like Snyk or Dependabot

## Troubleshooting

**Tests fail locally but not in CI:**
- Check Node.js versions match
- Ensure all dependencies are in package.json

**Deployment fails:**
- Verify GitHub Pages is enabled
- Check that base path in vite.config.js matches repo name
- Ensure GITHUB_TOKEN has correct permissions

**Site shows 404:**
- Wait a few minutes for GitHub Pages to build
- Check the base path configuration
- Verify files are in the gh-pages branch