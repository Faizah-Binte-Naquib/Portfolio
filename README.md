# Faizah Binte Naquib - Portfolio

A modern, responsive portfolio website showcasing my work as a Machine Learning Engineer. This website serves as both a digital resume and a portfolio of my projects and achievements.

## 🚀 Features

- **Modern Design**: Clean, professional interface with smooth animations
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile devices
- **Interactive Navigation**: Smooth scrolling with active section highlighting
- **Featured Repositories**: Showcases key projects with detailed descriptions
- **Complete CV Content**: All sections from professional summary to publications

## 📋 Sections

- **Professional Summary**: Overview of experience and expertise
- **Skills**: Programming languages, frameworks, and technologies
- **Industry Experience**: Detailed work history with achievements
- **Education**: Academic background with thesis information
- **Publications**: Research papers and manuscripts
- **Featured Repositories**: Highlighted projects with tech stacks and achievements
- **Fellowships & Awards**: Recognition and accomplishments

## 🛠️ Tech Stack

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **JavaScript**: Interactive features and smooth scrolling
- **Font Awesome**: Icons for visual enhancement
- **Google Fonts**: Inter font family for typography

## 📦 Setup & Deployment

### Local Development

1. Clone this repository:
```bash
git clone https://github.com/Faizah-Binte-Naquib/portfolio.git
cd portfolio
```

2. Open `index.html` in your web browser or use a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve
```

3. Navigate to `http://localhost:8000` in your browser

### GitHub Pages Deployment

1. Push this repository to GitHub
2. Go to repository Settings → Pages
3. Select the branch (usually `main` or `master`)
4. Select the folder (usually `/root`)
5. Click Save
6. Your site will be available at `https://[username].github.io/portfolio/`

### Custom Domain (Optional)

1. Add a `CNAME` file in the root directory with your domain name
2. Configure DNS settings with your domain provider
3. Update GitHub Pages settings to use your custom domain

## 📝 Customization

### Updating Repository Information

Edit the `featuredRepos` array in `script.js` to update repository details:

```javascript
const featuredRepos = [
    {
        name: "Your Repository Name",
        description: "Description of your project",
        tech: ["Tech1", "Tech2", "Tech3"],
        achievements: [
            "Achievement 1",
            "Achievement 2"
        ],
        link: "https://github.com/yourusername/repo",
        icon: "fas fa-icon-name"
    }
];
```

### Styling

Modify `styles.css` to customize colors, fonts, and layout. Key CSS variables are defined in `:root`:

```css
:root {
    --primary-color: #2563eb;
    --primary-dark: #1e40af;
    --secondary-color: #64748b;
    /* ... */
}
```

### Content

Update `index.html` to modify any section content, including:
- Contact information
- Professional summary
- Skills
- Experience entries
- Education details
- Publications

## 📄 License

This project is open source and available under the MIT License.

## 📧 Contact

- **Email**: faizahbintenaquib@gmail.com
- **Phone**: (+1) 780-710-1627
- **GitHub**: [Faizah-Binte-Naquib](https://github.com/Faizah-Binte-Naquib)
- **LinkedIn**: [fbnaquib-a07932174](https://www.linkedin.com/in/fbnaquib-a07932174/)

---

Built with ❤️ by Faizah Binte Naquib
