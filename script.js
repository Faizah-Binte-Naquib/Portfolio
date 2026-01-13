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
    {
        name: "OCR Optimization Framework",
        description: "End-to-end framework for OCR preprocessing that eliminates bounding-box annotations. Utilizes a transformer-based approximator to improve Word Error Rate by up to 0.44 and reduce OCR query calls by up to 98.14%, achieving performance on par with Google Vision API.",
        tech: ["Python", "PyTorch", "Transformers", "Computer Vision", "OCR"],
        achievements: [
            "Reduced OCR query calls by up to 98.14% through efficient preprocessing",
            "Improved Word Error Rate by up to 0.44 compared to baseline methods",
            "Eliminated dependency on bounding-box annotations",
            "Research project aligned with M.Sc. thesis work"
        ],
        link: "https://github.com/Faizah-Binte-Naquib/OPTIMIZING-OCR-PERFORMANCE-WITH-AN-EFFICIENT-BLACK-BOX-APPROXIMATION-FRAMEWORK",
        icon: "fas fa-eye"
    },
    {
        name: "Manga Reading Website",
        description: "Full-stack web platform for exploring, reading, rating, and managing favorite manga. Features user authentication, personalized libraries, reading progress tracking, and detailed manga information with summaries, genres, and ratings.",
        tech: ["JavaScript", "React", "Node.js", "MongoDB", "Full-Stack"],
        achievements: [
            "Built complete full-stack application with user authentication",
            "Implemented personalized library and reading progress tracking",
            "Created intuitive UI/UX for manga browsing and discovery",
            "Demonstrates modern web development practices"
        ],
        link: "https://github.com/Faizah-Binte-Naquib/Manga-Reading-Website",
        icon: "fas fa-book-open"
    },
    {
        name: "Docker Compose Project",
        description: "Full-stack application with React frontend, Flask backend, and MySQL database, containerized with Docker Compose. Features a form for user information input with real-time table updates, demonstrating modern DevOps practices.",
        tech: ["React", "Flask", "MySQL", "Docker", "Docker Compose", "DevOps"],
        achievements: [
            "Containerized full-stack application with Docker",
            "Implemented microservices architecture with Docker Compose",
            "Demonstrates modern DevOps and containerization skills",
            "Full-stack integration with React, Flask, and MySQL"
        ],
        link: "https://github.com/Faizah-Binte-Naquib/Docker-Compose-Project",
        icon: "fas fa-docker"
    },
    {
        name: "Online Shopping Platform",
        description: "E-commerce web application for seamless clothing shopping experience. Features user accounts, shopping cart, secure checkout, and admin panel for product and order management. Demonstrates understanding of business logic and e-commerce workflows.",
        tech: ["JavaScript", "React", "Node.js", "E-commerce", "Full-Stack"],
        achievements: [
            "Built complete e-commerce platform with user and admin roles",
            "Implemented shopping cart and secure checkout functionality",
            "Created admin dashboard for product and order management",
            "Demonstrates full-stack development and business logic implementation"
        ],
        link: "https://github.com/Faizah-Binte-Naquib/Online-Shopping",
        icon: "fas fa-shopping-cart"
    },
    {
        name: "Pokedex Web App",
        description: "React-based web application for exploring Pokémon data interactively. Fetches data from PokeAPI to display detailed information including species, abilities, and types. Features search functionality and intuitive UI design.",
        tech: ["React", "JavaScript", "REST API", "Frontend"],
        achievements: [
            "Built interactive React application with API integration",
            "Implemented search and filtering functionality",
            "Created engaging UI/UX with modern React patterns",
            "Demonstrates frontend development and API consumption skills"
        ],
        link: "https://github.com/Faizah-Binte-Naquib/Pokedex",
        icon: "fas fa-mobile-alt"
    },
    {
        name: "My Anime Companion",
        description: "Full-stack website for tracking anime watch lists and accessing detailed anime information. Features user accounts, personalized watch lists, and comprehensive anime database with search and filtering capabilities.",
        tech: ["PHP", "MySQL", "JavaScript", "Full-Stack"],
        achievements: [
            "Built complete content management system for anime tracking",
            "Implemented user authentication and personalized watch lists",
            "Created search and filtering functionality",
            "Demonstrates full-stack development with PHP and MySQL"
        ],
        link: "https://github.com/Faizah-Binte-Naquib/My-Anime-Companion",
        icon: "fas fa-tv"
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
 
 