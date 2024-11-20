// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBBV5c68h4vdyK9F4DQUlOPgozOeogY4QU",
    authDomain: "oxleyminecraftclub.firebaseapp.com",
    databaseURL: "https://oxleyminecraftclub-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "oxleyminecraftclub",
    storageBucket: "oxleyminecraftclub.applestorage.app",
    messagingSenderId: "123681657887",
    appId: "1:123681657887:web:a776a7a0232b44a9b0712a"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// DOM Elements
const loader = document.getElementById('loader');
const dashboardScreen = document.getElementById('dashboardScreen');

// Global Variables
let dashboardInitialized = false;
let userUnsubscribe = null;
let announcementsUnsubscribe = null;
let sessionsUnsubscribe = null;

// Initialize Dashboard
async function initializeDashboard() {
    try {
        const user = auth.currentUser;
        if (!user) {
            console.error('No user found');
            window.location.href = '../index.html';
            return;
        }

        // Set up real-time listeners
        setupUserListener(user.uid);
        setupAnnouncementsListener();
        setupSessionsListener();

        showDashboard();
    } catch (error) {
        console.error('Error initializing dashboard:', error);
        alert('Error loading dashboard. Please try again.');
        window.location.href = '../index.html';
    }
}

// Load Announcements
async function loadAnnouncements() {
    const container = document.getElementById('announcementsContainer');
    
    try {
        const snapshot = await db.collection('announcements')
            .orderBy('timestamp', 'desc')
            .limit(5)
            .get();

        if (snapshot.empty) {
            container.innerHTML = `
                <div class="info-card">
                    <p style="text-align: center; color: var(--text-secondary);">
                        No announcements at this time
                    </p>
                </div>
            `;
            return;
        }

        container.innerHTML = '';
        snapshot.forEach(doc => {
            const data = doc.data();
            const card = document.createElement('div');
            card.className = 'announcement-card';
            card.innerHTML = `
                <h3>${data.title}</h3>
                <p>${data.content}</p>
                ${data.link ? `
                    <a href="${data.link}" target="_blank" class="announcement-link">
                        <span class="material-icons">open_in_new</span>
                        Learn More
                    </a>` : ''}
                <div class="announcement-meta">
                    <span class="post-date">${formatDate(data.timestamp.toDate())}</span>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading announcements:', error);
        container.innerHTML = `
            <div class="info-card">
                <p style="text-align: center; color: var(--error);">
                    Error loading announcements. Please refresh the page.
                </p>
            </div>
        `;
    }
}

// Load Sessions
async function loadSessions() {
    const container = document.getElementById('sessionsContainer');
    
    try {
        const now = new Date();
        const snapshot = await db.collection('sessions')
            .where('date', '>=', now)
            .orderBy('date')
            .limit(3)
            .get();

        if (snapshot.empty) {
            container.innerHTML = `
                <div class="info-card">
                    <p style="text-align: center; color: var(--text-secondary);">
                        No upcoming sessions scheduled
                    </p>
                </div>
            `;
            return;
        }

        container.innerHTML = '';
        snapshot.forEach(doc => {
            const data = doc.data();
            const sessionDate = data.date.toDate();
            const card = document.createElement('div');
            card.className = 'session-card';
            card.innerHTML = `
                <div class="session-info">
                    <h3>${data.title || 'Minecraft Club Session'}</h3>
                    <div class="session-details">
                        <span class="material-icons">event</span>
                        <span>${formatDateNoTime(sessionDate)}</span>
                    </div>
                    <div class="session-details">
                        <span class="material-icons">schedule</span>
                        <span>${formatTime(sessionDate)}</span>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading sessions:', error);
        container.innerHTML = `
            <div class="info-card">
                <p style="text-align: center; color: var(--error);">
                    Error loading sessions. Please refresh the page.
                </p>
            </div>
        `;
    }
}

// Helper Functions
function showDashboard() {
    loader.style.display = 'none';
    dashboardScreen.style.display = 'flex';
}

function formatDate(date) {
    return date.toLocaleDateString('en-AU', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

function formatTime(date) {
    return date.toLocaleTimeString('en-AU', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

// Navigation Functions
function switchToStaffDashboard() {
    window.location.href = '../staff/dashboard.html';
}

async function logout() {
    try {
        await auth.signOut();
        window.location.href = '../index.html';
    } catch (error) {
        console.error('Logout error:', error);
        alert(error.message);
    }
}

// Auth state observer
auth.onAuthStateChanged(async (user) => {
    if (user) {
        if (!dashboardInitialized) {
            await initializeDashboard();
            dashboardInitialized = true;
        }
    } else {
        // Clean up listeners
        if (userUnsubscribe) userUnsubscribe();
        if (announcementsUnsubscribe) announcementsUnsubscribe();
        if (sessionsUnsubscribe) sessionsUnsubscribe();
        window.location.href = '../index.html';
    }
});

// Make functions available globally
window.switchToStaffDashboard = switchToStaffDashboard;
window.logout = logout;

// Update or add this helper function
function formatDateNoTime(date) {
    return date.toLocaleDateString('en-AU', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Add these new listener functions
function setupUserListener(userId) {
    userUnsubscribe = db.collection('users').doc(userId)
        .onSnapshot((doc) => {
            if (!doc.exists) {
                console.error('User document not found');
                logout();
                return;
            }

            const userData = doc.data();
            
            // Check if user is accepted
            if (!userData.accepted) {
                console.log('User not accepted, redirecting to login');
                window.location.href = '../index.html';
                return;
            }

            // Update welcome message
            document.getElementById('welcomeMessage').textContent = 
                `Welcome, ${userData.firstName}`;

            // Check suspension status
            if (userData.suspended) {
                // Show suspension alert
                const suspensionAlert = document.getElementById('suspensionAlert');
                const suspensionReason = document.getElementById('suspensionReason');
                const suspensionExpiry = document.getElementById('suspensionExpiry');

                suspensionReason.textContent = `Reason: ${userData.suspensionReason || 'No reason provided'}`;
                
                if (userData.suspensionExpiry === 'permanent') {
                    suspensionExpiry.textContent = 'Duration: Permanent';
                } else if (userData.suspensionExpiry) {
                    const expiryDate = userData.suspensionExpiry.toDate();
                    suspensionExpiry.textContent = `Expires: ${formatDate(expiryDate)}`;
                }

                suspensionAlert.style.display = 'block';

                // Hide dashboard sections
                document.getElementById('clubInformation').style.display = 'none';
                document.getElementById('announcements').style.display = 'none';
                document.getElementById('sessions').style.display = 'none';
            } else {
                // Hide suspension alert and show sections
                document.getElementById('suspensionAlert').style.display = 'none';
                document.getElementById('clubInformation').style.display = 'block';
                document.getElementById('announcements').style.display = 'block';
                document.getElementById('sessions').style.display = 'block';
            }

            // Show staff controls if user is staff
            const adminControls = document.getElementById('adminControls');
            if (userData.staff) {
                adminControls.style.display = 'block';
            } else {
                adminControls.style.display = 'none';
            }

        }, (error) => {
            console.error('Error in user listener:', error);
            alert('Error accessing user data. Please try again.');
            logout();
        });
}

function setupAnnouncementsListener() {
    const container = document.getElementById('announcementsContainer');
    
    announcementsUnsubscribe = db.collection('announcements')
        .orderBy('timestamp', 'desc')
        .limit(5)
        .onSnapshot((snapshot) => {
            if (snapshot.empty) {
                container.innerHTML = `
                    <div class="info-card">
                        <p style="text-align: center; color: var(--text-secondary);">
                            No announcements at this time
                        </p>
                    </div>
                `;
                return;
            }

            container.innerHTML = '';
            snapshot.forEach(doc => {
                const data = doc.data();
                const card = document.createElement('div');
                card.className = 'announcement-card';
                card.innerHTML = `
                    <h3>${data.title}</h3>
                    <p>${data.content}</p>
                    ${data.link ? `
                        <a href="${data.link}" target="_blank" class="announcement-link">
                            <span class="material-icons">open_in_new</span>
                            Learn More
                        </a>` : ''}
                    <div class="announcement-meta">
                        <span class="post-date">${formatDate(data.timestamp.toDate())}</span>
                    </div>
                `;
                container.appendChild(card);
            });
        }, (error) => {
            console.error('Error in announcements listener:', error);
            container.innerHTML = `
                <div class="info-card">
                    <p style="text-align: center; color: var(--error);">
                        Error loading announcements. Please refresh the page.
                    </p>
                </div>
            `;
        });
}

function setupSessionsListener() {
    const container = document.getElementById('sessionsContainer');
    const now = new Date();
    
    sessionsUnsubscribe = db.collection('sessions')
        .where('date', '>=', now)
        .orderBy('date')
        .limit(5)
        .onSnapshot((snapshot) => {
            if (snapshot.empty) {
                container.innerHTML = `
                    <div class="info-card">
                        <p style="text-align: center; color: var(--text-secondary);">
                            No upcoming sessions scheduled
                        </p>
                    </div>
                `;
                return;
            }

            container.innerHTML = '';
            snapshot.forEach(doc => {
                const data = doc.data();
                const sessionDate = data.date.toDate();
                const card = document.createElement('div');
                card.className = `session-card ${data.canceled ? 'canceled-session' : ''}`;
                card.innerHTML = `
                    <div class="session-header">
                        <div class="session-title">
                            <span class="material-icons">event</span>
                            <h3>${data.title || 'Minecraft Club Session'}</h3>
                        </div>
                        ${data.canceled ? '<span class="canceled-badge">Canceled</span>' : ''}
                    </div>
                    <div class="session-details">
                        <p>
                            <span class="material-icons">calendar_today</span>
                            ${formatDate(sessionDate)}
                        </p>
                        <p>
                            <span class="material-icons">schedule</span>
                            ${formatTime(sessionDate)}
                        </p>
                        ${data.location ? `
                            <p>
                                <span class="material-icons">location_on</span>
                                ${data.location}
                            </p>
                        ` : ''}
                    </div>
                    ${data.description ? `
                        <p class="session-description">
                            <span class="material-icons">info</span>
                            ${data.description}
                        </p>
                    ` : ''}
                `;
                container.appendChild(card);
            });
        }, (error) => {
            console.error('Error in sessions listener:', error);
            container.innerHTML = `
                <div class="info-card">
                    <p style="text-align: center; color: var(--error);">
                        Error loading sessions. Please try again.
                    </p>
                </div>
            `;
        });
}

// Add cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (userUnsubscribe) userUnsubscribe();
    if (announcementsUnsubscribe) announcementsUnsubscribe();
    if (sessionsUnsubscribe) sessionsUnsubscribe();
});