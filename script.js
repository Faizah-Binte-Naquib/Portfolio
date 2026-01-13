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
const featuredRepos = [
    {
        name: "OCR Optimization Framework",
        description: "Research project optimizing OCR performance through black-box approximation on full-resolution text images. This work reduced OCR query calls by 95% and improved Word Error Rate by 30.31%.",
        tech: ["Python", "PyTorch", "OpenCV", "Computer Vision", "OCR"],
        achievements: [
            "Reduced OCR query calls by 95% through bounding-box dependency reduction",
            "Improved Word Error Rate by 30.31% compared to prior methods",
            "Addressed resolution variability in large-scale OCR systems",
            "Intuit-funded research project"
        ],
        link: "https://github.com/Faizah-Binte-Naquib",
        icon: "fas fa-eye"
    },
    {
        name: "Finger Vein Biometric System",
        description: "Biometric authentication pipeline combining vein extraction using Modified Maximum Curvature Method (MMCM) with deep learning classification. Achieved 98.87% classification accuracy.",
        tech: ["Python", "Deep Learning", "Computer Vision", "Biometrics", "OpenCV"],
        achievements: [
            "Achieved 98.87% classification accuracy on evaluated datasets",
            "Designed preprocessing to mitigate shading and deformation",
            "Published research papers at IEEE conferences",
            "Won Third Best Paper Award at ICCIT 2020"
        ],
        link: "https://github.com/Faizah-Binte-Naquib",
        icon: "fas fa-fingerprint"
    },
    {
        name: "Autonomous Vehicle Perception Module",
        description: "Perception module for Autoware-based autonomous systems, including object detection, 3D mapping, and sensor fusion. Optimized for deployment on automotive-grade edge computing hardware.",
        tech: ["C++", "ROS2", "Autoware", "PyTorch", "LiDAR", "Computer Vision"],
        achievements: [
            "Customized modular pipelines for hardware stack",
            "Trained detection models for pedestrians and vehicles",
            "Optimized models using quantization and pruning",
            "Implemented obstructed sensor detection for cameras and LiDAR"
        ],
        link: "https://github.com/Faizah-Binte-Naquib",
        icon: "fas fa-car"
    },
    {
        name: "Healthcare Document OCR Pipeline",
        description: "OCR pipeline for healthcare document ingestion with LLM-based field extraction. Leveraged GPT-style and LLaMA models with prompt engineering for clinical document understanding.",
        tech: ["Python", "LLM", "GPT", "LLaMA", "OCR", "NLP", "Prompt Engineering"],
        achievements: [
            "Designed and implemented OCR pipelines for healthcare documents",
            "Leveraged large language models for document understanding",
            "Applied prompt engineering and one-shot learning",
            "Improved field extraction accuracy for clinical documents"
        ],
        link: "https://github.com/Faizah-Binte-Naquib",
        icon: "fas fa-file-medical"
    },
    {
        name: "3D Mapping for Autonomous Navigation",
        description: "Tools and pipelines for creating and maintaining 3D maps for autonomous navigation, including Lanelet2 maps, mesh representations, and point cloud extraction.",
        tech: ["C++", "ROS2", "Lanelet2", "Point Clouds", "3D Mapping"],
        achievements: [
            "Created and maintained 3D maps for autonomous navigation",
            "Implemented Lanelet2 map generation",
            "Developed mesh representation and point cloud extraction",
            "Integrated with Autoware perception stack"
        ],
        link: "https://github.com/Faizah-Binte-Naquib",
        icon: "fas fa-map"
    },
    {
        name: "ML Model Optimization Toolkit",
        description: "Collection of tools and techniques for optimizing ML models for edge deployment, including quantization, pruning, and profiling utilities for automotive-grade hardware.",
        tech: ["Python", "PyTorch", "Model Optimization", "Quantization", "Pruning"],
        achievements: [
            "Optimized detection models for edge computing hardware",
            "Implemented quantization and pruning techniques",
            "Developed profiling utilities for performance analysis",
            "Reduced model size while maintaining accuracy"
        ],
        link: "https://github.com/Faizah-Binte-Naquib",
        icon: "fas fa-cogs"
    }
];

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

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
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
