import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

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

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitButton = document.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    
    // Disable button and show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = `
        <span class="loading-spinner"></span>
        <span class="button-text">Creating Account...</span>
    `;
    
    // Get all form values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const yearLevel = document.getElementById('yearLevel').value;
    const reason = document.getElementById('reason').value;
    const agreedToTerms = document.getElementById('terms').checked;

    try {
        // First create the user account
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update button text
        submitButton.innerHTML = `
            <span class="loading-spinner"></span>
            <span class="button-text">Submitting Request...</span>
        `;

        // Then create the request document
        const requestData = {
            userId: user.uid,
            firstName: firstName,
            lastName: lastName,
            email: email,
            yearLevel: parseInt(yearLevel),
            reason: reason,
            agreedToTerms: agreedToTerms,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Add the request to Firestore
        await addDoc(collection(db, "requests"), requestData);

        // Show success state briefly before redirect
        submitButton.innerHTML = `
            <span class="success-icon">✓</span>
            <span class="button-text">Success!</span>
        `;
        submitButton.classList.add('success');

        // Redirect to a success page or dashboard after a brief delay
        setTimeout(() => {
            window.location.href = './index.html';
        }, 1000);

    } catch (error) {
        let message = 'An error occurred during registration.';
        switch (error.code) {
            case 'auth/email-already-in-use':
                message = 'This email is already registered.';
                break;
            case 'auth/invalid-email':
                message = 'Invalid email address.';
                break;
            case 'auth/operation-not-allowed':
                message = 'Email/password accounts are not enabled.';
                break;
            case 'auth/weak-password':
                message = 'Please choose a stronger password.';
                break;
            default:
                console.error('Registration error:', error);
        }
        
        // Reset button state and show error
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
        console.error(message);
    }
});
