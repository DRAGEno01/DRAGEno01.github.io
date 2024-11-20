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
const pendingScreen = document.getElementById('pendingScreen');
const pendingForm = document.getElementById('pendingForm');
const approvalPendingScreen = document.getElementById('approvalPendingScreen');

// Global variables
let userDocUnsubscribe = null;

// Auth state observer
auth.onAuthStateChanged(async (user) => {
    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    // Set up real-time listener for user document
    setupUserDocListener(user.uid);
});

// Real-time listener for user document
function setupUserDocListener(userId) {
    if (userDocUnsubscribe) {
        userDocUnsubscribe();
    }

    userDocUnsubscribe = db.collection('users').doc(userId)
        .onSnapshot((doc) => {
            if (!doc.exists) {
                console.log('User document deleted - redirecting to index');
                auth.signOut().then(() => {
                    window.location.href = 'index.html';
                }).catch(error => {
                    console.error('Error signing out:', error);
                    window.location.href = 'index.html';
                });
                return;
            }

            const userData = doc.data();
            
            // If user is accepted, redirect to dashboard
            if (userData.accepted) {
                window.location.href = 'auth/dashboard.html';
                return;
            }

            // If user has completed profile, show approval pending screen
            if (userData.firstName) {
                showApprovalPendingScreen();
            } else {
                // If user hasn't completed profile, show pending form
                showPendingScreen();
            }
        }, (error) => {
            console.error('Error in user document listener:', error);
            alert('Error monitoring account status. Please refresh the page.');
        });

    return userDocUnsubscribe;
}

// Handle form submission
document.getElementById('pendingForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    showLoader();

    try {
        const user = auth.currentUser;
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const yearLevel = document.getElementById('yearLevel').value;

        // Update user profile in Firestore
        await db.collection('users').doc(user.uid).update({
            firstName: firstName,
            lastName: lastName,
            yearLevel: yearLevel
        });

        // The listener will automatically update the UI
    } catch (error) {
        console.error('Error updating profile:', error);
        alert(error.message);
        showPendingScreen();
    }
});

// Clean up listener when page is closed/refreshed
window.addEventListener('beforeunload', () => {
    if (userDocUnsubscribe) {
        userDocUnsubscribe();
    }
});

// UI Functions
function showLoader() {
    document.getElementById('loader').style.display = 'flex';
    document.getElementById('pendingScreen').style.display = 'none';
    document.getElementById('approvalPendingScreen').style.display = 'none';
}

function showPendingScreen() {
    document.getElementById('loader').style.display = 'none';
    document.getElementById('pendingScreen').style.display = 'flex';
    document.getElementById('approvalPendingScreen').style.display = 'none';
}

function showApprovalPendingScreen() {
    document.getElementById('loader').style.display = 'none';
    document.getElementById('pendingScreen').style.display = 'none';
    document.getElementById('approvalPendingScreen').style.display = 'flex';
}

// Make functions available globally
window.showLoader = showLoader;
window.showPendingScreen = showPendingScreen;
window.showApprovalPendingScreen = showApprovalPendingScreen;

// Logout function
async function logout() {
    try {
        if (userDocUnsubscribe) {
            userDocUnsubscribe();
        }
        await auth.signOut();
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Logout error:', error);
        alert(error.message);
    }
}

// Make logout function available globally
window.logout = logout; 