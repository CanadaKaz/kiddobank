// Get kid name from URL parameter
const urlParams = new URLSearchParams(window.location.search);
const kidName = urlParams.get('name');

// Update page title and heading
document.getElementById('kid-name').textContent = kidName;

// Load and display kid's history
async function loadKidHistory() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        const kid = data.kids.find(k => k.name === kidName);
        
        if (kid) {
            displayHistory(kid.history);
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

// Format date as MM/DD/YYYY
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US');
}

// Load history when page loads
document.addEventListener('DOMContentLoaded', loadKidHistory); 