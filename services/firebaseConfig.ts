import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBHjuBDvz4cd2Bvimgac94S-2Yityfkh-4",
    authDomain: "conference-6a0fd.firebaseapp.com",
    projectId: "conference-6a0fd",
    storageBucket: "conference-6a0fd.firebasestorage.app",
    messagingSenderId: "679580191954",
    appId: "1:679580191954:web:d25515147c71a98463f10b",
    measurementId: "G-6J0HWCP7KB"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
