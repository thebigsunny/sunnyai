import { Conversation } from '@11labs/client';
import { auth } from './firebase-config.js';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const connectionStatus = document.getElementById('connectionStatus');
const agentStatus = document.getElementById('agentStatus');
const pulseCircle = document.querySelector('.pulse-circle');
const userAvatar = document.getElementById('userAvatar');
const userName = document.getElementById('userName');
const signOutButton = document.getElementById('signOut');

const sounds = {
    start: new Audio('/sounds/start.mp3'),
    stop: new Audio('/sounds/stop.mp3')
};

// Configure sounds
Object.values(sounds).forEach(sound => {
    sound.volume = 0.7;
});

const AGENT_ID = import.meta.env.VITE_AGENT_ID;
const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;

let conversation;

async function playSound(soundName) {
    try {
        const sound = sounds[soundName];
        if (sound) {
            await sound.play();
        }
    } catch (error) {
        console.error('Error playing sound:', error);
    }
}

async function startConversation() {
    try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        await playSound('start');

        conversation = await Conversation.startSession({
            agentId: AGENT_ID,
            apiKey: ELEVENLABS_API_KEY,
            onConnect: () => {
                connectionStatus.textContent = 'Connected';
                startButton.disabled = true;
                stopButton.disabled = false;
            },
            onDisconnect: () => {
                connectionStatus.textContent = 'Disconnected';
                startButton.disabled = false;
                stopButton.disabled = true;
            },
            onError: (error) => {
                console.error('Error:', error);
            },
            onModeChange: (mode) => {
                agentStatus.textContent = mode.mode === 'speaking' ? 'speaking' : 'listening';
                
                pulseCircle.classList.add('active');
                if (mode.mode === 'speaking') {
                    pulseCircle.classList.add('speaking');
                } else {
                    pulseCircle.classList.remove('speaking');
                }
            },
        });
    } catch (error) {
        console.error('Failed to start conversation:', error);
    }
}

async function stopConversation() {
    if (conversation) {
        await playSound('stop');
        await conversation.endSession();
        conversation = null;
        // Reset pulse circle state
        pulseCircle.classList.remove('active', 'speaking');
    }
}

startButton.addEventListener('click', startConversation);
stopButton.addEventListener('click', stopConversation);

// Check if user is authenticated
onAuthStateChanged(auth, (user) => {
    if (user) {
        userAvatar.src = user.photoURL || '';
        userName.textContent = user.displayName || 'User';
    } else {
        window.location.href = '/landing.html';
    }
});

// Handle sign out
signOutButton.addEventListener('click', async () => {
    try {
        await signOut(auth);
        window.location.href = '/landing.html';
    } catch (error) {
        console.error('Error signing out:', error);
    }
});
