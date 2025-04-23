# NUTRIFIT AI

A modern, responsive website for personalized fitness and nutrition planning. The application uses AI to create customized workout and meal plans based on user preferences and goals.

## Features

- Interactive questionnaire to gather user information
- Personalized workout plans based on user inputs
- Customized nutrition plans
- Responsive design for all devices
- Smooth animations and transitions
- MySQL database for storing user data
- Modern UI with fitness-themed color scheme

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server (v8.0 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/nutrifit-ai.git
cd nutrifit-ai
```

2. Install dependencies:
```bash
npm install
```

3. Set up MySQL:
   - Install MySQL Server if not already installed
   - Create a new database named 'nutrifit'
   - Update the MySQL connection details in server.js:
     ```javascript
     const db = mysql.createConnection({
         host: 'localhost',
         user: 'your_username',
         password: 'your_password',
         database: 'nutrifit'
     });
     ```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to:
```
http://localhost:3000
```

## Project Structure

```
nutrifit-ai/
├── public/
│   ├── images/
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── server.js
├── package.json
└── README.md
```

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Node.js
- Express.js
- MySQL
- MySQL2 (Node.js MySQL driver)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any queries, please contact:
- Phone: 7207178718, 9848054099
- Email: info@nutrifitai.com 