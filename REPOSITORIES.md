# How to Add Your Real GitHub Repositories

This guide will help you replace the placeholder repositories with your actual GitHub projects.

## Step 1: Review Your GitHub Repositories

1. Visit your GitHub profile: https://github.com/Faizah-Binte-Naquib?tab=repositories
2. Identify repositories that are:
   - Well-documented (have README files)
   - Showcase your skills
   - Have interesting features or achievements
   - Are not forks (unless significantly modified)

## Step 2: Update the featuredRepos Array

Open `script.js` and find the `featuredRepos` array (around line 35).

For each repository you want to feature, add an object like this:

```javascript
{
    name: "Repository Name",
    description: "A clear, concise description of what the project does. What problem does it solve? What makes it interesting?",
    tech: ["Python", "PyTorch", "OpenCV", "Docker"], // Technologies used
    achievements: [
        "Key achievement or feature 1",
        "Key achievement or feature 2",
        "Notable result or impact"
    ],
    link: "https://github.com/Faizah-Binte-Naquib/repo-name",
    icon: "fas fa-brain" // Choose an appropriate Font Awesome icon
}
```

## Step 3: Choose Appropriate Icons

Visit [Font Awesome Icons](https://fontawesome.com/icons) to find suitable icons. Common choices:
- `fas fa-brain` - AI/ML projects
- `fas fa-eye` - Computer vision
- `fas fa-robot` - Robotics
- `fas fa-code` - General coding
- `fas fa-chart-line` - Data analysis
- `fas fa-mobile-alt` - Mobile apps
- `fas fa-globe` - Web projects
- `fas fa-database` - Database projects

## Step 4: Tips for Good Descriptions

- **Be specific**: Instead of "A machine learning project", say "OCR optimization framework that reduces query calls by 95%"
- **Highlight impact**: Mention metrics, improvements, or real-world applications
- **Show technical depth**: Mention specific techniques, algorithms, or frameworks used
- **Keep it concise**: 1-2 sentences for description, 3-5 bullet points for achievements

## Example

Here's a good example based on your CV:

```javascript
{
    name: "OCR-Optimization-Framework",
    description: "Research project optimizing OCR performance through black-box approximation. Reduced OCR query calls by 95% and improved Word Error Rate by 30.31% compared to baseline methods.",
    tech: ["Python", "PyTorch", "OpenCV", "Computer Vision", "OCR"],
    achievements: [
        "Reduced OCR query calls by 95% through bounding-box dependency reduction",
        "Improved Word Error Rate by 30.31% compared to prior methods",
        "Addressed resolution variability in large-scale OCR systems",
        "Intuit-funded research project"
    ],
    link: "https://github.com/Faizah-Binte-Naquib/OCR-Optimization-Framework",
    icon: "fas fa-eye"
}
```

## Step 5: Test Your Changes

1. Save `script.js`
2. Refresh your portfolio website
3. Check that all links work
4. Verify descriptions are accurate

## Optional: Automatically Fetch Repos

If you want to automatically fetch repository information from GitHub API, you can uncomment the `fetchGitHubRepos()` function in `script.js` and modify it to populate the `featuredRepos` array automatically. However, manual curation usually produces better results.

---

**Note**: Only feature repositories you're proud of and that accurately represent your skills. Quality over quantity!
