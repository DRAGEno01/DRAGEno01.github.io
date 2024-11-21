// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBBV5c68h4vdyK9F4DQUlOPgozOeogY4QU",
    authDomain: "oxleyminecraftclub.firebaseapp.com",
    databaseURL: "https://oxleyminecraftclub-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "oxleyminecraftclub",
    storageBucket: "oxleyminecraftclub.firebasestorage.app",
    messagingSenderId: "123681657887",
    appId: "1:123681657887:web:a776a7a0232b44a9b0712a"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// DOM Elements
const loader = document.getElementById('loader');
const loginScreen = document.getElementById('loginScreen');
const registrationModal = document.getElementById('registrationModal');
const mainContent = document.getElementById('mainContent');

// Auth State Observer
auth.onAuthStateChanged(async (user) => {
    if (user) {
        // Check if user exists in database
        const userDoc = await db.collection('users').doc(user.uid).get();
        
        if (!userDoc.exists && !window.location.pathname.includes('index.html')) {
            // Something went wrong - sign out
            alert('Error: User profile not found');
            await auth.signOut();
            return;
        }

        // For new signups, let the registration modal handle the flow
        if (!userDoc.exists) {
            return;
        }

        // Check user status
        const userData = userDoc.data();
        if (userData.suspended) {
            const suspendedUntil = userData.suspendedUntil?.toDate();
            if (suspendedUntil && suspendedUntil > new Date()) {
                alert(`Account suspended until ${suspendedUntil.toLocaleDateString()}\nReason: ${userData.suspensionNote}`);
                await auth.signOut();
                return;
            }
        }
        
        if (!userData.accepted) {
            // Redirect to pending page instead of showing alert
            window.location.href = 'pending.html';
            return;
        }
        
        // User is valid - show main content
        showMainContent();
    } else {
        // No user signed in - show login
        showLoginScreen();
    }
});

// Update the auth-related functions
async function signIn(event) {
    event.preventDefault();
    showLoader();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        await auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
        console.error('Sign in error:', error);
        alert(error.message);
        showLoginScreen();
    }
}

async function signUp(event) {
    event.preventDefault();
    showLoader();

    const email = document.getElementById('signupEmail').value.toLowerCase();
    const password = document.getElementById('signupPassword').value;

    // Validate email domain
    if (!email.endsWith('@student.oxley.vic.edu.au')) {
        const signupEmail = document.getElementById('signupEmail');
        signupEmail.style.borderColor = 'var(--error)';
        showSignupScreen();
        return;
    }

    try {
        // Create the user account
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        
        // Show registration modal for additional info
        document.getElementById('registrationForm').setAttribute('data-uid', userCredential.user.uid);
        showRegistrationModal();
        
    } catch (error) {
        console.error('Sign up error:', error);
        const signupEmail = document.getElementById('signupEmail');
        signupEmail.style.borderColor = 'var(--error)';
        showSignupScreen();
    }
}

// Add the registration submission handler
async function submitRegistration(event) {
    event.preventDefault();
    showLoader();

    const uid = document.getElementById('registrationForm').getAttribute('data-uid');
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const yearLevel = document.getElementById('yearLevel').value;

    try {
        // Create user document with form data
        await db.collection('users').doc(uid).set({
            firstName: firstName,
            lastName: lastName,
            email: auth.currentUser.email,
            yearLevel: parseInt(yearLevel),
            accepted: false,
            suspended: false,
            suspendedUntil: null,
            suspensionNote: '',
            dateJoined: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Redirect to pending page
        window.location.href = 'pending.html';

    } catch (error) {
        console.error('Registration error:', error);
        showRegistrationModal();
    }
}

// UI helper functions
function toggleAuthMode() {
    const loginScreen = document.getElementById('loginScreen');
    const signupScreen = document.getElementById('signupScreen');
    
    if (loginScreen.classList.contains('hidden')) {
        loginScreen.classList.remove('hidden');
        signupScreen.classList.add('hidden');
    } else {
        loginScreen.classList.add('hidden');
        signupScreen.classList.remove('hidden');
    }
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling;
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.textContent = 'visibility';
    } else {
        input.type = 'password';
        icon.textContent = 'visibility_off';
    }
}

// UI Functions
function showLoader() {
    loader.style.display = 'flex';
    loginScreen.style.display = 'none';
    registrationModal.classList.add('hidden');
    mainContent.classList.add('hidden');
}

function showLoginScreen() {
    loader.style.display = 'none';
    loginScreen.style.display = 'flex';
    registrationModal.classList.add('hidden');
    mainContent.classList.add('hidden');
}

function showRegistrationModal() {
    loader.style.display = 'none';
    loginScreen.style.display = 'none';
    registrationModal.classList.remove('hidden');
    mainContent.classList.add('hidden');
}

function showMainContent() {
    loader.style.display = 'none';
    loginScreen.style.display = 'none';
    registrationModal.classList.add('hidden');
    mainContent.classList.remove('hidden');
    window.location.href = "auth/dashboard.html"
}

function closeRegistrationModal() {
    registrationModal.classList.add('hidden');
}

// Logout function
async function logout() {
    try {
        await auth.signOut();
        showLoginScreen();
    } catch (error) {
        console.error('Logout error:', error);
        alert(error.message);
    }
}

// Add event listeners
document.getElementById('loginForm').addEventListener('submit', signIn);
document.getElementById('signupForm').addEventListener('submit', signUp);
document.getElementById('registrationForm').addEventListener('submit', submitRegistration);

// Make functions available globally
window.toggleAuthMode = toggleAuthMode;
window.togglePassword = togglePassword;
window.signIn = signIn;
window.signUp = signUp;
window.closeRegistrationModal = closeRegistrationModal;
window.submitRegistration = submitRegistration;
window.logout = logout;

// Add this new function to show signup screen
function showSignupScreen() {
    loader.style.display = 'none';
    loginScreen.classList.add('hidden');
    document.getElementById('signupScreen').classList.remove('hidden');
    registrationModal.classList.add('hidden');
    mainContent.classList.add('hidden');
}

// Handle signup form submission
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    showLoader();

    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    try {
        // Create user account
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Create initial user document in Firestore with explicit staff field
        const userData = {
            email: email,
            accepted: false,
            staff: false,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        // Use set with merge to ensure all fields are written
        await db.collection('users').doc(user.uid).set(userData, { merge: true });

        console.log('User document created with staff field:', userData); // Debug log

        // Redirect to pending page
        window.location.href = 'pending.html';
    } catch (error) {
        console.error('Signup error:', error);
        alert(error.message);
        showLoginScreen();
    }
});
