// Global variables
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const totalSlides = 15;
const API_URL = 'http://localhost:5000/api';

// User data object to store responses
const userData = {
    gender: '',
    otherGender: '',
    age: '',
    weight: '',
    height: '',
    bodyType: '',
    fitnessGoal: '',
    workoutDays: '',
    workoutPace: '',
    fitnessLevel: '',
    pushUps: '',
    pullUps: '',
    squats: '',
    medicalConditions: '',
    dietaryHabits: ''
};

// Initialize the questionnaire
function initQuestionnaire() {
    // Show first slide
    showSlide(0);
    
    // Add event listeners
    startBtn.addEventListener('click', () => {
        showSlide(1);
    });
    
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    restartBtn.addEventListener('click', restartQuestionnaire);
    
    // Add input event listeners
    document.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('change', (e) => {
            const name = e.target.name;
            const value = e.target.value;
            userData[name] = value;
        });
    });

    // Add event listener for other gender input
    document.getElementById('otherGender').addEventListener('input', (e) => {
        userData.otherGender = e.target.value;
    });
}

// Show specific slide
function showSlide(n) {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[n].classList.add('active');
    currentSlide = n;
    
    // Update button visibility
    prevBtn.style.display = n === 0 ? 'none' : 'block';
    nextBtn.style.display = n === slides.length - 1 ? 'none' : 'block';
}

// Handle gender selection
function selectGender(gender) {
    userData.gender = gender;
    
    // Update button styles
    document.querySelectorAll('.gender-btn').forEach(btn => {
        btn.style.backgroundColor = 'white';
        btn.style.color = 'var(--primary-color)';
    });
    event.currentTarget.style.backgroundColor = 'var(--primary-color)';
    event.currentTarget.style.color = 'white';
    
    // Show/hide other gender input
    const otherGenderInput = document.getElementById('otherGenderInput');
    if (gender === 'other') {
        otherGenderInput.classList.remove('hidden');
    } else {
        otherGenderInput.classList.add('hidden');
        userData.otherGender = ''; // Clear other gender if not selected
    }
    
    // Enable next button
    document.getElementById('genderNextBtn').disabled = false;
}

// Next slide with validation
function nextSlide() {
    if (currentSlide === 1) { // Gender slide
        if (!userData.gender) {
            alert('Please select your gender');
            return;
        }
        if (userData.gender === 'other' && !userData.otherGender) {
            alert('Please specify your gender');
            return;
        }
    }
    
    if (currentSlide < slides.length - 1) {
        showSlide(currentSlide + 1);
    }
}

// Previous slide
function prevSlide() {
    if (currentSlide > 0) {
        showSlide(currentSlide - 1);
    }
}

// Restart questionnaire
function restartQuestionnaire() {
    // Reset user data
    Object.keys(userData).forEach(key => {
        userData[key] = '';
    });
    
    // Reset form inputs
    document.querySelectorAll('input, select, textarea').forEach(input => {
        input.value = '';
    });
    
    // Reset button styles
    document.querySelectorAll('.gender-btn').forEach(btn => {
        btn.style.backgroundColor = 'white';
        btn.style.color = 'var(--primary-color)';
    });
    
    // Hide other gender input
    document.getElementById('otherGenderInput').classList.add('hidden');
    
    // Show first slide
    showSlide(0);
}

// Generate fitness plan
async function generateFitnessPlan() {
    try {
        // Show loading slide
        showSlide(slides.length - 2);
        
        // Calculate BMI
        const heightInMeters = userData.height / 100;
        const bmi = userData.weight / (heightInMeters * heightInMeters);
        
        // Calculate fitness level score
        const fitnessScore = calculateFitnessScore();
        
        // Prepare data for API
        const planData = {
            userId: 'temp-user-id', // Replace with actual user ID after authentication
            fitnessGoal: userData.fitnessGoal,
            bodyType: userData.bodyType,
            medicalConditions: userData.medicalConditions,
            bmi: bmi,
            fitnessScore: fitnessScore
        };
        
        // Call API to generate plan
        const response = await fetch('http://localhost:5000/api/fitness-plans/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(planData)
        });
        
        if (!response.ok) {
            throw new Error('Failed to generate fitness plan');
        }
        
        const plan = await response.json();
        
        // Display the generated plan
        displayFitnessPlan(plan);
        
        // Show results slide
        showSlide(slides.length - 1);
    } catch (error) {
        console.error('Error generating fitness plan:', error);
        alert('Failed to generate fitness plan. Please try again.');
    }
}

// Calculate fitness score based on user inputs
function calculateFitnessScore() {
    let score = 0;
    
    // Add points based on fitness level
    switch (userData.fitnessLevel) {
        case 'beginner':
            score += 1;
            break;
        case 'intermediate':
            score += 2;
            break;
        case 'advanced':
            score += 3;
            break;
    }
    
    // Add points based on exercise performance
    score += parseInt(userData.pushUps) / 10;
    score += parseInt(userData.pullUps) / 5;
    score += parseInt(userData.squats) / 20;
    
    return Math.min(10, Math.max(1, Math.round(score)));
}

// Display the generated fitness plan
function displayFitnessPlan(plan) {
    const workoutPlanElement = document.getElementById('workoutPlan');
    const nutritionPlanElement = document.getElementById('nutritionPlan');
    
    // Display workout plan
    workoutPlanElement.innerHTML = `
        <h3>Workout Plan</h3>
        <p>Days per week: ${plan.workoutPlan.daysPerWeek}</p>
        <div class="workout-sessions">
            ${plan.workoutPlan.sessions.map(session => `
                <div class="session">
                    <h4>${session.day}</h4>
                    <p>Type: ${session.type}</p>
                    <p>Duration: ${session.duration} minutes</p>
                    <p>Intensity: ${session.intensity}</p>
                </div>
            `).join('')}
        </div>
    `;
    
    // Display nutrition plan
    nutritionPlanElement.innerHTML = `
        <h3>Nutrition Plan</h3>
        <p>Meals per day: ${plan.nutritionPlan.mealsPerDay}</p>
        <p>Daily calories: ${plan.nutritionPlan.dailyCalories}</p>
        <div class="macros">
            <h4>Macronutrient Distribution</h4>
            <p>Protein: ${plan.nutritionPlan.macronutrientDistribution.protein}g</p>
            <p>Carbs: ${plan.nutritionPlan.macronutrientDistribution.carbs}g</p>
            <p>Fats: ${plan.nutritionPlan.macronutrientDistribution.fats}g</p>
        </div>
        <div class="meal-plan">
            <h4>Sample Meal Plan</h4>
            ${plan.nutritionPlan.mealPlan.map(meal => `
                <div class="meal">
                    <h5>${meal.meal}</h5>
                    <p>${meal.description}</p>
                </div>
            `).join('')}
        </div>
    `;
}

// Initialize the questionnaire when the DOM is loaded
document.addEventListener('DOMContentLoaded', initQuestionnaire);

// Add event listeners for input fields to prevent cursor removal
document.querySelectorAll('.input-field').forEach(input => {
    input.addEventListener('input', (e) => {
        e.target.focus();
    });
});

// Add navigation to all pages
const nav = document.createElement('nav');
nav.className = 'nav';
nav.innerHTML = `
    <div class="nav-links">
        <a href="home.html">Home</a>
        <a href="about.html">About</a>
        <a href="testimonials.html">Testimonials</a>
        <a href="contact.html">Contact</a>
    </div>
`;
document.body.insertBefore(nav, document.body.firstChild); 