import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBBV5c68h4vdyK9F4DQUlOPgozOeogY4QU",
    authDomain: "oxleyminecraftclub.firebaseapp.com",
    databaseURL: "https://oxleyminecraftclub-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "oxleyminecraftclub",
    storageBucket: "oxleyminecraftclub.firebasestorage.app",
    messagingSenderId: "123681657887",
    appId: "1:123681657887:web:a776a7a0232b44a9b0712a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Check user status and redirect accordingly
async function checkUserStatus(userId) {
    try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0].data();
            if (userDoc.status === 'accepted') {
                // Only redirect to dashboard if we're on the login/register page
                if (window.location.pathname === '/' || window.location.pathname === '/index.html' || window.location.pathname === '/register.html') {
                    window.location.href = '/auth/dashboard.html';
                }
            } else {
                // Only redirect to login if we're on the dashboard
                if (window.location.pathname.includes('dashboard')) {
                    window.location.href = '/index.html';
                }
            }
        } else {
            // Only redirect to login if we're on the dashboard
            if (window.location.pathname.includes('dashboard')) {
                window.location.href = '/index.html';
            }
        }
    } catch (error) {
        console.error("Error checking user status:", error);
        // Only redirect to login if we're on the dashboard
        if (window.location.pathname.includes('dashboard')) {
            window.location.href = '/index.html';
        }
    }
}

// Check auth state on all pages
onAuthStateChanged(auth, (user) => {
    if (user) {
        checkUserStatus(user.uid);
    } else if (window.location.pathname.includes('dashboard')) {
        // If not logged in and on dashboard, redirect to login
        window.location.href = '/index.html';
    }
});

// Create error message element
const createErrorMessage = () => {
    let errorDiv = document.getElementById('errorMessage');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'errorMessage';
        errorDiv.className = 'error-message';
        document.querySelector('.login-box form').insertAdjacentElement('afterend', errorDiv);
    }
    return errorDiv;
};

// Show error message
const showError = (message) => {
    const errorDiv = createErrorMessage();
    errorDiv.textContent = message;
    errorDiv.style.opacity = '1';
};

// Clear error message
const clearError = () => {
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) {
        errorDiv.style.opacity = '0';
    }
};

// Login form handler
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitButton = document.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        clearError();
        
        // Disable button and show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = `
            <span class="loading-spinner"></span>
            <span class="button-text">Signing In...</span>
        `;
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            // First try to sign in
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Update button text
            submitButton.innerHTML = `
                <span class="loading-spinner"></span>
                <span class="button-text">Checking Status...</span>
            `;

            // Check for user document in Firestore
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("userId", "==", user.uid));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                throw new Error('no-user-found');
            }

            const userDoc = querySnapshot.docs[0].data();
            
            if (userDoc.status === 'accepted') {
                // Show success state
                submitButton.innerHTML = `
                    <span class="success-icon">✓</span>
                    <span class="button-text">Success!</span>
                `;
                submitButton.classList.add('success');
                
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = '/auth/dashboard.html';
                }, 1000);
            } else {
                throw new Error('not-approved');
            }

        } catch (error) {
            let message = 'An error occurred during login.';
            
            switch (error.code || error.message) {
                case 'auth/invalid-email':
                    message = 'Invalid email address.';
                    break;
                case 'auth/user-disabled':
                    message = 'This account has been disabled.';
                    break;
                case 'auth/user-not-found':
                    message = 'No account found. Please register first.';
                    break;
                case 'auth/wrong-password':
                    message = 'Incorrect password.';
                    break;
                case 'no-user-found':
                    message = 'No user account found. Please register first.';
                    break;
                case 'not-approved':
                    message = 'Your membership request is still pending approval.';
                    break;
                default:
                    console.error('Login error:', error);
            }

            // Reset button and show error
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
            submitButton.classList.remove('success');
            showError(message);
        }
    });
}

