// Industry data
const industries = [
    {
        id: 'education',
        name: 'Education',
        description: 'Solutions for schools, universities, and educational institutions',
        icon: '🎓',
        iconClass: 'education-icon'
        
    },
    {
        id: 'manufacturing',
        name: 'Manufacturing', 
        description: 'Industrial solutions for production and manufacturing processes',
        icon: '🏭',
        iconClass: 'manufacturing-icon'
    },
    {
        id: 'retail',
        name: 'Retail',
        description: 'Comprehensive retail management and customer engagement tools',
        icon: '🛒',
        iconClass: 'retail-icon'
    },
    {
        id: 'food-beverage',
        name: 'Food & Beverage',
        description: 'Restaurant, catering, and food service management solutions',
        icon: '🍽️',
        iconClass: 'food-beverage-icon'
    },
    {
        id: 'textile',
        name: 'Textile',
        description: 'Fashion, apparel, and textile industry management systems',
        icon: '👕',
        iconClass: 'textile-icon'
    },
    {
        id: 'healthcare',
        name: 'Healthcare',
        description: 'Medical and healthcare management solutions for providers',
        icon: '❤️',
        iconClass: 'healthcare-icon'
    }
];

// State management
let selectedIndustry = null;

// DOM elements
const industryGrid = document.getElementById('industryGrid');
const continueBtn = document.getElementById('continueBtn');
const authBtn = document.getElementById('authBtn');

// Initialize the page
function init() {
    checkAuthentication();
    renderIndustries();
    setupEventListeners();
}

// Render industry cards
function renderIndustries() {
    industryGrid.innerHTML = '';
    
    industries.forEach(industry => {
        const card = createIndustryCard(industry);
        industryGrid.appendChild(card);
    });
}

// Create individual industry card
function createIndustryCard(industry) {
    const card = document.createElement('div');
    card.className = 'industry-card';
    card.dataset.industryId = industry.id;
    
    card.innerHTML = `
        <div class="industry-content">
            <div class="industry-icon ${industry.iconClass}">
                ${industry.icon}
            </div>
            <h3 class="industry-name">${industry.name}</h3>
            <p class="industry-description">${industry.description}</p>
        </div>
    `;
    
    card.addEventListener('click', () => selectIndustry(industry.id));
    
    return card;
}

// Handle industry selection
function selectIndustry(industryId) {
    // Remove previous selection
    const previousSelected = document.querySelector('.industry-card.selected');
    if (previousSelected) {
        previousSelected.classList.remove('selected');
    }

    // Add selection to new card
    const selectedCard = document.querySelector(`[data-industry-id="${industryId}"]`);
    selectedCard.classList.add('selected');

    // Update state
    selectedIndustry = industryId;

    // Update continue button
    updateContinueButton();

    // No immediate navigation - user must click continue button
}

// Update continue button state and text
function updateContinueButton() {
    if (selectedIndustry) {
        const industry = industries.find(i => i.id === selectedIndustry);
        continueBtn.textContent = `Continue with ${industry.name}`;
        continueBtn.disabled = false;
    } else {
        continueBtn.textContent = 'Continue';
        continueBtn.disabled = true;
    }
}

// Handle continue button click
function handleContinue() {
    if (selectedIndustry) {
        const industry = industries.find(i => i.id === selectedIndustry);

        // Define industry page mappings
        const industryPages = {
            'education': '../industries/education.html',
            'manufacturing': '../industries/manufacturing.html',
            'retail': '../industries/retail.html',
            'healthcare': '../industries/healthcare.html',
            'food-beverage': '../industries/food-beverage.html',
            'textile': '../industries/textile.html'
        };

        // Navigate to the appropriate page based on selected industry
        if (industryPages[selectedIndustry]) {
            window.location.href = industryPages[selectedIndustry];
        } else {
            // Fallback for any unmapped industries
            alert(`${industry.name} page is coming soon!`);
        }
    }
}

// Authentication functions
function checkAuthentication() {
    const authToken = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');

    if (authToken && user) {
        // User is logged in
        const userData = JSON.parse(user);
        updateAuthButton(true, userData);
    } else {
        // User is not logged in
        updateAuthButton(false);
    }
}

function updateAuthButton(isLoggedIn, userData = null) {
    if (isLoggedIn && userData) {
        // Show user name or email and logout option
        const displayName = userData.name || userData.email.split('@')[0];
        authBtn.textContent = `Hi, ${displayName}`;
        authBtn.onclick = showUserMenu;
    } else {
        // Show sign in button
        authBtn.textContent = 'Sign In';
        authBtn.onclick = () => window.location.href = '../login.html';
    }
}

function showUserMenu() {
    const userData = JSON.parse(localStorage.getItem('user'));
    const displayName = userData.name || userData.email;

    if (confirm(`Logged in as: ${displayName}\n\nClick OK to logout or Cancel to stay logged in.`)) {
        logout();
    }
}

function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    updateAuthButton(false);
    alert('You have been logged out successfully.');
}

// Setup event listeners
function setupEventListeners() {
    continueBtn.addEventListener('click', handleContinue);
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && selectedIndustry) {
            handleContinue();
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);