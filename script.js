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
            // Update URL without jumping
            if (history.pushState) {
                history.pushState(null, null, this.getAttribute('href'));
            }
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
        description: "React-based web application for exploring Pokemon data interactively. Fetches data from PokeAPI to display detailed information including species, abilities, and types. Features search functionality and intuitive UI design.",
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
    if (!reposGrid) {
        console.error('Repository grid not found!');
        return;
    }
    if (!featuredRepos || featuredRepos.length === 0) {
        console.warn('No featured repositories to display');
        reposGrid.innerHTML = '<p>No repositories to display.</p>';
        return;
    }
    console.log(`Rendering ${featuredRepos.length} repositories`);
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
    initCodeRain();
    rotateFunFacts();
    addEmojiReactions();
    addEasterEgg();
    initOCRDemo();
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

// Code Rain Effect
function initCodeRain() {
    const canvas = document.getElementById('codeRain');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = [];
    
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -100;
    }
    
    function draw() {
        ctx.fillStyle = 'rgba(26, 26, 26, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = 'rgba(167, 139, 250, 0.3)';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;
            
            ctx.fillText(text, x, y);
            
            if (y > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(draw, 50);
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Fun Facts Rotation
const funFacts = [
    "Did you know? I once debugged a model for 3 days only to find a typo in a variable name 😅",
    "Fun fact: I've read over 1000+ manga! 📚",
    "Random tidbit: I've watched One Piece (1000+ episodes) three times 🏴‍☠️",
    "Did you know? I once built a full-stack app in 24 hours for a hackathon ⚡",
    "Fun fact: My first programming language was C 💜",
    "Random tidbit: I knit in my spare time 🧶",
    "Did you know? I can draw! 🎨"
];

let currentFactIndex = 0;

function rotateFunFacts() {
    const funFactText = document.getElementById('funFactText');
    if (!funFactText) return;
    
    // Add transition style
    funFactText.style.transition = 'opacity 0.3s ease';
    
    setInterval(() => {
        funFactText.style.opacity = '0';
        setTimeout(() => {
            currentFactIndex = (currentFactIndex + 1) % funFacts.length;
            funFactText.textContent = funFacts[currentFactIndex];
            funFactText.style.opacity = '1';
        }, 300);
    }, 8000); // Change every 8 seconds
}

// Emoji Reactions on Hover
function addEmojiReactions() {
    const hoverableElements = document.querySelectorAll('.section-title, .repo-card, .article-card, .award-item, .company, .institution');
    
    const emojis = ['✨', '🌟', '💫', '⭐', '🎯', '🚀', '💡', '🔥', '🎨', '⚡'];
    
    hoverableElements.forEach(element => {
        let emojiTimeout;
        
        element.addEventListener('mouseenter', () => {
            emojiTimeout = setInterval(() => {
                const emoji = document.createElement('div');
                emoji.className = 'emoji-reaction';
                emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                
                const rect = element.getBoundingClientRect();
                emoji.style.left = (rect.left + Math.random() * rect.width) + 'px';
                emoji.style.top = (rect.top + Math.random() * rect.height) + 'px';
                
                document.body.appendChild(emoji);
                
                setTimeout(() => {
                    emoji.remove();
                }, 1500);
            }, 400);
        });
        
        element.addEventListener('mouseleave', () => {
            clearInterval(emojiTimeout);
        });
    });
}

// Easter Egg on Profile Click
function addEasterEgg() {
    const profileImage = document.getElementById('profileImage');
    const profilePlaceholder = document.getElementById('profilePlaceholder');
    const profileName = document.getElementById('profileName');
    let clickCount = 0;
    let clickTimeout;
    
    const easterEggHandler = () => {
        clickCount++;
        clearTimeout(clickTimeout);
        
        if (clickCount === 5) {
            // Easter egg triggered!
            const easterEggMessages = [
                "🎉 You found the easter egg!",
                "🌟 Secret unlocked!",
                "✨ You're persistent!",
                "🚀 Hidden feature activated!",
                "💫 You're awesome!"
            ];
            
            const message = easterEggMessages[Math.floor(Math.random() * easterEggMessages.length)];
            
            if (profileName) {
                profileName.classList.add('easter-egg-active');
                setTimeout(() => {
                    profileName.classList.remove('easter-egg-active');
                }, 600);
            }
            
            // Show confetti or celebration
            for (let i = 0; i < 20; i++) {
                setTimeout(() => {
                    const emoji = document.createElement('div');
                    emoji.className = 'emoji-reaction';
                    emoji.textContent = ['🎉', '✨', '🌟', '🎊', '⭐'][Math.floor(Math.random() * 5)];
                    emoji.style.left = (window.innerWidth / 2 + (Math.random() - 0.5) * 200) + 'px';
                    emoji.style.top = (window.innerHeight / 2 + (Math.random() - 0.5) * 200) + 'px';
                    emoji.style.fontSize = '2rem';
                    document.body.appendChild(emoji);
                    
                    setTimeout(() => emoji.remove(), 2000);
                }, i * 50);
            }
            
            clickCount = 0;
        }
        
        clickTimeout = setTimeout(() => {
            clickCount = 0;
        }, 1000);
    };
    
    if (profileImage) {
        profileImage.addEventListener('click', easterEggHandler);
    }
    if (profilePlaceholder) {
        profilePlaceholder.addEventListener('click', easterEggHandler);
    }
    if (profileName) {
        profileName.addEventListener('click', easterEggHandler);
    }
}

// OCR & LLM Demo Functionality
function initOCRDemo() {
    const canvas = document.getElementById('drawingCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const clearBtn = document.getElementById('clearCanvas');
    const processBtn = document.getElementById('processOCR');
    const canvasOverlay = document.getElementById('canvasOverlay');
    const ocrResult = document.getElementById('ocrResult');
    const llmResult = document.getElementById('llmResult');
    const ocrStatus = document.getElementById('ocrStatus');
    const llmStatus = document.getElementById('llmStatus');

    let isDrawing = false;
    let hasContent = false;

    // Set canvas size to match its display size
    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        
        // Set internal size accounting for device pixel ratio
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        
        // Scale context to account for device pixel ratio
        ctx.scale(dpr, dpr);
        
        // Re-apply drawing settings after resize (thicker stroke = better for OCR)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, rect.width, rect.height);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }

    // Initialize canvas size
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Helper function to get correct coordinates
    function getCanvasCoordinates(e) {
        const rect = canvas.getBoundingClientRect();
        
        const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
        const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
        
        // Calculate coordinates relative to canvas display size (not internal size)
        // The context is already scaled, so we use display coordinates directly
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }

    // Drawing functionality
    function startDrawing(e) {
        isDrawing = true;
        hasContent = true;
        canvasOverlay.style.display = 'none';
        const coords = getCanvasCoordinates(e);
        ctx.beginPath();
        ctx.moveTo(coords.x, coords.y);
    }

    function draw(e) {
        if (!isDrawing) return;
        const coords = getCanvasCoordinates(e);
        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();
    }

    function stopDrawing() {
        if (isDrawing) {
            isDrawing = false;
            ctx.beginPath();
        }
    }

    // Mouse events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    // Touch events for mobile
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startDrawing(e);
    });

    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        draw(e);
    });

    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        stopDrawing();
    });

    // Clear canvas
    clearBtn.addEventListener('click', () => {
        const rect = canvas.getBoundingClientRect();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, rect.width, rect.height);
        hasContent = false;
        canvasOverlay.style.display = 'flex';
        ocrResult.innerHTML = '<p class="placeholder-text">OCR results will appear here...</p>';
        llmResult.innerHTML = '<p class="placeholder-text">Refined text will appear here after OCR...</p>';
        updateStatus(ocrStatus, 'ready', 'Ready');
        updateStatus(llmStatus, 'ready', 'Ready');
    });

    // Preprocess image for OCR: upscale + binarize (black text on white)
    function preprocessImage(canvas) {
        const processedCanvas = document.createElement('canvas');
        const processedCtx = processedCanvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;
        const scale = 4;
        processedCanvas.width = w * scale;
        processedCanvas.height = h * scale;
        processedCtx.drawImage(canvas, 0, 0, w, h, 0, 0, processedCanvas.width, processedCanvas.height);
        const imageData = processedCtx.getImageData(0, 0, processedCanvas.width, processedCanvas.height);
        const data = imageData.data;
        // Binarize: use lower threshold (160) so anti-aliased strokes stay black; 200 was wiping "is wrong?"
        const threshold = 160;
        for (let i = 0; i < data.length; i += 4) {
            const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
            const v = gray >= threshold ? 255 : 0;
            data[i] = data[i + 1] = data[i + 2] = v;
        }
        processedCtx.putImageData(imageData, 0, 0);
        return processedCanvas.toDataURL('image/png');
    }

    // Process OCR with PaddleOCR API (preferred) or Tesseract.js (fallback)
    async function processOCR(imageData) {
        // Hugging Face Space PaddleOCR API endpoint
        // Format: https://{username}-{space_name}.hf.space/ocr
        const PADDLEOCR_ENDPOINT = 'https://yolo12138-paddle-ocr-api.hf.space/ocr';
        // Alternative endpoints:
        // - Local server: 'http://localhost:5000/ocr'
        // - Custom server: 'YOUR_PADDLEOCR_API_ENDPOINT'
        // Note: Hugging Face Spaces may have CORS restrictions. If you get CORS errors,
        // use your own PaddleOCR server (see paddleocr_api_example.py)
        
        // Try PaddleOCR first if endpoint is configured
        if (PADDLEOCR_ENDPOINT && PADDLEOCR_ENDPOINT !== 'YOUR_PADDLEOCR_API_ENDPOINT') {
            try {
                updateStatus(ocrStatus, 'processing', 'Using PaddleOCR...');
                
                // Convert base64 to blob for multipart/form-data
                const base64Data = imageData.split(',')[1];
                const byteCharacters = atob(base64Data);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: 'image/png' });
                
                // Create FormData for multipart/form-data
                const formData = new FormData();
                formData.append('file', blob, 'canvas.png');
                formData.append('lang', 'en'); // 'en' for English, 'ch' for Chinese
                
                const response = await fetch(PADDLEOCR_ENDPOINT, {
                    method: 'POST',
                    body: formData
                    // Don't set Content-Type header - browser will set it with boundary for FormData
                });
                
                if (!response.ok) {
                    throw new Error(`PaddleOCR API error: ${response.statusText}`);
                }
                
                const data = await response.json();
                // Some APIs wrap the array: { result: [...] } or return array directly
                const rawList = Array.isArray(data) ? data : (data.result || data.results || data.data || []);
                
                if (rawList.length > 0) {
                    const items = rawList.map(item => ({ txt: (item.txt || item.text || '').trim(), boxes: item.boxes || [] })).filter(o => o.txt);
                    items.sort((a, b) => {
                        const ay = (a.boxes[0] && a.boxes[0][1]) != null ? a.boxes[0][1] : 0;
                        const by = (b.boxes[0] && b.boxes[0][1]) != null ? b.boxes[0][1] : 0;
                        if (Math.abs(ay - by) > 10) return ay - by;
                        const ax = (a.boxes[0] && a.boxes[0][0]) != null ? a.boxes[0][0] : 0;
                        const bx = (b.boxes[0] && b.boxes[0][0]) != null ? b.boxes[0][0] : 0;
                        return ax - bx;
                    });
                    let paddleText = items.map(o => o.txt).join(' ').trim();
                    // If Paddle returned very little or only one word, try Tesseract and use the longer result
                    const wordCount = paddleText.split(/\s+/).filter(Boolean).length;
                    if (paddleText.length <= 3 || wordCount <= 1) {
                        updateStatus(ocrStatus, 'processing', 'PaddleOCR partial result - trying Tesseract...');
                        const tesseractText = await runTesseract(imageData, ocrStatus);
                        if (tesseractText && tesseractText.length > paddleText.length) return tesseractText;
                    }
                    return paddleText;
                }
                if (data.text) return data.text;
                if (typeof data === 'string') return data;
                return '';
            } catch (error) {
                console.warn('PaddleOCR API failed, falling back to Tesseract:', error);
                if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
                    updateStatus(ocrStatus, 'processing', 'CORS issue - using Tesseract fallback...');
                }
            }
        }
        
        updateStatus(ocrStatus, 'processing', 'Using Tesseract.js...');
        return await runTesseract(imageData, ocrStatus);
    }

    async function runTesseract(imageData, statusEl) {
        const { data: { text } } = await Tesseract.recognize(imageData, 'eng', {
            logger: m => {
                if (m.status === 'recognizing text' && statusEl) {
                    updateStatus(statusEl, 'processing', `Tesseract: ${Math.round(m.progress * 100)}%`);
                }
            },
            tessedit_pageseg_mode: Tesseract.PSM.SINGLE_BLOCK,
        });
        return (text || '').trim();
    }

    // Process OCR
    processBtn.addEventListener('click', async () => {
        if (!hasContent) {
            alert('Please draw or write something on the canvas first!');
            return;
        }

        try {
            // Update status
            updateStatus(ocrStatus, 'processing', 'Preprocessing image...');
            processBtn.disabled = true;
            processBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

            // Preprocess image for better OCR
            const processedImageData = preprocessImage(canvas);
            
            // Perform OCR
            const extractedText = await processOCR(processedImageData);
            const cleanedText = extractedText.trim() || 'No text detected.';

            // Display OCR result
            ocrResult.innerHTML = `<div class="result-text">${escapeHtml(cleanedText)}</div>`;
            updateStatus(ocrStatus, 'success', 'Complete');

            // Now refine with Llama 3.0 via AWS Lambda
            if (cleanedText && cleanedText !== 'No text detected.') {
                await refineWithLlama(cleanedText);
            } else {
                llmResult.innerHTML = '<p class="placeholder-text">No text to refine.</p>';
                updateStatus(llmStatus, 'ready', 'Ready');
            }

        } catch (error) {
            console.error('OCR Error:', error);
            ocrResult.innerHTML = `<div class="error-text">Error: ${escapeHtml(error.message)}<br><small>Try using PaddleOCR API for better results.</small></div>`;
            updateStatus(ocrStatus, 'error', 'Error');
        } finally {
            processBtn.disabled = false;
            processBtn.innerHTML = '<i class="fas fa-eye"></i> Extract Text (OCR)';
        }
    });

    // Refine text with Llama 3.0 via AWS Lambda
    async function refineWithLlama(text) {
        try {
            updateStatus(llmStatus, 'processing', 'Refining with Llama 3.1...');
            
            // Replace with your actual AWS Lambda Function URL
            // Get it from: AWS Lambda Console → Your Function → Configuration → Function URL
            const LAMBDA_ENDPOINT = 'https://vlhcyhksdvgnr2jd6xte3i443m0gbvaa.lambda-url.us-east-2.on.aws/';
            // Example: 'https://abc123xyz.lambda-url.us-west-2.on.aws/'
            
            // If endpoint is not configured, show a placeholder response
            if (LAMBDA_ENDPOINT === 'YOUR_AWS_LAMBDA_ENDPOINT_URL') {
                // Simulate refinement for demo purposes
                await new Promise(resolve => setTimeout(resolve, 1500));
                const refinedText = simulateTextRefinement(text);
                llmResult.innerHTML = `<div class="result-text">${escapeHtml(refinedText)}</div>`;
                updateStatus(llmStatus, 'success', 'Complete (Demo Mode)');
                return;
            }

            // Call AWS Lambda function
            const response = await fetch(LAMBDA_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: text,
                    model: 'llama-3.1-8b-instruct',
                    task: 'refine'
                })
            });

            if (!response.ok) {
                throw new Error(`Lambda error: ${response.statusText}`);
            }

            const data = await response.json();
            // Response may be unwrapped { refined_text, ... } or wrapped in body string
            let refinedText = data.refined_text || data.text;
            if (!refinedText && typeof data.body === 'string') {
                try {
                    const parsed = JSON.parse(data.body);
                    refinedText = parsed.refined_text || parsed.text;
                } catch (_) {}
            }
            refinedText = refinedText || text;

            llmResult.innerHTML = `<div class="result-text">${escapeHtml(refinedText)}</div>`;
            updateStatus(llmStatus, 'success', 'Complete');

        } catch (error) {
            console.error('Llama refinement error:', error);
            // Fallback to simulated refinement
            const refinedText = simulateTextRefinement(text);
            llmResult.innerHTML = `<div class="result-text">${escapeHtml(refinedText)}</div>`;
            updateStatus(llmStatus, 'success', 'Complete (Demo Mode)');
        }
    }

    // Simulate text refinement (for demo when Lambda is not configured)
    function simulateTextRefinement(text) {
        // Simple refinement simulation - in production, this would be done by Llama 3.0
        let refined = text
            .split(/\s+/)
            .map(word => {
                // Capitalize first letter of sentences
                if (word.length > 0) {
                    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                }
                return word;
            })
            .join(' ');

        // Add period if missing
        if (refined && !refined.match(/[.!?]$/)) {
            refined += '.';
        }

        return `[Refined by Llama 3.1]\n\n${refined}`;
    }

    // Update status indicator
    function updateStatus(element, status, text) {
        element.className = `result-status status-${status}`;
        const icon = status === 'processing' ? 'fa-spinner fa-spin' :
                     status === 'success' ? 'fa-check-circle' :
                     status === 'error' ? 'fa-exclamation-circle' : 'fa-clock';
        element.innerHTML = `<i class="fas ${icon}"></i> ${text}`;
    }

    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}


