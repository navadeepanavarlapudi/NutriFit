// Global variables
let currentSlide = 1;
const totalSlides = 15;
const userData = {};
const API_URL = 'http://localhost:5000/api';

// Initialize the questionnaire
document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners for input fields to prevent cursor removal
    document.querySelectorAll('.input-field').forEach(input => {
        input.addEventListener('input', (e) => {
            e.target.focus();
        });
    });
});

// Slide navigation functions
function nextSlide() {
    if (validateCurrentSlide()) {
        const currentSlideElement = document.getElementById(`slide${currentSlide}`);
        currentSlideElement.classList.remove('active');
        currentSlide++;
        
        if (currentSlide <= totalSlides) {
            const nextSlideElement = document.getElementById(`slide${currentSlide}`);
            nextSlideElement.classList.add('active');
            nextSlideElement.classList.add('fade-in');
            nextSlideElement.classList.add('slide-up');
        }
    }
}

function prevSlide() {
    if (currentSlide > 1) {
        const currentSlideElement = document.getElementById(`slide${currentSlide}`);
        currentSlideElement.classList.remove('active');
        currentSlide--;
        
        const prevSlideElement = document.getElementById(`slide${currentSlide}`);
        prevSlideElement.classList.add('active');
        prevSlideElement.classList.add('fade-in');
        prevSlideElement.classList.add('slide-up');
    }
}

// Validation function
function validateCurrentSlide() {
    switch (currentSlide) {
        case 2: // Gender
            if (!userData.gender) {
                alert('Please select your gender');
                return false;
            }
            break;
        case 3: // Age
            const age = document.getElementById('age').value;
            if (!age || age < 13 || age > 100) {
                alert('Please enter a valid age between 13 and 100');
                return false;
            }
            userData.age = age;
            break;
        case 4: // Weight
            const weight = document.getElementById('weight').value;
            if (!weight || weight < 30 || weight > 200) {
                alert('Please enter a valid weight between 30 and 200 kg');
                return false;
            }
            userData.weight = weight;
            break;
        case 5: // Height
            const height = document.getElementById('height').value;
            if (!height || height < 4 || height > 7) {
                alert('Please enter a valid height between 4 and 7 feet');
                return false;
            }
            userData.height = height;
            break;
        case 6: // Body Type
            if (!userData.bodyType) {
                alert('Please select your body type');
                return false;
            }
            break;
        case 7: // Fitness Goal
            if (!userData.fitnessGoal) {
                alert('Please select your fitness goal');
                return false;
            }
            break;
        case 8: // Workout Days
            if (!userData.workoutDays) {
                alert('Please select the number of workout days');
                return false;
            }
            break;
        case 9: // Pace
            if (!userData.pace) {
                alert('Please select your preferred pace');
                return false;
            }
            break;
        case 10: // Fitness Level
            if (!userData.fitnessLevel) {
                alert('Please select your fitness level');
                return false;
            }
            break;
        case 11: // Push-ups
            const pushups = document.getElementById('pushups').value;
            if (!pushups || pushups < 0) {
                alert('Please enter a valid number of push-ups');
                return false;
            }
            userData.pushups = pushups;
            break;
        case 12: // Pull-ups
            const pullups = document.getElementById('pullups').value;
            if (!pullups || pullups < 0) {
                alert('Please enter a valid number of pull-ups');
                return false;
            }
            userData.pullups = pullups;
            break;
        case 13: // Squats
            const squats = document.getElementById('squats').value;
            if (!squats || squats < 0) {
                alert('Please enter a valid number of squats');
                return false;
            }
            userData.squats = squats;
            break;
        case 14: // Medical Complications
            if (!userData.medical) {
                alert('Please select if you have any medical complications');
                return false;
            }
            if (userData.medical === 'yes' && !userData.medicalDescription) {
                alert('Please describe your medical condition');
                return false;
            }
            break;
        case 15: // Dietary Habits
            if (!userData.diet) {
                alert('Please select your dietary habits');
                return false;
            }
            break;
    }
    return true;
}

// Selection handlers
function selectOption(gender) {
    userData.gender = gender;
    if (gender === 'other') {
        document.getElementById('otherGenderInput').classList.remove('hidden');
    } else {
        document.getElementById('otherGenderInput').classList.add('hidden');
    }
}

function selectBodyType(bodyType) {
    userData.bodyType = bodyType;
    document.querySelectorAll('.body-type-card').forEach(card => {
        card.style.border = 'none';
    });
    event.currentTarget.style.border = '2px solid var(--primary-color)';
}

function selectGoal(goal) {
    userData.fitnessGoal = goal;
    document.querySelectorAll('.goal-card').forEach(card => {
        card.style.border = 'none';
    });
    event.currentTarget.style.border = '2px solid var(--primary-color)';
}

function selectDays(days) {
    userData.workoutDays = days;
    document.querySelectorAll('.day-btn').forEach(btn => {
        btn.style.backgroundColor = 'white';
        btn.style.color = 'var(--primary-color)';
    });
    event.currentTarget.style.backgroundColor = 'var(--primary-color)';
    event.currentTarget.style.color = 'white';
}

function selectPace(pace) {
    userData.pace = pace;
    document.querySelectorAll('.pace-btn').forEach(btn => {
        btn.style.backgroundColor = 'white';
        btn.style.color = 'var(--primary-color)';
    });
    event.currentTarget.style.backgroundColor = 'var(--primary-color)';
    event.currentTarget.style.color = 'white';
}

function selectFitnessLevel(level) {
    userData.fitnessLevel = level;
    document.querySelectorAll('.level-btn').forEach(btn => {
        btn.style.backgroundColor = 'white';
        btn.style.color = 'var(--primary-color)';
    });
    event.currentTarget.style.backgroundColor = 'var(--primary-color)';
    event.currentTarget.style.color = 'white';
}

function selectMedical(medical) {
    userData.medical = medical;
    if (medical === 'yes') {
        document.getElementById('medicalDetails').classList.remove('hidden');
    } else {
        document.getElementById('medicalDetails').classList.add('hidden');
    }
    document.querySelectorAll('.medical-btn').forEach(btn => {
        btn.style.backgroundColor = 'white';
        btn.style.color = 'var(--primary-color)';
    });
    event.currentTarget.style.backgroundColor = 'var(--primary-color)';
    event.currentTarget.style.color = 'white';
}

function selectDiet(diet) {
    userData.diet = diet;
    document.querySelectorAll('.diet-btn').forEach(btn => {
        btn.style.backgroundColor = 'white';
        btn.style.color = 'var(--primary-color)';
    });
    event.currentTarget.style.backgroundColor = 'var(--primary-color)';
    event.currentTarget.style.color = 'white';
}

// Form submission
async function submitForm() {
    if (validateCurrentSlide()) {
        // Show loading slide
        document.getElementById(`slide${currentSlide}`).classList.remove('active');
        document.getElementById('loadingSlide').classList.add('active');
        
        try {
            // Register user
            const response = await fetch(`${API_URL}/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                throw new Error('Registration failed');
            }

            const data = await response.json();
            
            // Store token in localStorage
            localStorage.setItem('token', data.token);
            
            // Generate fitness plan
            const planResponse = await fetch(`${API_URL}/fitness-plans/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': data.token
                },
                body: JSON.stringify({ userId: data.user.id })
            });

            if (!planResponse.ok) {
                throw new Error('Failed to generate fitness plan');
            }

            const planData = await planResponse.json();
            
            // Hide loading slide
            document.getElementById('loadingSlide').classList.remove('active');
            
            // Show results slide
            const resultsSlide = document.getElementById('resultsSlide');
            resultsSlide.classList.add('active');
            
            // Display workout and nutrition plans
            displayFitnessPlan(planData);
        } catch (error) {
            console.error(error);
            alert('An error occurred. Please try again.');
            document.getElementById('loadingSlide').classList.remove('active');
            document.getElementById(`slide${currentSlide}`).classList.add('active');
        }
    }
}

// Display fitness plan
function displayFitnessPlan(planData) {
    const workoutPlan = document.getElementById('workoutPlan');
    const nutritionPlan = document.getElementById('nutritionPlan');
    
    // Display workout plan
    workoutPlan.innerHTML = planData.workoutPlan.map(day => `
        <div class="day-plan">
            <h3>Day ${day.day} Workout Plan</h3>
            <div class="workout-exercises">
                ${day.exercises.map(exercise => `<p>${exercise}</p>`).join('')}
            </div>
        </div>
    `).join('');
    
    // Display nutrition plan
    nutritionPlan.innerHTML = `
        <h3>Nutrition Plan</h3>
        <div class="nutrition-meals">
            ${Object.entries(planData.nutritionPlan).map(([meal, description]) => `
                <div class="meal">
                    <h4>${meal.charAt(0).toUpperCase() + meal.slice(1)}</h4>
                    <p>${description}</p>
                </div>
            `).join('')}
        </div>
    `;
}

// Add event listener for medical description
document.getElementById('medicalDescription').addEventListener('input', (e) => {
    userData.medicalDescription = e.target.value;
});

// Add event listener for other gender input
document.getElementById('otherGender').addEventListener('input', (e) => {
    userData.otherGender = e.target.value;
}); 