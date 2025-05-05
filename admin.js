// Admin password
const ADMIN_PASSWORD = "Password";

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
        const response = await fetch('data.json');
        const data = await response.json();
        const select = document.getElementById('kid-select');
        
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
        const response = await fetch('data.json');
        const data = await response.json();
        
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
            await saveData(data);
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
        const response = await fetch('data.json');
        const data = await response.json();
        
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

        await saveData(data);
        alert('Interest calculated and added successfully!');
    } catch (error) {
        console.error('Error calculating interest:', error);
        alert('Error calculating interest. Please try again.');
    }
}

// Save data to JSON file
async function saveData(data) {
    // Note: In a real application, this would be a server endpoint
    // For GitHub Pages, we'll use localStorage as a workaround
    localStorage.setItem('kiddobank_data', JSON.stringify(data));
}

// Add event listener for Enter key in password field
document.getElementById('admin-password').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkAdminPassword();
    }
}); 