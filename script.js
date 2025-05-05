import { loadData, onDataUpdate } from './firebase.js';

// Password for main page
const MAIN_PASSWORD = "nejatian";

// Initialize data from Firebase
async function initializeData() {
    try {
        const data = await loadData();
        if (!data) {
            // If no data exists in Firebase, load initial data from data.json
            const response = await fetch('data.json?' + new Date().getTime());
            const initialData = await response.json();
            await saveData(initialData);
            return initialData;
        }
        return data;
    } catch (error) {
        console.error('Error initializing data:', error);
        return null;
    }
}

// Check password and show main screen if correct
async function checkPassword() {
    const passwordInput = document.getElementById('password');
    if (passwordInput.value === MAIN_PASSWORD) {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('main-screen').classList.remove('hidden');
        await loadKidsData();
        
        // Set up real-time updates instead of periodic refresh
        onDataUpdate((data) => {
            if (data) {
                displayKids(data.kids);
            }
        });
    } else {
        alert('Incorrect password!');
    }
}

// Load kids data from Firebase
async function loadKidsData() {
    try {
        const data = await initializeData();
        if (data) {
            displayKids(data.kids);
        }
    } catch (error) {
        console.error('Error loading kids data:', error);
    }
}

// Display kids on the main screen
function displayKids(kids) {
    const container = document.getElementById('kids-container');
    container.innerHTML = '';

    kids.forEach(kid => {
        const kidCard = document.createElement('div');
        kidCard.className = 'kid-card';
        kidCard.innerHTML = `
            <img src="${kid.photo}" alt="${kid.name}">
            <h2>${kid.name}</h2>
            <p>Total Points: ${kid.currentPoints}</p>
            <p>Total Money: $${kid.currentMoney.toFixed(2)}</p>
            <a href="kid.html?name=${encodeURIComponent(kid.name)}">View Details</a>
        `;
        container.appendChild(kidCard);
    });
}

// Add event listener for Enter key in password field
document.getElementById('password').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkPassword();
    }
});

// Initialize data when page loads
document.addEventListener('DOMContentLoaded', initializeData); 