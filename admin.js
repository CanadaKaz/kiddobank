// Admin password
const ADMIN_PASSWORD = "Password";

// Initialize data from data.json if not already in localStorage
async function initializeData() {
    if (!localStorage.getItem('kiddobank_data')) {
        try {
            const response = await fetch('data.json');
            const data = await response.json();
            localStorage.setItem('kiddobank_data', JSON.stringify(data));
        } catch (error) {
            console.error('Error initializing data:', error);
        }
    }
}

// Check admin password
function checkAdminPassword() {
    const passwordInput = document.getElementById('admin-password');
    if (passwordInput.value === ADMIN_PASSWORD) {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('admin-screen').classList.remove('hidden');
        loadKidsList();
    } else {
        alert('Incorrect password!');
    }
}

// Load kids list into dropdown
async function loadKidsList() {
    try {
        await initializeData(); // Make sure data is initialized
        const data = JSON.parse(localStorage.getItem('kiddobank_data'));
        const select = document.getElementById('kid-select');
        select.innerHTML = ''; // Clear existing options
        
        data.kids.forEach(kid => {
            const option = document.createElement('option');
            option.value = kid.name;
            option.textContent = kid.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading kids list:', error);
    }
}

// Add points or money to a kid
async function addPointsMoney() {
    const kidName = document.getElementById('kid-select').value;
    const points = parseInt(document.getElementById('points-input').value) || 0;
    const money = parseFloat(document.getElementById('money-input').value) || 0;

    if (points === 0 && money === 0) {
        alert('Please enter points or money to add');
        return;
    }

    try {
        const data = JSON.parse(localStorage.getItem('kiddobank_data'));
        const kid = data.kids.find(k => k.name === kidName);
        if (kid) {
            kid.currentPoints += points;
            kid.currentMoney += money;
            
            // Add to history
            const today = new Date().toISOString().split('T')[0];
            kid.history.push({
                date: today,
                points: kid.currentPoints,
                money: kid.currentMoney,
                interest: 0
            });

            // Save changes
            localStorage.setItem('kiddobank_data', JSON.stringify(data));
            alert('Points and money added successfully!');
            
            // Clear inputs
            document.getElementById('points-input').value = '';
            document.getElementById('money-input').value = '';
        }
    } catch (error) {
        console.error('Error adding points/money:', error);
        alert('Error adding points/money. Please try again.');
    }
}

// Calculate interest for all kids
async function calculateInterest() {
    try {
        const data = JSON.parse(localStorage.getItem('kiddobank_data'));
        const today = new Date().toISOString().split('T')[0];
        
        data.kids.forEach(kid => {
            const interest = kid.currentMoney * 0.02; // 2% interest
            kid.currentMoney += interest;
            
            kid.history.push({
                date: today,
                points: kid.currentPoints,
                money: kid.currentMoney,
                interest: interest
            });
        });

        localStorage.setItem('kiddobank_data', JSON.stringify(data));
        alert('Interest calculated and added successfully!');
    } catch (error) {
        console.error('Error calculating interest:', error);
        alert('Error calculating interest. Please try again.');
    }
}

// Add event listener for Enter key in password field
document.getElementById('admin-password').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkAdminPassword();
    }
});

// Initialize data when page loads
document.addEventListener('DOMContentLoaded', initializeData); 