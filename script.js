// Password for main page
const MAIN_PASSWORD = "nejatian";

// Check password and show main screen if correct
function checkPassword() {
    const passwordInput = document.getElementById('password');
    if (passwordInput.value === MAIN_PASSWORD) {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('main-screen').classList.remove('hidden');
        loadKidsData();
    } else {
        alert('Incorrect password!');
    }
}

// Load kids data from JSON file
async function loadKidsData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        displayKids(data.kids);
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