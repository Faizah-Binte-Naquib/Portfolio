// Script to analyze GitHub repositories and suggest which ones to feature
// Run with: node analyze-repos.js

const https = require('https');

const username = 'Faizah-Binte-Naquib';
const apiUrl = `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`;

console.log(`\n🔍 Analyzing repositories for ${username}...\n`);

https.get(apiUrl, {
    headers: {
        'User-Agent': 'Portfolio-Analyzer',
        'Accept': 'application/vnd.github.v3+json'
    }
}, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const repos = JSON.parse(data);
            
            if (repos.message) {
                console.error('❌ Error:', repos.message);
                return;
            }

            console.log(`Found ${repos.length} repositories\n`);
            console.log('='.repeat(80));
            
            // Analyze each repo
            const analyzedRepos = repos.map(repo => {
                const score = calculateScore(repo);
                return { ...repo, score };
            }).sort((a, b) => b.score - a.score);

            // Display top recommendations
            console.log('\n⭐ TOP RECOMMENDATIONS FOR YOUR PORTFOLIO:\n');
            
            analyzedRepos.slice(0, 8).forEach((repo, index) => {
                console.log(`${index + 1}. ${repo.name}`);
                console.log(`   📍 ${repo.html_url}`);
                console.log(`   📝 ${repo.description || 'No description'}`);
                console.log(`   💻 Language: ${repo.language || 'N/A'}`);
                console.log(`   ⭐ Stars: ${repo.stargazers_count} | 🍴 Forks: ${repo.forks_count}`);
                console.log(`   📊 Score: ${repo.score}/100`);
                console.log(`   ✅ Reasons: ${getReasons(repo)}`);
                console.log('');
            });

            console.log('='.repeat(80));
            console.log('\n💡 TIP: Choose 4-6 repositories that best showcase your skills!');
            console.log('   Focus on repos with good documentation, interesting tech, and clear purpose.\n');

        } catch (error) {
            console.error('❌ Error parsing response:', error.message);
        }
    });
}).on('error', (error) => {
    console.error('❌ Error fetching repositories:', error.message);
});

function calculateScore(repo) {
    let score = 0;
    
    // Has description (important for portfolio)
    if (repo.description && repo.description.length > 20) score += 15;
    
    // Not a fork (original work)
    if (!repo.fork) score += 20;
    else score -= 10; // Penalize forks unless they're significant
    
    // Has stars (indicates interest/quality)
    score += Math.min(repo.stargazers_count * 2, 15);
    
    // Has forks (indicates usefulness)
    score += Math.min(repo.forks_count * 1, 10);
    
    // Recent activity (updated in last 6 months)
    const updatedDate = new Date(repo.updated_at);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    if (updatedDate > sixMonthsAgo) score += 10;
    
    // Has topics (well-categorized)
    if (repo.topics && repo.topics.length > 0) score += 5;
    
    // Size indicates substantial work (not just a test)
    if (repo.size > 100) score += 5;
    
    // Has issues enabled (active project)
    if (repo.has_issues) score += 5;
    
    // Has wiki (documentation)
    if (repo.has_wiki) score += 5;
    
    // Has pages (deployed project)
    if (repo.has_pages) score += 10;
    
    // Primary language bonus (shows tech stack)
    if (repo.language) score += 5;
    
    return Math.min(score, 100);
}

function getReasons(repo) {
    const reasons = [];
    
    if (repo.description && repo.description.length > 20) {
        reasons.push('Well-described');
    }
    
    if (!repo.fork) {
        reasons.push('Original work');
    }
    
    if (repo.stargazers_count > 0) {
        reasons.push(`${repo.stargazers_count} star${repo.stargazers_count > 1 ? 's' : ''}`);
    }
    
    if (repo.updated_at) {
        const updatedDate = new Date(repo.updated_at);
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        if (updatedDate > sixMonthsAgo) {
            reasons.push('Recently updated');
        }
    }
    
    if (repo.has_pages) {
        reasons.push('Has live demo');
    }
    
    if (repo.language) {
        reasons.push(`${repo.language} project`);
    }
    
    return reasons.join(', ') || 'Basic project';
}
