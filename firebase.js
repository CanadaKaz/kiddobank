// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    databaseURL: "https://kiddobank-cd88d.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Function to save data to Firebase
export async function saveData(data) {
    try {
        await set(ref(database, 'kiddobank_data'), data);
        return true;
    } catch (error) {
        console.error('Error saving data:', error);
        return false;
    }
}

// Function to load data from Firebase
export async function loadData() {
    try {
        const snapshot = await get(ref(database, 'kiddobank_data'));
        return snapshot.val();
    } catch (error) {
        console.error('Error loading data:', error);
        return null;
    }
}

// Function to listen for real-time updates
export function onDataUpdate(callback) {
    return onValue(ref(database, 'kiddobank_data'), (snapshot) => {
        const data = snapshot.val();
        callback(data);
    });
} 