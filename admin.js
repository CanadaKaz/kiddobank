import { loadData, saveData } from './firebase.js';

// Admin password
const ADMIN_PASSWORD = "Password";

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

// Check admin password
async function checkAdminPassword() {
    const passwordInput = document.getElementById('admin-password');
    if (passwordInput.value === ADMIN_PASSWORD) {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('admin-screen').classList.remove('hidden');
        await loadKidsList();
    } else {
        alert('Incorrect password!');
    }
}

// Load kids list into dropdown
async function loadKidsList() {
    try {
        const data = await initializeData();
        if (data) {
            const select = document.getElementById('kid-select');
            select.innerHTML = ''; // Clear existing options
            
            data.kids.forEach(kid => {
                const option = document.createElement('option');
                option.value = kid.name;
                option.textContent = kid.name;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading kids list:', error);
    }
}

// Add points or money to a kid
async function addPointsMoney() {
    console.log('addPointsMoney called');
    const kidName = document.getElementById('kid-select').value;
    const points = parseInt(document.getElementById('points-input').value) || 0;
    const money = parseFloat(document.getElementById('money-input').value) || 0;

    console.log('Input values:', { kidName, points, money });

    if (points === 0 && money === 0) {
        alert('Please enter points or money to add');
        return;
    }

    try {
        const data = await loadData();
        console.log('Current data:', data);
        
        if (data) {
            const kid = data.kids.find(k => k.name === kidName);
            console.log('Found kid:', kid);
            
            if (kid) {
                kid.currentPoints += points;
                kid.currentMoney += money;
                
                // Add to history
                const today = new Date('2025-05-05').toISOString().split('T')[0];
                kid.history.push({
                    date: today,
                    points: kid.currentPoints,
                    money: kid.currentMoney,
                    interest: 0
                });

                console.log('Updated kid data:', kid);

                // Save changes to Firebase
                const success = await saveData(data);
                console.log('Save to Firebase success:', success);
                
                if (success) {
                    alert('Points and money added successfully!');
                } else {
                    alert('Failed to save changes. Please try again.');
                }
                
                // Clear inputs
                document.getElementById('points-input').value = '';
                document.getElementById('money-input').value = '';
            }
        }
    } catch (error) {
        console.error('Error in addPointsMoney:', error);
        alert('Error adding points/money. Please try again.');
    }
}

// Calculate interest for all kids
async function calculateInterest() {
    try {
        const data = await loadData();
        if (data) {
            const today = new Date('2025-05-05').toISOString().split('T')[0];
            
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
        }
    } catch (error) {
        console.error('Error calculating interest:', error);
        alert('Error calculating interest. Please try again.');
    }
}

// Add event listeners when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Admin login button
    document.getElementById('admin-login-button').addEventListener('click', checkAdminPassword);
    
    // Add points/money button
    document.getElementById('add-points-money-button').addEventListener('click', addPointsMoney);
    
    // Calculate interest button
    document.getElementById('calculate-interest-button').addEventListener('click', calculateInterest);
    
    // Initialize data
    initializeData();
}); 