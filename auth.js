import { auth } from './firebase-config.js';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';

const provider = new GoogleAuthProvider();
const googleSignInButton = document.getElementById('googleSignIn');

// Handle Google Sign In
googleSignInButton.addEventListener('click', async () => {
    try {
        // Add scopes if needed
        provider.addScope('profile');
        provider.addScope('email');
        
        // Set auth parameters
        provider.setCustomParameters({
            prompt: 'select_account'
        });
        
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error('Error signing in:', error);
        // You might want to show this error to the user
        alert('Failed to sign in: ' + error.message);
    }
});

// Check auth state
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, redirect to main app
        window.location.href = '/index.html';
    }
}); 