// ============================================
// PERIOD TRACKING SYSTEM WITH AI ANALYSIS
// ============================================

// Import necessary modules for making HTTP requests to the OpenAI API
const axios = require("axios");

// Import Node.js readline module for user input from the command line
const readline = require("readline");

// ============================================
// CONFIGURATION SECTION
// ============================================

// Store your OpenAI API key here - get it from https://platform.openai.com/api-keys
// IMPORTANT: Never hardcode API keys in production! Use environment variables instead
const OPENAI_API_KEY = "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";

// The OpenAI model we'll use for AI analysis
// 'gpt-3.5-turbo' is faster and cheaper, 'gpt-4' is more advanced
const AI_MODEL = "gpt-3.5-turbo";

// ============================================
// DATA STRUCTURE - This holds all tracking data
// ============================================

// This object stores all period tracking information
// It persists during the program's execution
const PeriodTrackingData = {
  // Array to store all period entries
  // Each entry contains dates, symptoms, and flow information
  periods: [],

  // Array to store daily symptom logs
  // Helps track patterns and correlations
  symptoms: [],

  // Average cycle length calculated from data
  averageCycleLength: 28,
};

// ============================================
// UTILITY FUNCTIONS - Helper functions for common tasks
// ============================================

/**
 * Function to create a command-line interface for user input
 * This allows the system to ask questions and receive answers
 *
 * @returns {object} readline interface object
 */
function createInputInterface() {
  // readline.createInterface creates an interface for reading input
  // 'stdin' = standard input (keyboard)
  // 'stdout' = standard output (console display)
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

/**
 * Function to prompt the user with a question and wait for their response
 *
 * @param {string} question - The question to display to the user
 * @param {object} rl - The readline interface to use
 * @returns {Promise} - A promise that resolves when the user answers
 */
function askQuestion(question, rl) {
  // This returns a new Promise that handles the asynchronous question
  // The Promise resolves with the user's answer or rejects with an error
  return new Promise((resolve, reject) => {
    // rl.question() displays the question and waits for user input
    rl.question(question, (answer) => {
      // When the user answers, resolve the promise with their input
      resolve(answer);
    });
  });
}

/**
 * Function to format dates into a readable string
 *
 * @param {Date} date - The date object to format
 * @returns {string} - Formatted date string (e.g., "01/15/2026")
 */
function formatDate(date) {
  // getDate() gets the day (1-31)
  // getMonth() gets the month (0-11, so we add 1)
  // getFullYear() gets the year (e.g., 2026)
  // padStart(2, '0') adds a leading zero if the number is single digit
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  // Return the formatted date as a string
  return `${month}/${day}/${year}`;
}

/**
 * Function to calculate the number of days between two dates
 *
 * @param {Date} date1 - The first date
 * @param {Date} date2 - The second date
 * @returns {number} - Number of days between the dates
 */
function calculateDaysBetween(date1, date2) {
  // Convert both dates to milliseconds and get the absolute difference
  // 1000 milliseconds = 1 second
  // 60 seconds = 1 minute
  // 60 minutes = 1 hour
  // 24 hours = 1 day
  // So divide by (1000 * 60 * 60 * 24) to convert milliseconds to days
  const timeDifference = Math.abs(date2 - date1);
  const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

  // Return the number of days
  return daysDifference;
}

// ============================================
// DATA INPUT FUNCTIONS - Functions to collect data from the user
// ============================================

/**
 * Function to collect period information from the user
 * This is called when the user wants to log a new period start
 *
 * @param {object} rl - The readline interface for user input
 */
async function logPeriodStart(rl) {
  console.log("\n--- LOG PERIOD START ---");

  // Ask the user when their period started
  const startDateStr = await askQuestion(
    'When did your period start? (YYYY-MM-DD or "today"): ',
    rl
  );

  // Parse the date input
  // If user entered "today", use today's date
  // Otherwise, parse the YYYY-MM-DD format
  let startDate =
    startDateStr.toLowerCase() === "today"
      ? new Date()
      : new Date(startDateStr);

  // Ask the user how heavy the flow is (light, moderate, heavy)
  const flowIntensity = await askQuestion(
    "Flow intensity (light/moderate/heavy): ",
    rl
  );

  // Ask the user if they have cramping
  const hasCramping = await askQuestion("Do you have cramps? (yes/no): ", rl);

  // Create an object to store this period entry
  // This object contains all relevant information about this period
  const periodEntry = {
    startDate: startDate.toISOString(), // ISO format for consistent storage
    flowIntensity: flowIntensity.toLowerCase(), // Store as lowercase for consistency
    cramping: hasCramping.toLowerCase() === "yes", // Convert to boolean (true/false)
    loggedAt: new Date().toISOString(), // Store when this entry was created
    duration: null, // Will be filled when period ends
  };

  // Add this period entry to the periods array in PeriodTrackingData
  PeriodTrackingData.periods.push(periodEntry);

  // Print confirmation message to the user
  console.log("✓ Period start logged successfully!");

  // Calculate and show average cycle
  calculateAndShowAverageCycle();
}

/**
 * Function to log symptoms the user is experiencing
 * This helps track patterns and predict future symptoms
 *
 * @param {object} rl - The readline interface for user input
 */
async function logSymptoms(rl) {
  console.log("\n--- LOG SYMPTOMS ---");

  // Ask the user what symptoms they're experiencing
  // This is open-ended to capture all possible symptoms
  const symptoms = await askQuestion(
    "What symptoms are you experiencing? (e.g., fatigue, headache, mood swings, acne): ",
    rl
  );

  // Ask the user to rate their overall feeling on a scale of 1-10
  // 1 = very bad, 10 = feeling great
  const moodRating = await askQuestion("Rate your mood (1-10): ", rl);

  // Ask the user for energy level on a scale of 1-10
  // 1 = exhausted, 10 = full of energy
  const energyLevel = await askQuestion("Energy level (1-10): ", rl);

  // Create a symptom entry object to store all this information
  const symptomEntry = {
    date: new Date().toISOString(), // Today's date in ISO format
    symptoms: symptoms.split(",").map((s) => s.trim()), // Split by comma and remove extra spaces
    moodRating: parseInt(moodRating), // Convert string to number
    energyLevel: parseInt(energyLevel), // Convert string to number
    loggedAt: new Date().toISOString(), // When this entry was logged
  };

  // Add this symptom entry to the symptoms array
  PeriodTrackingData.symptoms.push(symptomEntry);

  // Print confirmation message
  console.log("✓ Symptoms logged successfully!");
}

/**
 * Function to calculate the average menstrual cycle length
 * A typical cycle is 28 days, but can range from 21-35 days
 * This function updates the system's understanding of the user's cycle
 */
function calculateAndShowAverageCycle() {
  // If we have fewer than 2 period entries, we can't calculate a cycle
  if (PeriodTrackingData.periods.length < 2) {
    console.log(
      "(Need at least 2 period entries to calculate average cycle length)"
    );
    return;
  }

  // Create an array to store the cycle lengths
  let cycleLengths = [];

  // Loop through all periods starting from the second one
  // We use i = 1 because we need to compare each period with the previous one
  for (let i = 1; i < PeriodTrackingData.periods.length; i++) {
    // Get the current period's start date
    const currentPeriod = new Date(PeriodTrackingData.periods[i].startDate);

    // Get the previous period's start date
    const previousPeriod = new Date(
      PeriodTrackingData.periods[i - 1].startDate
    );

    // Calculate the days between these two periods
    // This gives us the cycle length
    const cycleLength = calculateDaysBetween(previousPeriod, currentPeriod);

    // Add this cycle length to our array
    cycleLengths.push(cycleLength);
  }

  // Calculate the average by summing all cycle lengths and dividing by the count
  // reduce() is an array method that combines all values into one
  // (sum, length) => sum + length adds each length to the running total
  // 0 is the starting value for sum
  const totalDays = cycleLengths.reduce((sum, length) => sum + length, 0);
  const average = Math.round(totalDays / cycleLengths.length);

  // Update the stored average
  PeriodTrackingData.averageCycleLength = average;

  // Show the calculated average to the user
  console.log(`Average cycle length: ${average} days`);
}

// ============================================
// AI ANALYSIS FUNCTIONS - Functions that use AI to analyze the data
// ============================================

/**
 * Function to send a request to OpenAI's API and get AI-powered analysis
 *
 * @param {string} prompt - The question or prompt to send to the AI
 * @returns {Promise<string>} - The AI's response
 */
async function getAIAnalysis(prompt) {
  try {
    // Make an HTTP POST request to OpenAI's API endpoint
    // axios.post() sends data to the specified URL
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions", // OpenAI's API endpoint
      {
        // The body of the request contains:
        model: AI_MODEL, // Which AI model to use
        messages: [
          {
            // The message to send to the AI
            role: "user", // Indicates this is a user message
            content: prompt, // The actual prompt/question
          },
        ],
        temperature: 0.7, // How creative the response should be (0-1, lower = more factual)
        max_tokens: 500, // Maximum length of the response
      },
      {
        // Headers for the request
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`, // Authentication with API key
          "Content-Type": "application/json", // Specify we're sending JSON
        },
      }
    );

    // Extract the AI's response from the response object
    // response.data contains the full response
    // .choices is an array of possible responses
    // [0] gets the first (and usually only) response
    // .message.content contains the actual text response
    const aiResponse = response.data.choices[0].message.content;

    // Return the AI's response to the caller
    return aiResponse;
  } catch (error) {
    // If there's an error (no API key, network issue, etc.)
    console.error("Error contacting AI service:", error.message);
    return "Unable to get AI analysis at this time.";
  }
}

/**
 * Function to get predictions about what to expect in the current cycle phase
 * Uses AI to analyze the user's period and symptom data
 */
async function getPredictions() {
  // Check if we have enough data to make predictions
  if (PeriodTrackingData.periods.length === 0) {
    console.log("\n⚠ No period data available. Please log a period first.");
    return;
  }

  // Get the most recent period entry
  const latestPeriod =
    PeriodTrackingData.periods[PeriodTrackingData.periods.length - 1];

  // Get the most recent symptom entry (if any exist)
  const latestSymptoms =
    PeriodTrackingData.symptoms.length > 0
      ? PeriodTrackingData.symptoms[PeriodTrackingData.symptoms.length - 1]
      : null;

  // Calculate how many days into the cycle we are
  // This helps the AI determine what phase of the cycle the user is in
  const daysSinceStart = calculateDaysBetween(
    new Date(latestPeriod.startDate),
    new Date()
  );

  // Create a detailed prompt for the AI that includes all relevant information
  const analysisPrompt = `
    Based on the following menstrual cycle data, provide predictions about what symptoms and changes the user might expect:
    
    - Latest period started: ${formatDate(new Date(latestPeriod.startDate))}
    - Flow intensity: ${latestPeriod.flowIntensity}
    - Days since period started: ${daysSinceStart}
    - Average cycle length: ${PeriodTrackingData.averageCycleLength} days
    - Current symptoms: ${
      latestSymptoms ? latestSymptoms.symptoms.join(", ") : "None logged"
    }
    - Current mood rating: ${
      latestSymptoms ? latestSymptoms.moodRating : "Not rated"
    }
    - Current energy level: ${
      latestSymptoms ? latestSymptoms.energyLevel : "Not rated"
    }
    
    Please provide:
    1. Current cycle phase (menstrual, follicular, ovulation, luteal)
    2. Predicted symptoms for the coming days
    3. Recommendations for self-care
    4. When the next expected period should start
  `;

  // Show a loading message to the user
  console.log("\n🔍 Analyzing your data...");

  // Call the AI function to get analysis
  const analysis = await getAIAnalysis(analysisPrompt);

  // Display the AI's analysis to the user
  console.log("\n--- AI ANALYSIS & PREDICTIONS ---");
  console.log(analysis);
}

/**
 * Function to get personalized insights based on how the user is feeling
 *
 * @param {object} rl - The readline interface for user input
 */
async function getPersonalizedInsights(rl) {
  // Ask the user how they're feeling
  const feeling = await askQuestion(
    "\nHow are you feeling? Describe your current state: ",
    rl
  );

  // Create a prompt that combines the user's current feeling with their cycle data
  const insightPrompt = `
    A person in their menstrual cycle is feeling: "${feeling}"
    
    Their recent data:
    - Average cycle length: ${PeriodTrackingData.averageCycleLength} days
    - Recent symptoms: ${
      PeriodTrackingData.symptoms.length > 0
        ? PeriodTrackingData.symptoms[
            PeriodTrackingData.symptoms.length - 1
          ].symptoms.join(", ")
        : "None logged"
    }
    
    Based on this, provide:
    1. Why they might be feeling this way based on their cycle
    2. Suggestions for managing their feelings
    3. What cycle phase they're likely in
  `;

  // Show loading message
  console.log("🔍 Analyzing your feelings...");

  // Get AI analysis
  const insights = await getAIAnalysis(insightPrompt);

  // Display the insights
  console.log("\n--- PERSONALIZED INSIGHTS ---");
  console.log(insights);
}

// ============================================
// DISPLAY FUNCTIONS - Functions to show data to the user
// ============================================

/**
 * Function to display all tracked data in a readable format
 */
function displayTrackedData() {
  console.log("\n=== YOUR TRACKING DATA ===\n");

  // Display period data
  console.log("--- PERIODS TRACKED ---");
  if (PeriodTrackingData.periods.length === 0) {
    console.log("No periods logged yet.");
  } else {
    // Loop through each logged period
    // forEach() executes a function for each item in the array
    PeriodTrackingData.periods.forEach((period, index) => {
      // index starts at 0, so add 1 to show period #1, #2, etc.
      console.log(`\nPeriod #${index + 1}:`);
      console.log(`  Start date: ${formatDate(new Date(period.startDate))}`);
      console.log(`  Flow intensity: ${period.flowIntensity}`);
      console.log(`  Has cramps: ${period.cramping ? "Yes" : "No"}`);
    });
  }

  // Display symptom data
  console.log("\n--- SYMPTOMS LOGGED ---");
  if (PeriodTrackingData.symptoms.length === 0) {
    console.log("No symptoms logged yet.");
  } else {
    // Loop through each logged symptom entry
    PeriodTrackingData.symptoms.forEach((symptom, index) => {
      console.log(`\nSymptom Log #${index + 1}:`);
      console.log(`  Date: ${formatDate(new Date(symptom.date))}`);
      console.log(`  Symptoms: ${symptom.symptoms.join(", ")}`);
      console.log(`  Mood: ${symptom.moodRating}/10`);
      console.log(`  Energy: ${symptom.energyLevel}/10`);
    });
  }

  // Display cycle information
  console.log("\n--- CYCLE STATISTICS ---");
  console.log(
    `Average cycle length: ${PeriodTrackingData.averageCycleLength} days`
  );
}

// ============================================
// MAIN MENU FUNCTION - The main interaction loop
// ============================================

/**
 * Function to display a menu and handle user choices
 * This is the main control center of the application
 */
async function showMainMenu() {
  // Create the readline interface for user input
  const rl = createInputInterface();

  // Initialize a variable to control the menu loop
  let running = true;

  // Keep showing the menu until the user chooses to exit
  while (running) {
    // Display the menu options
    console.log("\n╔════════════════════════════════════╗");
    console.log("║   PERIOD TRACKING SYSTEM WITH AI   ║");
    console.log("╚════════════════════════════════════╝");
    console.log("1. Log period start");
    console.log("2. Log symptoms");
    console.log("3. Get predictions");
    console.log("4. Get personalized insights");
    console.log("5. View tracked data");
    console.log("6. Exit");

    // Ask the user what they want to do
    const choice = await askQuestion("\nSelect option (1-6): ", rl);

    // Use a switch statement to handle different menu choices
    // switch compares the choice against different cases
    switch (choice) {
      case "1":
        // User chose to log period start
        await logPeriodStart(rl);
        break;

      case "2":
        // User chose to log symptoms
        await logSymptoms(rl);
        break;

      case "3":
        // User chose to get predictions
        await getPredictions();
        break;

      case "4":
        // User chose to get personalized insights
        await getPersonalizedInsights(rl);
        break;

      case "5":
        // User chose to view all tracked data
        displayTrackedData();
        break;

      case "6":
        // User chose to exit
        console.log(
          "\nThank you for using the Period Tracking System. Goodbye!"
        );
        running = false; // Set to false to exit the while loop
        break;

      default:
        // User entered an invalid option
        console.log("Invalid option. Please select 1-6.");
    }
  }

  // Close the readline interface when done
  // This releases system resources
  rl.close();
}

// ============================================
// PROGRAM START - Run the application
// ============================================

// This line runs the main menu function when the program starts
// It calls the async function and handles any errors that occur
showMainMenu().catch((error) => {
  console.error("Error:", error);
  // process.exit() terminates the program with an error code
  process.exit(1);
});
