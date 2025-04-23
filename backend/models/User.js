const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    bodyType: {
        type: String,
        required: true
    },
    fitnessGoal: {
        type: String,
        required: true
    },
    workoutDays: {
        type: Number,
        required: true
    },
    preferredPace: {
        type: String,
        required: true
    },
    fitnessLevel: {
        type: String,
        required: true
    },
    pushups: {
        type: Number,
        required: true
    },
    pullups: {
        type: Number,
        required: true
    },
    squats: {
        type: Number,
        required: true
    },
    medicalConditions: {
        type: String,
        default: 'none'
    },
    dietaryHabits: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema); 