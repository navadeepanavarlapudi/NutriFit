const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const fetch = require('node-fetch');
console.log('node-fetch version:', fetch); // Check if fetch is properly imported
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/nutrifit', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
    gender: String,
    age: Number,
    weight: Number,
    height: Number,
    bodyType: String,
    fitnessGoal: String,
    workoutDays: Number,
    pace: String,
    fitnessLevel: String,
    pushups: Number,
    pullups: Number,
    squats: Number,
    medical: String,
    medicalDescription: String,
    diet: String,
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// API Routes
// app.post('/api/users', async (req, res) => {
//     try {
//         const user = new User(req.body);
//         const savedUser = await user.save();
//         res.status(201).json(savedUser);
//     } catch (err) {
//         console.error('Error creating user:', err);
//         res.status(400).json({ error: err.message });
//     }
// });

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/gender', (req, res) => {
    res.render('gender');
});

app.post('/submit-gender', (req, res) => {
    const { gender } = req.body;
    req.session.gender = gender;
    res.redirect('/measurements');
});

app.get('/measurements', (req, res) => {
    res.render('measurements');
});

app.post('/submit-measurements', (req, res) => {
    const { age, weight } = req.body;
    req.session.age = age;
    req.session.weight = weight;
    res.redirect('/body-type');
});

app.get('/body-type', (req, res) => {
    res.render('body-type');
});

app.post('/submit-body-type', (req, res) => {
    const { bodyType } = req.body;
    req.session.bodyType = bodyType;
    res.redirect('/fitness-goal');
});

app.get('/fitness-goal', (req, res) => {
    res.render('fitness-goal');
});

app.post('/submit-goal', (req, res) => {
    const { goal } = req.body;
    req.session.fitnessGoal = goal;
    res.redirect('/workout-frequency');
});

app.get('/workout-frequency', (req, res) => {
    if (!req.session.fitnessGoal) {
        res.redirect('/fitness-goal');
        return;
    }
    res.render('workout-frequency');
});

app.post('/submit-frequency', (req, res) => {
    const { frequency } = req.body;
    req.session.workoutFrequency = frequency;
    res.redirect('/pushup-test');
});

app.get('/pushup-test', (req, res) => {
    if (!req.session.workoutFrequency) {
        res.redirect('/workout-frequency');
        return;
    }
    res.render('pushup-test');
});

app.post('/submit-pushup', (req, res) => {
    const { pushups } = req.body;
    req.session.pushupCapacity = pushups;
    res.redirect('/pullup-test');
});

app.get('/pullup-test', (req, res) => {
    if (!req.session.pushupCapacity) {
        res.redirect('/pushup-test');
        return;
    }
    res.render('pullup-test');
});

app.post('/submit-pullup', (req, res) => {
    const { pullups } = req.body;
    req.session.pullupCapacity = pullups;
    res.redirect('/squat-test');
});

app.get('/squat-test', (req, res) => {
    if (!req.session.pullupCapacity) {
        res.redirect('/pullup-test');
        return;
    }
    res.render('squat-test');
});

app.post('/submit-squat', (req, res) => {
    const { squats } = req.body;
    req.session.squatCapacity = squats;
    res.redirect('/medical-assessment');
});

app.get('/medical-assessment', (req, res) => {
    if (!req.session.squatCapacity) {
        res.redirect('/squat-test');
        return;
    }
    res.render('medical-assessment');
});

app.post('/submit-medical', (req, res) => {
    const { hasMedicalCondition, medicalDescription } = req.body;
    req.session.hasMedicalCondition = hasMedicalCondition;
    req.session.medicalDescription = medicalDescription || '';
    res.redirect('/dietary-preferences');
});

app.get('/dietary-preferences', (req, res) => {
    if (!req.session.hasMedicalCondition) {
        res.redirect('/medical-assessment');
        return;
    }
    res.render('dietary-preferences');
});

app.post('/submit-dietary', (req, res) => {
    const { dietaryPreference } = req.body;
    req.session.dietaryPreference = dietaryPreference;
    res.redirect('/workout-plan');
});

// app.get('/workout-plan', (req, res) => {
//     if (!req.session.dietaryPreference) {
//         res.redirect('/dietary-preferences');
//         return;
//     }
//     res.render('workout-plan', {
//         bodyType: req.session.bodyType || '',
//         fitnessGoal: req.session.fitnessGoal || '',
//         workoutFrequency: req.session.workoutFrequency || '',
//         pushupCapacity: req.session.pushupCapacity || '',
//         pullupCapacity: req.session.pullupCapacity || '',
//         squatCapacity: req.session.squatCapacity || '',
//         hasMedicalCondition: req.session.hasMedicalCondition || '',
//         medicalDescription: req.session.medicalDescription || '',
//         dietaryPreference: req.session.dietaryPreference || ''
//     });
// });


app.get('/workout-plan', async (req, res) => {
    // Check if dietary preference exists in the session
    console.log("Session:", req.session);
    if (!req.session.dietaryPreference) {
        return res.redirect('/dietary-preferences');
    }

    // Collect user data from session
    const sessionData = {
        bodyType: req.session.bodyType || '',
        fitnessGoal: req.session.fitnessGoal || '',
        workoutFrequency: req.session.workoutFrequency || '',
        pushupCapacity: req.session.pushupCapacity || '',
        pullupCapacity: req.session.pullupCapacity || '',
        squatCapacity: req.session.squatCapacity || '',
        hasMedicalCondition: req.session.hasMedicalCondition || '',
        medicalDescription: req.session.medicalDescription || '',
        dietaryPreference: req.session.dietaryPreference || ''
    };

    try {
        // Send data to the Flask API to generate the workout plan
        const response = await fetch('http://localhost:5000/process-workout-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sessionData),
        });

        const aiResponse = await response.json();  // Parse JSON response
        console.log("Raw AI response:", aiResponse);  // Log raw response for debugging

        // Check if the AI generated a workout plan and if not, show a fallback message
        const aiGeneratedPlan = aiResponse.aiGeneratedPlan || 'No workout plan generated. Please try again later.';

        // Render the workout plan page with the response from the AI
        res.render('workout-plan', {
            ...sessionData,
            aiGeneratedPlan: aiGeneratedPlan  // Display the AI-generated workout plan
        });
    } catch (error) {
        console.error('Error calling Python API:', error);
        res.status(500).send('Something went wrong');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});