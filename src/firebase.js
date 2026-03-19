import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCC8jn6HMaNcQnoD9rl92EIDKx2j-9p_y4",
    authDomain: "house-worker-tasks.firebaseapp.com",
    projectId: "house-worker-tasks",
    storageBucket: "house-worker-tasks.firebasestorage.app",
    messagingSenderId: "1053731979365",
    appId: "1:1053731979365:web:0d9912c4ee62076dd7468c"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);