from flask import Flask, request, jsonify
import requests
import os

app = Flask(__name__)

# Replace with your actual API key (same as your provided one)
API_KEY = "AIzaSyAP_wKdt48uO6iUtvf5qWn1gpDajtVAukk"
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro-001:generateContent"

@app.route('/process-workout-data', methods=['POST'])
def process_workout_data():
    try:
        data = request.get_json()

        # Build the prompt dynamically, skipping empty values
        lines = []
        if data.get('bodyType'): lines.append(f"Body Type: {data.get('bodyType')}")
        if data.get('fitnessGoal'): lines.append(f"Fitness Goal: {data.get('fitnessGoal')}")
        if data.get('workoutFrequency'): lines.append(f"Workout Frequency: {data.get('workoutFrequency')} times/week")
        if data.get('pushupCapacity'): lines.append(f"Push-up Capacity: {data.get('pushupCapacity')}")
        if data.get('pullupCapacity'): lines.append(f"Pull-up Capacity: {data.get('pullupCapacity')}")
        if data.get('squatCapacity'): lines.append(f"Squat Capacity: {data.get('squatCapacity')}")
        if data.get('hasMedicalCondition'): lines.append(f"Medical Condition: {data.get('hasMedicalCondition')}")
        if data.get('medicalDescription'): lines.append(f"Medical Description: {data.get('medicalDescription')}")
        if data.get('dietaryPreference'): lines.append(f"Dietary Preference: {data.get('dietaryPreference')}")

        prompt_string = "Create a personalized workout plan for the following individual:\n" + "\n".join(lines)

        prompt = {
            "contents": [
                {
                    "parts": [
                        {"text": prompt_string}
                    ]
                }
            ]
        }

        # Make request to Gemini API
        response = requests.post(
            f"{GEMINI_API_URL}?key={API_KEY}",
            json=prompt
        )

        print("Gemini Status:", response.status_code)
        print("Gemini Response Text:", response.text)

        if response.status_code != 200:
            return jsonify({'error': 'Failed to get response from Gemini'}), 500

        ai_response = response.json()

        generated_text = ai_response['candidates'][0]['content']['parts'][0]['text']
        return jsonify({'aiGeneratedPlan': generated_text})

    except Exception as e:
        print("❌ Python server error:", str(e))
        return jsonify({'error': 'Server error processing request'}), 500

if __name__ == '__main__':
    print("🚀 Starting Flask server on http://localhost:5000 ...")
    app.run(debug=True)
