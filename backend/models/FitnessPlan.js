const mongoose = require('mongoose');

const fitnessPlanSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    workoutPlan: {
        daysPerWeek: {
            type: Number,
            required: true
        },
        sessions: [{
            day: {
                type: String,
                required: true
            },
            type: {
                type: String,
                required: true
            },
            duration: {
                type: String,
                required: true
            },
            intensity: {
                type: String,
                default: 'Medium'
            }
        }]
    },
    nutritionPlan: {
        mealsPerDay: {
            type: Number,
            required: true
        },
        dailyCalories: {
            type: Number,
            required: true
        },
        macronutrients: {
            protein: {
                type: String,
                required: true
            },
            carbs: {
                type: String,
                required: true
            },
            fats: {
                type: String,
                required: true
            }
        },
        mealPlan: [{
            meal: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            },
            example: {
                type: String,
                required: true
            }
        }]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
fitnessPlanSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('FitnessPlan', fitnessPlanSchema); 