const express = require('express');
const router = express.Router();
const User = require('../models/User');
const FitnessPlan = require('../models/FitnessPlan');

// Generate fitness plan
router.post('/generate', async (req, res) => {
    try {
        const { userId, fitnessGoal, bodyType, medicalConditions, ...userData } = req.body;

        // Get user data
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate workout plan based on user data
        const workoutPlan = generateWorkoutPlan(user, fitnessGoal, bodyType, medicalConditions);

        // Generate nutrition plan based on user data
        const nutritionPlan = generateNutritionPlan(user, fitnessGoal, bodyType, medicalConditions);

        // Create new fitness plan
        const fitnessPlan = new FitnessPlan({
            userId,
            workoutPlan,
            nutritionPlan,
            ...userData
        });

        // Save fitness plan
        await fitnessPlan.save();

        res.json(fitnessPlan);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user's fitness plan
router.get('/:userId', async (req, res) => {
    try {
        const fitnessPlan = await FitnessPlan.findOne({ userId: req.params.userId });
        if (!fitnessPlan) {
            return res.status(404).json({ message: 'Fitness plan not found' });
        }
        res.json(fitnessPlan);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Helper function to generate workout plan
function generateWorkoutPlan(user, fitnessGoal, bodyType, medicalConditions) {
    // Base workout plan
    let workoutPlan = {
        daysPerWeek: 4,
        sessions: []
    };

    // Adjust based on fitness goal
    switch (fitnessGoal) {
        case 'weightLoss':
            workoutPlan.daysPerWeek = 5;
            workoutPlan.sessions = [
                { day: 'Monday', type: 'Cardio', duration: '45 minutes' },
                { day: 'Tuesday', type: 'Strength', duration: '60 minutes' },
                { day: 'Wednesday', type: 'Cardio', duration: '45 minutes' },
                { day: 'Thursday', type: 'Strength', duration: '60 minutes' },
                { day: 'Friday', type: 'Cardio', duration: '45 minutes' }
            ];
            break;
        case 'muscleGain':
            workoutPlan.daysPerWeek = 5;
            workoutPlan.sessions = [
                { day: 'Monday', type: 'Upper Body', duration: '60 minutes' },
                { day: 'Tuesday', type: 'Lower Body', duration: '60 minutes' },
                { day: 'Wednesday', type: 'Rest', duration: '0 minutes' },
                { day: 'Thursday', type: 'Upper Body', duration: '60 minutes' },
                { day: 'Friday', type: 'Lower Body', duration: '60 minutes' },
                { day: 'Saturday', type: 'Full Body', duration: '75 minutes' }
            ];
            break;
        case 'maintenance':
            workoutPlan.daysPerWeek = 4;
            workoutPlan.sessions = [
                { day: 'Monday', type: 'Strength', duration: '60 minutes' },
                { day: 'Wednesday', type: 'Cardio', duration: '45 minutes' },
                { day: 'Friday', type: 'Strength', duration: '60 minutes' },
                { day: 'Saturday', type: 'Cardio', duration: '45 minutes' }
            ];
            break;
    }

    // Adjust based on body type
    if (bodyType === 'ectomorph' && fitnessGoal === 'muscleGain') {
        workoutPlan.sessions.forEach(session => {
            if (session.type !== 'Rest') {
                session.duration = '75 minutes';
            }
        });
    }

    // Adjust for medical conditions
    if (medicalConditions && medicalConditions.length > 0) {
        workoutPlan.sessions = workoutPlan.sessions.map(session => {
            if (session.type === 'Cardio') {
                session.duration = '30 minutes';
                session.intensity = 'Low';
            }
            return session;
        });
    }

    return workoutPlan;
}

// Helper function to generate nutrition plan
function generateNutritionPlan(user, fitnessGoal, bodyType, medicalConditions) {
    // Base nutrition plan
    let nutritionPlan = {
        mealsPerDay: 3,
        dailyCalories: 2000,
        macronutrients: {
            protein: '30%',
            carbs: '40%',
            fats: '30%'
        },
        mealPlan: []
    };

    // Adjust based on fitness goal
    switch (fitnessGoal) {
        case 'weightLoss':
            nutritionPlan.dailyCalories = 1800;
            nutritionPlan.macronutrients = {
                protein: '40%',
                carbs: '30%',
                fats: '30%'
            };
            break;
        case 'muscleGain':
            nutritionPlan.dailyCalories = 2500;
            nutritionPlan.macronutrients = {
                protein: '35%',
                carbs: '45%',
                fats: '20%'
            };
            break;
    }

    // Adjust based on body type
    if (bodyType === 'ectomorph' && fitnessGoal === 'muscleGain') {
        nutritionPlan.dailyCalories = 2800;
        nutritionPlan.mealsPerDay = 5;
    }

    // Generate meal plan
    nutritionPlan.mealPlan = [
        {
            meal: 'Breakfast',
            description: 'High protein breakfast with complex carbs',
            example: 'Oatmeal with protein powder and berries'
        },
        {
            meal: 'Lunch',
            description: 'Balanced meal with lean protein and vegetables',
            example: 'Grilled chicken with quinoa and steamed vegetables'
        },
        {
            meal: 'Dinner',
            description: 'Light meal with protein and healthy fats',
            example: 'Salmon with sweet potato and green salad'
        }
    ];

    // Add snacks for weight loss or muscle gain
    if (fitnessGoal === 'weightLoss' || fitnessGoal === 'muscleGain') {
        nutritionPlan.mealPlan.push({
            meal: 'Snack',
            description: 'Protein-rich snack',
            example: 'Greek yogurt with nuts or protein shake'
        });
    }

    // Adjust for medical conditions
    if (medicalConditions && medicalConditions.length > 0) {
        nutritionPlan.mealPlan = nutritionPlan.mealPlan.map(meal => {
            if (meal.meal === 'Dinner') {
                meal.description = 'Light, easily digestible meal';
                meal.example = 'Baked fish with steamed vegetables';
            }
            return meal;
        });
    }

    return nutritionPlan;
}

module.exports = router; 