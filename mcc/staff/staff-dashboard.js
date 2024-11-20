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
const staffDashboardScreen = document.getElementById('staffDashboardScreen');

// Track initialization
let dashboardInitialized = false;

// Real-time listeners
let unsubscribeUsers = null;
let unsubscribeAnnouncements = null;
let unsubscribeSessions = null;
let unsubscribeActivity = null;

// Initialize Staff Dashboard
async function initializeStaffDashboard() {
    try {
        const user = auth.currentUser;
        const userDoc = await db.collection('users').doc(user.uid).get();
        const userData = userDoc.data();

        // Update welcome message
        document.getElementById('welcomeMessage').textContent = 
            `Welcome, ${userData.firstName}`;

        // Create quick action buttons
        createQuickActions();

        // Set up real-time listeners
        setupPendingUsersListener();
        setupAnnouncementsListener();
        setupSessionsListener();
        setupRecentActivityListener();

        // Show dashboard
        loader.style.display = 'none';
        staffDashboardScreen.style.display = 'flex';

    } catch (error) {
        console.error('Error initializing staff dashboard:', error);
        alert('Error loading dashboard. Please try again.');
        window.location.href = '../auth/dashboard.html';
    }
}

// Quick Actions
function createQuickActions() {
    const container = document.getElementById('quickActions');
    container.innerHTML = `
        <button onclick="openUserManagementModal()" class="quick-action-btn">
            <span class="material-icons">group</span>
            <span>Manage Users</span>
        </button>
        <button onclick="openSessionManagementModal()" class="quick-action-btn">
            <span class="material-icons">event_note</span>
            <span>Manage Sessions</span>
        </button>
        <button onclick="openAnnouncementModal()" class="quick-action-btn">
            <span class="material-icons">campaign</span>
            <span>Post Announcement</span>
        </button>
        <button onclick="switchToUserDashboard()" class="quick-action-btn">
            <span class="material-icons">dashboard</span>
            <span>User Dashboard</span>
        </button>
    `;
}

// Auth State Observer with Staff Check
auth.onAuthStateChanged(async (user) => {
    if (!user) {
        window.location.href = '../index.html';
        return;
    }

    try {
        // Verify staff status
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (!userDoc.exists || !userDoc.data().staff) {
            window.location.href = '../auth/dashboard.html';
            return;
        }

        if (!dashboardInitialized) {
            await initializeStaffDashboard();
            dashboardInitialized = true;
        }
    } catch (error) {
        console.error('Error checking staff status:', error);
        window.location.href = '../auth/dashboard.html';
    }
});

// Setup Pending Users Listener
function setupPendingUsersListener() {
    const container = document.getElementById('pendingApprovalsContainer');
    
    unsubscribeUsers = db.collection('users')
        .where('accepted', '==', false)
        .onSnapshot((snapshot) => {
            if (snapshot.empty) {
                container.innerHTML = `
                    <div class="info-card">
                        <p style="text-align: center; color: var(--text-secondary);">
                            No pending approvals
                        </p>
                    </div>
                `;
                return;
            }

            container.innerHTML = '';
            snapshot.forEach(doc => {
                const data = doc.data();
                const card = document.createElement('div');
                card.className = 'user-card';
                card.innerHTML = `
                    <div class="user-info">
                        <div class="user-details">
                            <h3>${data.firstName} ${data.lastName}</h3>
                            <p><span class="material-icons">email</span>${data.email}</p>
                            <p><span class="material-icons">school</span>${data.studentId || 'No Student ID'}</p>
                            <p><span class="material-icons">schedule</span>Pending since: ${formatDate(data.createdAt?.toDate())}</p>
                        </div>
                        <div class="user-actions">
                            <button onclick="approveUser('${doc.id}')" class="action-btn approve-btn">
                                <span class="material-icons">check</span>
                                Approve
                            </button>
                            <button onclick="rejectUser('${doc.id}')" class="action-btn reject-btn">
                                <span class="material-icons">close</span>
                                Reject
                            </button>
                        </div>
                    </div>
                `;
                container.appendChild(card);
            });
        }, (error) => {
            console.error('Error in pending users listener:', error);
            container.innerHTML = `
                <div class="info-card">
                    <p style="text-align: center; color: var(--error);">
                        ${error.message.includes('requires an index') ? 
                            'Database index needs to be created. Please contact the administrator.' : 
                            'Error loading pending approvals. Please refresh the page.'}
                    </p>
                </div>
            `;
        });
}
// Setup Recent Activity Listener
function setupRecentActivityListener() {
    const activityQuery = db.collection('users')
        .orderBy('lastUpdated', 'desc')
        .limit(10);

    unsubscribeActivity = activityQuery.onSnapshot(() => {
        updateRecentActivity();
    }, (error) => {
        console.error('Error in activity listener:', error);
    });
}

// Update Recent Activity
async function updateRecentActivity() {
    const container = document.getElementById('recentActivityContainer');
    
    try {
        const [userChanges, announcements, sessions] = await Promise.all([
            db.collection('users')
                .orderBy('lastUpdated', 'desc')
                .limit(5)
                .get(),
            db.collection('announcements')
                .orderBy('timestamp', 'desc')
                .limit(5)
                .get(),
            db.collection('sessions')
                .orderBy('lastUpdated', 'desc')
                .limit(5)
                .get()
        ]);

        const activities = [];

        userChanges.forEach(doc => {
            const data = doc.data();
            if (data.lastUpdated) {
                activities.push({
                    type: 'user',
                    data: data,
                    timestamp: data.lastUpdated,
                    id: doc.id
                });
            }
        });

        announcements.forEach(doc => {
            const data = doc.data();
            activities.push({
                type: 'announcement',
                data: data,
                timestamp: data.timestamp,
                id: doc.id
            });
        });

        sessions.forEach(doc => {
            const data = doc.data();
            if (data.lastUpdated) {
                activities.push({
                    type: 'session',
                    data: data,
                    timestamp: data.lastUpdated,
                    id: doc.id
                });
            }
        });

        // Sort activities by timestamp
        activities.sort((a, b) => b.timestamp - a.timestamp);

        // Update UI
        container.innerHTML = activities.length ? '' : `
            <div class="info-card">
                <p style="text-align: center; color: var(--text-secondary);">
                    No recent activity
                </p>
            </div>
        `;

        activities.slice(0, 10).forEach(activity => {
            const card = document.createElement('div');
            card.className = 'activity-card';
            card.innerHTML = createActivityHTML(activity);
            container.appendChild(card);
        });

    } catch (error) {
        console.error('Error updating recent activity:', error);
        container.innerHTML = `
            <div class="info-card">
                <p style="text-align: center; color: var(--error);">
                    Error loading recent activity. Please refresh the page.
                </p>
            </div>
        `;
    }
}

// Helper function to create activity HTML
function createActivityHTML(activity) {
    const data = activity.data;
    const timestamp = formatDate(activity.timestamp.toDate());

    switch (activity.type) {
        case 'user':
            return `
                <div class="activity-content">
                    <span class="material-icons">person</span>
                    <p>User ${data.firstName} ${data.lastName} - ${data.status}</p>
                    <span class="activity-time">${timestamp}</span>
                </div>
            `;
        case 'announcement':
            return `
                <div class="activity-content">
                    <span class="material-icons">campaign</span>
                    <p>New announcement: ${data.title}</p>
                    <span class="activity-time">${timestamp}</span>
                </div>
            `;
        case 'session':
            return `
                <div class="activity-content">
                    <span class="material-icons">event</span>
                    <p>${data.canceled ? 'Canceled' : 'Updated'} session: ${data.title}</p>
                    <span class="activity-time">${timestamp}</span>
                </div>
            `;
    }
}

// Helper function to format timestamps
function formatTimestamp(timestamp) {
    if (!timestamp) return 'Unknown time';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-AU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

// Session Management Modal Functions
function openSessionManagementModal() {
    document.getElementById('sessionManagementModal').style.display = 'flex';
    loadManageSessions();
}

function closeSessionManagementModal() {
    document.getElementById('sessionManagementModal').style.display = 'none';
}

// Load and display sessions for management
async function loadManageSessions() {
    const container = document.getElementById('session-management-container');
    
    try {
        const snapshot = await db.collection('sessions')
            .orderBy('date', 'desc')
            .get();

        if (snapshot.empty) {
            container.innerHTML = `
                <div class="info-card">
                    <p style="text-align: center; color: var(--text-secondary);">
                        No sessions found
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
                    <h3>${data.title || 'Minecraft Club Session'}</h3>
                    ${data.canceled ? '<span class="canceled-badge">Canceled</span>' : ''}
                </div>
                <div class="session-details">
                    <p><span class="material-icons">event</span>${formatDate(sessionDate)}</p>
                    <p><span class="material-icons">schedule</span>${formatTime(sessionDate)}</p>
                    ${data.description ? `
                        <p><span class="material-icons">info</span>${data.description}</p>
                    ` : ''}
                </div>
                <div class="session-actions">
                    ${!data.canceled ? `
                        <button onclick="cancelSession('${doc.id}')" class="cancel-btn">
                            <span class="material-icons">cancel</span>
                            Cancel
                        </button>
                    ` : `
                        <button onclick="unCancelSession('${doc.id}')" class="restore-btn">
                            <span class="material-icons">restore</span>
                            Restore
                        </button>
                    `}
                    <button onclick="deleteSession('${doc.id}')" class="delete-btn">
                        <span class="material-icons">delete</span>
                        Delete
                    </button>
                </div>
            `;
            container.appendChild(card);
        });

    } catch (error) {
        console.error('Error loading sessions:', error);
        container.innerHTML = `
            <div class="info-card">
                <p style="text-align: center; color: var(--error);">
                    Error loading sessions. Please try again.
                </p>
            </div>
        `;
    }
}

// Helper functions for date formatting
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

// Session Actions
async function cancelSession(sessionId) {
    if (!confirm('Are you sure you want to cancel this session?')) return;
    
    try {
        await db.collection('sessions').doc(sessionId).update({
            canceled: true,
            canceledAt: firebase.firestore.FieldValue.serverTimestamp(),
            canceledBy: auth.currentUser.uid
        });
        loadManageSessions();
    } catch (error) {
        console.error('Error canceling session:', error);
        alert('Error canceling session. Please try again.');
    }
}

async function unCancelSession(sessionId) {
    try {
        await db.collection('sessions').doc(sessionId).update({
            canceled: false,
            canceledAt: firebase.firestore.FieldValue.delete(),
            canceledBy: firebase.firestore.FieldValue.delete()
        });
        loadManageSessions();
    } catch (error) {
        console.error('Error restoring session:', error);
        alert('Error restoring session. Please try again.');
    }
}

// Helper Functions
function showDashboard() {
    loader.style.display = 'none';
    staffDashboardScreen.style.display = 'flex';
}

function formatDateNoTime(date) {
    return date.toLocaleDateString('en-AU', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatTime(date) {
    return date.toLocaleTimeString('en-AU', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Navigation Functions
function switchToUserDashboard() {
    window.location.href = '../auth/dashboard.html';
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

// Make functions available globally
window.switchToUserDashboard = switchToUserDashboard;
window.logout = logout;
window.openAnnouncementModal = openAnnouncementModal;
window.closeAnnouncementModal = closeAnnouncementModal;
window.openUserManagementModal = openUserManagementModal;
window.closeUserManagementModal = closeUserManagementModal;
window.openSessionManagementModal = openSessionManagementModal;
window.closeSessionManagementModal = closeSessionManagementModal;
window.approveUser = approveUser;
window.rejectUser = rejectUser;
window.cancelSession = cancelSession;
window.unCancelSession = unCancelSession;
window.openSuspensionModal = openSuspensionModal;
window.closeSuspensionModal = closeSuspensionModal;
window.unsuspendUser = unsuspendUser;
window.openNewSessionModal = openNewSessionModal;
window.closeNewSessionModal = closeNewSessionModal;
window.deleteSession = deleteSession;

function openAnnouncementModal() {
    document.getElementById('announcementModal').style.display = 'flex';
}

async function deleteSession(sessionId) {
    if (!confirm('Are you sure you want to delete this session? This action cannot be undone.')) return;
    
    try {
        await db.collection('sessions').doc(sessionId).delete();
        loadManageSessions();
    } catch (error) {
        console.error('Error deleting session:', error);
        alert('Error deleting session. Please try again.');
    }
}

function closeAnnouncementModal() {
    document.getElementById('announcementModal').style.display = 'none';
    document.getElementById('announcementForm').reset();
}

// Setup announcement form submission
document.getElementById('announcementForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('announcementTitle').value;
    const content = document.getElementById('announcementContent').value;
    const link = document.getElementById('announcementLink').value;

    try {
        await db.collection('announcements').add({
            title: title,
            content: content,
            link: link || null,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            createdBy: {
                uid: auth.currentUser.uid,
                name: auth.currentUser.displayName || 'Staff Member'
            }
        });

        closeAnnouncementModal();
        alert('Announcement posted successfully!');
    } catch (error) {
        console.error('Error posting announcement:', error);
        alert('Error posting announcement. Please try again.');
    }
});

// Announcements Listener
function setupAnnouncementsListener() {
    unsubscribeAnnouncements = db.collection('announcements')
        .orderBy('timestamp', 'desc')
        .limit(5)
        .onSnapshot((snapshot) => {
            updateRecentActivity(); // Update activity feed when announcements change
        }, (error) => {
            console.error('Error in announcements listener:', error);
        });
}

// User Management Modal Functions
function openUserManagementModal() {
    document.getElementById('userManagementModal').style.display = 'flex';
    loadUsers();
}

function closeUserManagementModal() {
    document.getElementById('userManagementModal').style.display = 'none';
    document.getElementById('userSearchInput').value = '';
}

// Load and display users for management
async function loadUsers() {
    const container = document.getElementById('usersList');
    const searchInput = document.getElementById('userSearchInput');
    
    try {
        const snapshot = await db.collection('users')
            .orderBy('firstName')
            .get();

        if (snapshot.empty) {
            container.innerHTML = `
                <div class="info-card">
                    <p style="text-align: center; color: var(--text-secondary);">
                        No users found
                    </p>
                </div>
            `;
            return;
        }

        container.innerHTML = '';
        snapshot.forEach(doc => {
            const data = doc.data();
            const card = document.createElement('div');
            card.className = 'user-card';
            card.innerHTML = `
                <div class="user-info">
                    <div class="user-details">
                        <h3>${data.firstName} ${data.lastName}</h3>
                        <p><span class="material-icons">email</span>${data.email}</p>
                        <p><span class="material-icons">school</span>${data.studentId || 'No Student ID'}</p>
                        ${data.suspended ? `
                            <p class="suspended-tag">
                                <span class="material-icons">block</span>
                                Suspended
                            </p>
                        ` : ''}
                    </div>
                    <div class="user-actions">
                        ${!data.suspended ? `
                            <button onclick="openSuspensionModal('${doc.id}')" class="action-btn suspend-btn">
                                <span class="material-icons">block</span>
                                Suspend
                            </button>
                        ` : `
                            <button onclick="unsuspendUser('${doc.id}')" class="action-btn restore-btn">
                                <span class="material-icons">restore</span>
                                Unsuspend
                            </button>
                        `}
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading users:', error);
        container.innerHTML = `
            <div class="info-card">
                <p style="text-align: center; color: var(--error);">
                    Error loading users. Please try again.
                </p>
            </div>
        `;
    }
}

// User Actions
async function approveUser(userId) {
    if (!confirm('Are you sure you want to approve this user?')) return;
    
    try {
        await db.collection('users').doc(userId).update({
            accepted: true,
            acceptedAt: firebase.firestore.FieldValue.serverTimestamp(),
            acceptedBy: auth.currentUser.uid
        });
    } catch (error) {
        console.error('Error approving user:', error);
        alert('Error approving user. Please try again.');
    }
}

async function rejectUser(userId) {
    if (!confirm('Are you sure you want to reject this user?')) return;
    
    try {
        await db.collection('users').doc(userId).delete();
    } catch (error) {
        console.error('Error rejecting user:', error);
        alert('Error rejecting user. Please try again.');
    }
}

// Suspension Functions
function openSuspensionModal(userId) {
    document.getElementById('suspendUserId').value = userId;
    document.getElementById('suspensionModal').style.display = 'flex';
}

function closeSuspensionModal() {
    document.getElementById('suspensionModal').style.display = 'none';
    document.getElementById('suspensionForm').reset();
}

// Setup suspension form submission
document.getElementById('suspensionForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const userId = document.getElementById('suspendUserId').value;
    const reason = document.getElementById('suspensionReason').value;
    const duration = document.getElementById('suspensionExpiry').value;

    try {
        const suspensionData = {
            suspended: true,
            suspensionReason: reason,
            suspendedAt: firebase.firestore.FieldValue.serverTimestamp(),
            suspendedBy: auth.currentUser.uid
        };

        if (duration === 'permanent') {
            suspensionData.suspensionExpiry = 'permanent';
        } else {
            const days = parseInt(duration);
            const expiry = new Date();
            expiry.setDate(expiry.getDate() + days);
            suspensionData.suspensionExpiry = firebase.firestore.Timestamp.fromDate(expiry);
        }

        await db.collection('users').doc(userId).update(suspensionData);
        closeSuspensionModal();
        loadUsers();
        alert('User suspended successfully.');
    } catch (error) {
        console.error('Error suspending user:', error);
        alert('Error suspending user. Please try again.');
    }
});

async function unsuspendUser(userId) {
    if (!confirm('Are you sure you want to remove this user\'s suspension?')) return;
    
    try {
        await db.collection('users').doc(userId).update({
            suspended: false,
            suspensionReason: firebase.firestore.FieldValue.delete(),
            suspensionExpiry: firebase.firestore.FieldValue.delete(),
            suspendedAt: firebase.firestore.FieldValue.delete(),
            suspendedBy: firebase.firestore.FieldValue.delete()
        });
        loadUsers();
        alert('User unsuspended successfully.');
    } catch (error) {
        console.error('Error unsuspending user:', error);
        alert('Error unsuspending user. Please try again.');
    }
}

// Sessions Listener
function setupSessionsListener() {
    const now = new Date();
    
    unsubscribeSessions = db.collection('sessions')
        .where('date', '>=', now)
        .orderBy('date')
        .onSnapshot((snapshot) => {
            updateRecentActivity(); // Update activity feed when sessions change
            loadManageSessions(); // Update session management if modal is open
        }, (error) => {
            console.error('Error in sessions listener:', error);
        });
}

// Clean up listeners when leaving the page
window.addEventListener('beforeunload', () => {
    if (unsubscribeUsers) unsubscribeUsers();
    if (unsubscribeAnnouncements) unsubscribeAnnouncements();
    if (unsubscribeSessions) unsubscribeSessions();
    if (unsubscribeActivity) unsubscribeActivity();
});

// New Session Modal Functions
function openNewSessionModal() {
    document.getElementById('newSessionModal').style.display = 'flex';
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('sessionDate').min = today;
}

function closeNewSessionModal() {
    document.getElementById('newSessionModal').style.display = 'none';
    document.getElementById('newSessionForm').reset();
}

// Setup new session form submission
document.getElementById('newSessionForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('sessionTitle').value;
    const date = document.getElementById('sessionDate').value;
    const time = document.getElementById('sessionTime').value;
    const description = document.getElementById('sessionDescription').value;

    // Combine date and time
    const sessionDateTime = new Date(`${date}T${time}`);

    try {
        await db.collection('sessions').add({
            title: title,
            date: firebase.firestore.Timestamp.fromDate(sessionDateTime),
            description: description || null,
            canceled: false,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            createdBy: auth.currentUser.uid
        });

        closeNewSessionModal();
        loadManageSessions();
        alert('Session created successfully!');
    } catch (error) {
        console.error('Error creating session:', error);
        alert('Error creating session. Please try again.');
    }
});

