// Authentication JavaScript for frontend
let isLogin = true;
let passwordVisible = false;
let confirmPasswordVisible = false;
let googleScriptLoaded = false;

// Google script load handlers
function onGoogleScriptLoad() {
    console.log('✅ Google script loaded successfully');
    googleScriptLoaded = true;
    initializeGoogleSignIn();
}

function onGoogleScriptError() {
    console.error('❌ Failed to load Google script');
    alert('Failed to load Google authentication. Please check your internet connection.');
}

// Toggle between login and signup
function toggleMode() {
    isLogin = !isLogin;
    const title = document.querySelector('.header h1');
    const subtitle = document.querySelector('.header p');
    const submitBtn = document.querySelector('.submit-btn');
    const toggleText = document.querySelector('.toggle-text');
    const confirmPasswordGroup = document.querySelector('.confirm-password');
    
    if (isLogin) {
        title.textContent = 'Welcome Back';
        subtitle.textContent = 'Sign in to your account';
        submitBtn.textContent = 'Sign In';
        toggleText.innerHTML = 'Don\'t have an account? <a href="#" onclick="toggleMode()">Sign up</a>';
        confirmPasswordGroup.style.display = 'none';
    } else {
        title.textContent = 'Create Account';
        subtitle.textContent = 'Sign up for a new account';
        submitBtn.textContent = 'Sign Up';
        toggleText.innerHTML = 'Already have an account? <a href="#" onclick="toggleMode()">Sign in</a>';
        confirmPasswordGroup.style.display = 'block';
    }
}

// Toggle password visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const showBtn = passwordInput.nextElementSibling;
    
    passwordVisible = !passwordVisible;
    passwordInput.type = passwordVisible ? 'text' : 'password';
    showBtn.textContent = passwordVisible ? 'Hide' : 'Show';
}

function toggleConfirmPassword() {
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const showBtn = confirmPasswordInput.nextElementSibling;
    
    confirmPasswordVisible = !confirmPasswordVisible;
    confirmPasswordInput.type = confirmPasswordVisible ? 'text' : 'password';
    showBtn.textContent = confirmPasswordVisible ? 'Hide' : 'Show';
}

// Show forgot password functionality
function showForgotPassword() {
    alert('Forgot password functionality would be implemented here');
}

// Handle Google Sign-In
function handleCredentialResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);
    
    // Send the token to your backend
    fetch('http://localhost:3000/auth/google', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token: response.credential
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            console.log('Google login successful:', data);
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            alert(`Welcome ${data.user.name}! Google login successful.`);
            // Redirect to home page
            setTimeout(() => {
                window.location.href = 'home/home.html';
            }, 1500);
        } else {
            throw new Error(data.message || 'Google login failed');
        }
    })
    .catch(error => {
        console.error('Google login error:', error);
        alert('Google login failed: ' + error.message);
    });
}

// Initialize Google Sign-In
function initializeGoogleSignIn() {
    console.log('Initializing Google Sign-In...');

    if (typeof google === 'undefined') {
        console.error('Google API not loaded');
        return;
    }

    try {
        google.accounts.id.initialize({
            client_id: "645663424179-7u1f48lc5tadir43bi04ev81dr4h9vog.apps.googleusercontent.com",
            callback: handleCredentialResponse
        });
        console.log('Google Sign-In initialized successfully');
    } catch (error) {
        console.error('Error initializing Google Sign-In:', error);
    }
}



// Continue with GitHub (placeholder)
function continueWithGitHub() {
    alert('GitHub authentication would be implemented here');
}



// Handle traditional form submission
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, checking for Google API...');

    // Initialize Google Sign-In when page loads
    if (typeof google !== 'undefined') {
        console.log('Google API found, initializing...');
        initializeGoogleSignIn();
    } else {
        console.log('Google API not yet loaded, waiting...');
        // Wait a bit for Google API to load
        setTimeout(() => {
            if (typeof google !== 'undefined') {
                console.log('Google API loaded after delay, initializing...');
                initializeGoogleSignIn();
            } else {
                console.error('Google API failed to load');
            }
        }, 2000);
    }
    
    // Handle form submission
    document.getElementById('authForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (!isLogin && password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        const endpoint = isLogin ? 'login' : 'signup';
        
        try {
            const response = await fetch(`http://localhost:3000/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            
            alert(data.message);
            if (isLogin && data.token) {
                console.log('Token:', data.token);
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('user', JSON.stringify({ email }));
                // Redirect to home page
                setTimeout(() => {
                    window.location.href = 'home/home.html';
                }, 1500);
            }
        } catch (err) {
            alert(err.message);
        }
    });
});

// Also try to initialize on window load as a backup
window.addEventListener('load', function() {
    console.log('Window loaded, checking Google API again...');
    if (typeof google !== 'undefined' && google.accounts) {
        console.log('Google API available on window load');
        // Only initialize if not already done
        if (!window.googleInitialized) {
            initializeGoogleSignIn();
            window.googleInitialized = true;
        }
    }
});
