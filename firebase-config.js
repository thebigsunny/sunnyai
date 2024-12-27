import { initializeApp } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "sunnyconversationalai.firebaseapp.com",
  projectId: "sunnyconversationalai",
  storageBucket: "sunnyconversationalai.appspot.com",
  messagingSenderId: "765597094178",
  appId: "1:765597094178:web:df1364bf4aeb021463d57b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Enable persistence but with better security
await setPersistence(auth, browserLocalPersistence);

// Add security headers
auth.settings.appVerificationDisabledForTesting = false;

export { auth }; 