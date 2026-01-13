// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Highlight active section in navigation
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Featured Repositories Data
// TODO: Replace these with your actual GitHub repositories
// Visit https://github.com/Faizah-Binte-Naquib?tab=repositories to see your repos
// For each repo, add an object with: name, description, tech (array), achievements (array), link, icon (Font Awesome class)

const featuredRepos = [
    // Example structure - replace with your real repositories:
    // {
    //     name: "Repository Name",
    //     description: "Brief description of what the project does and its purpose.",
    //     tech: ["Python", "PyTorch", "OpenCV"],
    //     achievements: [
    //         "Achievement or key feature 1",
    //         "Achievement or key feature 2",
    //         "Achievement or key feature 3"
    //     ],
    //     link: "https://github.com/Faizah-Binte-Naquib/repo-name",
    //     icon: "fas fa-icon-name" // See https://fontawesome.com/icons for options
    // },
    
    // Placeholder - remove this and add your real repos below
    {
        name: "Your Repository Name",
        description: "Add your actual repositories from GitHub. Look for well-documented, interesting projects that showcase your skills.",
        tech: ["Tech Stack"],
        achievements: [
            "Key achievement or feature",
            "Another notable aspect"
        ],
        link: "https://github.com/Faizah-Binte-Naquib",
        icon: "fas fa-code"
    }
];

// Helper function to fetch repository info from GitHub API (optional)
// Uncomment and use if you want to automatically fetch repo data
/*
async function fetchGitHubRepos() {
    try {
        const response = await fetch('https://api.github.com/users/Faizah-Binte-Naquib/repos?sort=updated&per_page=10');
        const repos = await response.json();
        
        // Filter and format repos
        return repos
            .filter(repo => !repo.fork && repo.description) // Only non-forked repos with descriptions
            .map(repo => ({
                name: repo.name,
                description: repo.description,
                link: repo.html_url,
                stars: repo.stargazers_count,
                language: repo.language
            }));
    } catch (error) {
        console.error('Error fetching GitHub repos:', error);
        return [];
    }
}
*/

// Render repositories
function renderRepositories() {
    const reposGrid = document.querySelector('.repos-grid');
    if (!reposGrid) return;

    reposGrid.innerHTML = featuredRepos.map(repo => `
        <div class="repo-card">
            <div class="repo-header">
                <i class="${repo.icon} repo-icon"></i>
                <a href="${repo.link}" target="_blank" class="repo-name">${repo.name}</a>
            </div>
            <p class="repo-description">${repo.description}</p>
            <div class="repo-tech">
                ${repo.tech.map(tech => `<span class="repo-tech-tag">${tech}</span>`).join('')}
            </div>
            <div class="repo-achievements">
                <h4>Key Achievements:</h4>
                <ul>
                    ${repo.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                </ul>
            </div>
            <a href="${repo.link}" target="_blank" class="repo-link">
                View on GitHub <i class="fas fa-external-link-alt"></i>
            </a>
        </div>
    `).join('');
}

// Handle profile image
function loadProfileImage() {
    const profileImage = document.getElementById('profileImage');
    const profilePlaceholder = document.getElementById('profilePlaceholder');
    
    if (profileImage) {
        profileImage.onload = function() {
            profileImage.classList.add('show');
            if (profilePlaceholder) {
                profilePlaceholder.classList.add('hidden');
            }
        };
        
        profileImage.onerror = function() {
            // Image failed to load, keep placeholder visible
            if (profilePlaceholder) {
                profilePlaceholder.classList.remove('hidden');
            }
        };
        
        // Try to load the image
        const img = new Image();
        img.src = profileImage.src;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadProfileImage();
    renderRepositories();
});

// Add fade-in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
});
