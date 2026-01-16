# Period Tracking System - Setup & Usage Guide

## Overview

This is a command-line period tracking system that uses AI to analyze menstrual cycle data and provide personalized predictions and insights.

## Installation & Setup

### Step 1: Install Node.js

Download and install Node.js from https://nodejs.org/
This gives you access to npm (Node Package Manager) and the `node` command.

### Step 2: Install Required Dependencies

Open PowerShell in your project directory and run:

```powershell
npm install axios
```

This installs the `axios` library, which is used to make HTTP requests to the OpenAI API.

### Step 3: Get Your OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign up or log in to your OpenAI account
3. Create a new API key
4. Copy the key

### Step 4: Add Your API Key to the Code

In the `index.js` file, find this line:

```javascript
const OPENAI_API_KEY = "your-api-key-here";
```

Replace `'your-api-key-here'` with your actual API key (keep it in quotes):

```javascript
const OPENAI_API_KEY = "sk-xxx...your-actual-key-here";
```

## Running the Program

In PowerShell, navigate to your project folder and run:

```powershell
node index.js
```

## How It Works - Command Execution Flow

### 1. **Program Start**

When you run `node index.js`:

- The `showMainMenu()` function is called
- This starts the main loop that displays menu options

### 2. **User Input Handling**

- The `askQuestion()` function displays a question and waits for user input
- The `readline` module (Node.js built-in) handles keyboard input
- User input is returned as a string

### 3. **Data Storage**

- All data is stored in the `PeriodTrackingData` object
- The `periods` array stores period information
- The `symptoms` array stores symptom logs
- Data persists only during the program's execution (not saved to disk)

### 4. **AI Analysis**

When you choose "Get predictions" or "Get personalized insights":

1. The system collects all relevant data
2. Creates a detailed prompt with this data
3. Sends the prompt to OpenAI's API using `axios.post()`
4. The AI analyzes the data and returns predictions
5. Results are displayed to you

## Menu Options Explained

### Option 1: Log Period Start

**What it does:**

- Records when your period started
- Asks about flow intensity (light/moderate/heavy)
- Records if you have cramps
- Calculates your average cycle length

**Behind the scenes:**

- Creates a `periodEntry` object
- Adds it to `PeriodTrackingData.periods` array
- Calculates average cycle length for future predictions

### Option 2: Log Symptoms

**What it does:**

- Records symptoms you're experiencing
- Rates your mood (1-10)
- Rates your energy level (1-10)
- Stores all in your symptom history

**Behind the scenes:**

- Creates a `symptomEntry` object
- Splits symptom input by commas
- Converts string ratings to numbers for analysis

### Option 3: Get Predictions

**What it does:**

- Uses AI to analyze your cycle data
- Predicts current cycle phase
- Suggests upcoming symptoms
- Provides self-care recommendations
- Predicts next period date

**Behind the scenes:**

1. Retrieves your latest period and symptoms
2. Calculates days since period started
3. Creates a detailed prompt including all this data
4. Sends to OpenAI API
5. AI returns personalized analysis

### Option 4: Get Personalized Insights

**What it does:**

- You describe how you're feeling
- AI analyzes your feeling in context of your cycle
- Explains why you might feel that way
- Suggests management techniques

**Behind the scenes:**

- Uses the `getAIAnalysis()` function
- Combines your feeling description with cycle data
- AI provides context-specific insights

### Option 5: View Tracked Data

**What it does:**

- Displays all periods logged
- Shows all symptoms logged
- Displays your cycle statistics

**Behind the scenes:**

- Uses `forEach()` to loop through arrays
- Formats dates for readability
- Shows all stored data in the `PeriodTrackingData` object

## Key JavaScript Concepts Used

### Arrays

```javascript
PeriodTrackingData.periods = [];
// An array stores multiple period entries
```

### Objects

```javascript
const periodEntry = {
  startDate: startDate.toISOString(),
  flowIntensity: flowIntensity,
  cramping: hasCramping,
};
// Objects group related data together
```

### Promises & Async/Await

```javascript
async function logPeriodStart(rl) {
  const startDateStr = await askQuestion("Question: ", rl);
}
// async/await allows the program to wait for user input
```

### Array Methods

```javascript
cycleLengths.reduce((sum, length) => sum + length, 0);
// reduce() combines all values into one sum

PeriodTrackingData.symptoms.forEach((symptom, index) => {
  // forEach() runs code for each item in the array
});
```

### String Methods

```javascript
symptoms.split(",").map((s) => s.trim());
// split() divides a string into an array
// map() transforms each item
// trim() removes extra spaces
```

### Date Methods

```javascript
const date = new Date(); // Creates current date
date.getDate(); // Gets day of month
date.getMonth(); // Gets month (0-11)
date.getFullYear(); // Gets year
date.toISOString(); // Converts to standard format
```

## Data Flow Example

When you choose option 1 (Log Period Start):

```
User enters option 1
    ↓
logPeriodStart() function is called
    ↓
askQuestion() displays "When did your period start?"
    ↓
User types date (e.g., "2026-01-15")
    ↓
Date is parsed and stored
    ↓
More questions asked (flow intensity, cramps)
    ↓
periodEntry object created with all data
    ↓
Object added to PeriodTrackingData.periods array
    ↓
Confirmation message displayed
    ↓
calculateAndShowAverageCycle() updates cycle average
    ↓
Menu reappears
```

## Saving Your Data

Currently, data is stored in memory and will be lost when the program closes. To save data permanently, you can:

1. **Use localStorage** (for browser version)
2. **Write to a file** (for Node.js version):

```javascript
const fs = require("fs");
fs.writeFileSync("data.json", JSON.stringify(PeriodTrackingData));
```

3. **Use a database** (for larger projects)

## Troubleshooting

### "OPENAI_API_KEY not found"

- Make sure you've added your API key to the code
- The key should be between quotes: `'sk-xxx...'`

### "Cannot find module 'axios'"

- Run: `npm install axios`
- Make sure you're in the project directory when running npm commands

### "Error contacting AI service"

- Check your internet connection
- Verify your API key is correct
- Check if OpenAI's API is working (status.openai.com)

## Future Enhancements

You could add:

1. Data persistence (save to file/database)
2. Predictive ovulation window calculation
3. Integration with health apps
4. Better UI with web framework (React/Vue)
5. Medication/supplement tracking
6. Export data as PDF/CSV
7. Share insights with healthcare providers
