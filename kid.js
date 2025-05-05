import { loadData, onDataUpdate } from './firebase.js';

// Get kid name from URL parameter
const urlParams = new URLSearchParams(window.location.search);
const kidName = urlParams.get('name');

// Update page title and heading
document.getElementById('kid-name').textContent = kidName;

// Load and display kid's history
async function loadKidHistory() {
    try {
        const data = await loadData();
        if (data) {
            const kid = data.kids.find(k => k.name === kidName);
            if (kid) {
                displayHistory(kid.history);
            }
        }
    } catch (error) {
        console.error('Error loading kid data:', error);
    }
}

// Display history in table
function displayHistory(history) {
    const tbody = document.getElementById('history-body');
    tbody.innerHTML = '';

    // Sort history by date (newest first)
    const sortedHistory = [...history].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
    );

    sortedHistory.forEach(entry => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(entry.date)}</td>
            <td>${entry.points}</td>
            <td>$${entry.money.toFixed(2)}</td>
            <td>$${entry.interest.toFixed(2)}</td>
        `;
        tbody.appendChild(row);
    });
}

// Format date as Month Day, Year
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Set up real-time updates
onDataUpdate((data) => {
    if (data) {
        const kid = data.kids.find(k => k.name === kidName);
        if (kid) {
            displayHistory(kid.history);
        }
    }
});

// Initialize data and load history when page loads
document.addEventListener('DOMContentLoaded', loadKidHistory); 