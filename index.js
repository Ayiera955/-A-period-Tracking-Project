/* ============================================
   PERIOD TRACKING SYSTEM - WEB VERSION WITH LOGIN
   ============================================ */

console.log('Period Tracker App Loading...');

// ============================================
// DATA STRUCTURE
// ============================================

const PeriodTrackingData = {
  periods: [],
  symptoms: [],
  averageCycleLength: 28,
};

// Current logged-in user
let currentUser = null;

// API Key storage (optional)
let OPENAI_API_KEY = localStorage.getItem('apiKey') || '';

console.log('Data structure initialized');

// ============================================
// LOGIN & AUTHENTICATION SYSTEM
// ============================================

// Demo accounts for testing
const DEMO_ACCOUNTS = {
  'demo': {
    username: 'demo',
    password: 'demo123',
    email: 'demo@periodtracker.com',
    name: 'Demo User'
  }
};

function initializeLoginSystem() {
  console.log('Initializing login system...');
  
  // Check if user is already logged in
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    try {
      currentUser = JSON.parse(savedUser);
      console.log('✓ User restored from session:', currentUser.username);
      showAppContainer();
      loadUserData();
      initializeApp();
    } catch (error) {
      console.error('Error restoring user session:', error);
      showLoginScreen();
    }
  } else {
    showLoginScreen();
  }
  
  setupLoginListeners();
}

function setupLoginListeners() {
  console.log('Setting up login listeners...');
  
  // Toggle between login and register forms
  const toggleRegisterBtn = document.getElementById('toggle-register-btn');
  const toggleLoginBtn = document.getElementById('toggle-login-btn');
  
  if (toggleRegisterBtn) {
    toggleRegisterBtn.addEventListener('click', function(e) {
      e.preventDefault();
      toggleLoginRegisterForm('register');
    });
  }
  
  if (toggleLoginBtn) {
    toggleLoginBtn.addEventListener('click', function(e) {
      e.preventDefault();
      toggleLoginRegisterForm('login');
    });
  }
  
  // Login form submission
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  // Register form submission
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }
}

function toggleLoginRegisterForm(type) {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const loginToggle = document.querySelector('.login-toggle');
  const registerToggle = document.querySelector('.register-toggle');
  
  if (type === 'register') {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    loginToggle.classList.add('hidden');
    registerToggle.classList.remove('hidden');
  } else {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    loginToggle.classList.remove('hidden');
    registerToggle.classList.add('hidden');
  }
}

function handleLogin(e) {
  e.preventDefault();
  
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;
  const rememberMe = document.getElementById('remember-me').checked;
  
  if (!username || !password) {
    showNotification('Please fill in all fields', 'warning');
    return;
  }
  
  // Get all stored users from localStorage
  const allUsers = JSON.parse(localStorage.getItem('allUsers') || '{}');
  
  // Check demo account
  if (DEMO_ACCOUNTS[username] && DEMO_ACCOUNTS[username].password === password) {
    currentUser = DEMO_ACCOUNTS[username];
    console.log('✓ Demo account login successful');
  }
  // Check registered users
  else if (allUsers[username] && allUsers[username].password === password) {
    currentUser = allUsers[username];
    console.log('✓ User login successful:', username);
  }
  else {
    showNotification('❌ Invalid username or password', 'error');
    return;
  }
  
  // Save login session
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  
  if (rememberMe) {
    localStorage.setItem('lastLoginUser', username);
  }
  
  // Show success message with custom notification
  showNotification(`🎉 Welcome back, ${currentUser.name}!`, 'success');
  console.log('✓ Login successful for:', currentUser.username);
  
  // Clear form
  e.target.reset();
  
  // Wait a moment then show app
  setTimeout(() => {
    showAppContainer();
    loadUserData();
    initializeApp();
  }, 800);
}

function handleRegister(e) {
  e.preventDefault();
  
  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const username = document.getElementById('register-username').value;
  const password = document.getElementById('register-password').value;
  const confirmPassword = document.getElementById('register-confirm').value;
  
  // Validation
  if (!name || !email || !username || !password || !confirmPassword) {
    showNotification('Please fill in all fields', 'warning');
    return;
  }
  
  if (password !== confirmPassword) {
    showNotification('❌ Passwords do not match', 'warning');
    return;
  }
  
  if (password.length < 6) {
    showNotification('❌ Password must be at least 6 characters', 'warning');
    return;
  }
  
  // Check if username already exists
  const allUsers = JSON.parse(localStorage.getItem('allUsers') || '{}');
  if (allUsers[username] || DEMO_ACCOUNTS[username]) {
    showNotification('❌ Username already exists', 'warning');
    return;
  }
  
  // Create new user
  const newUser = { username, email, password, name };
  allUsers[username] = newUser;
  localStorage.setItem('allUsers', JSON.stringify(allUsers));
  
  showNotification(`✅ Account created successfully! Please log in.`, 'success');
  console.log('✓ New user registered:', username);
  
  // Clear form and switch back to login
  e.target.reset();
  setTimeout(() => {
    toggleLoginRegisterForm('login');
  }, 1500);
}

function showLoginScreen() {
  const loginScreen = document.getElementById('login-screen');
  const appContainer = document.getElementById('app-container');
  
  if (loginScreen) loginScreen.classList.remove('hidden');
  if (appContainer) appContainer.classList.add('hidden');
}

function showAppContainer() {
  const loginScreen = document.getElementById('login-screen');
  const appContainer = document.getElementById('app-container');
  
  if (loginScreen) loginScreen.classList.add('hidden');
  if (appContainer) appContainer.classList.remove('hidden');
}

function handleLogout() {
  if (!confirm('Are you sure you want to log out?')) {
    return;
  }
  
  localStorage.removeItem('currentUser');
  currentUser = null;
  
  showNotification('👋 You have been logged out', 'info');
  console.log('✓ User logged out');
  
  setTimeout(() => {
    showLoginScreen();
    // Clear forms
    document.getElementById('login-form').reset();
    document.getElementById('register-form').reset();
  }, 500);
}

function loadUserData() {
  if (currentUser) {
    document.getElementById('user-name').textContent = currentUser.name;
    console.log('✓ User data loaded:', currentUser.name);
  }
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM Content Loaded - Starting initialization');
  try {
    initializeLoginSystem();
    console.log('✓ Login system initialized successfully');
  } catch (error) {
    console.error('Error during initialization:', error);
  }
});

function initializeApp() {
  console.log('Loading data from localStorage...');
  loadData();
  console.log('Setting up event listeners...');
  setupEventListeners();
  console.log('Setting today date...');
  setTodayDate();
  console.log('Generating calendar...');
  generateCalendar();
  console.log('Updating dashboard...');
  updateDashboard();
  console.log('✓ All initialization steps complete');
}

function setupEventListeners() {
  try {
    // Navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const section = this.getAttribute('data-section');
        switchSection(section);
      });
    });

    // Form submissions
    const periodForm = document.getElementById('period-form');
    const symptomsForm = document.getElementById('symptoms-form');
    const insightsForm = document.getElementById('insights-form');
    
    if (periodForm) periodForm.addEventListener('submit', handlePeriodSubmit);
    if (symptomsForm) symptomsForm.addEventListener('submit', handleSymptomSubmit);
    if (insightsForm) insightsForm.addEventListener('submit', handleInsightsSubmit);

    // Settings
    const settingsBtn = document.querySelector('.btn-settings');
    if (settingsBtn) settingsBtn.addEventListener('click', openSettingsModal);
    
    // Logout button
    const logoutBtn = document.querySelector('.btn-logout');
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    
    const modalClose = document.querySelector('.modal-close');
    if (modalClose) modalClose.addEventListener('click', closeSettingsModal);

    // Mood selector
    document.querySelectorAll('.mood-btn').forEach(btn => {
      btn.addEventListener('click', selectMood);
    });

    // Energy level slider
    const energySlider = document.getElementById('energy-level');
    if (energySlider) {
      energySlider.addEventListener('input', function() {
        document.getElementById('energy-value').textContent = this.value;
      });
    }

    // Calendar navigation
    const prevBtn = document.getElementById('prev-month');
    const nextBtn = document.getElementById('next-month');
    if (prevBtn) prevBtn.addEventListener('click', previousMonth);
    if (nextBtn) nextBtn.addEventListener('click', nextMonth);

    // History tabs
    document.querySelectorAll('.history-tab').forEach(tab => {
      tab.addEventListener('click', function() {
        switchHistoryTab(this.getAttribute('data-tab'));
      });
    });

    // Modal close on overlay click
    const settingsModal = document.getElementById('settings-modal');
    if (settingsModal) {
      settingsModal.addEventListener('click', function(e) {
        if (e.target === this) closeModal('settings-modal');
      });
    }
    
    console.log('✓ All event listeners attached successfully');
  } catch (error) {
    console.error('Error setting up event listeners:', error);
  }
}

// ============================================
// SECTION NAVIGATION
// ============================================

function switchSection(sectionId) {
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
  });

  const section = document.getElementById(sectionId);
  if (section) {
    section.classList.add('active');
  }

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  const navBtn = document.querySelector(`[data-section="${sectionId}"]`);
  if (navBtn) navBtn.classList.add('active');

  const titles = {
    'dashboard': 'Dashboard',
    'log-period': 'Log Period',
    'log-symptoms': 'Log Symptoms',
    'predictions': 'Cycle Predictions',
    'insights': 'Personalized Insights',
    'history': 'Tracking History'
  };
  document.getElementById('section-title').textContent = titles[sectionId] || sectionId;

  if (sectionId === 'history') {
    updateHistory();
  }
}

function switchHistoryTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });

  const tabContent = document.getElementById(`${tabName}-tab`);
  if (tabContent) tabContent.classList.add('active');

  document.querySelectorAll('.history-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  const tabBtn = document.querySelector(`[data-tab="${tabName}"]`);
  if (tabBtn) tabBtn.classList.add('active');
}

// ============================================
// FORM HANDLERS
// ============================================

async function handlePeriodSubmit(e) {
  e.preventDefault();

  const startDate = new Date(document.getElementById('period-start-date').value);
  const flowIntensity = document.querySelector('input[name="flow-intensity"]:checked').value;
  const cramping = document.getElementById('period-cramping').checked;
  const notes = document.getElementById('period-notes').value;

  const periodEntry = {
    startDate: startDate.toISOString(),
    flowIntensity: flowIntensity,
    cramping: cramping,
    notes: notes,
    loggedAt: new Date().toISOString(),
    duration: null
  };

  PeriodTrackingData.periods.push(periodEntry);
  saveData();
  
  calculateAndShowAverageCycle();
  updateDashboard();
  generateCalendar();

  showNotification('✅ Period logged successfully! Your data has been saved.', 'success');
  e.target.reset();
  switchSection('dashboard');
}

async function handleSymptomSubmit(e) {
  e.preventDefault();

  const selectedSymptoms = Array.from(
    document.querySelectorAll('input[name="symptoms"]:checked')
  ).map(input => input.value);

  const moodRating = parseInt(document.getElementById('mood-rating').value);
  const energyLevel = parseInt(document.getElementById('energy-level').value);

  const symptomEntry = {
    date: new Date().toISOString(),
    symptoms: selectedSymptoms,
    moodRating: moodRating,
    energyLevel: energyLevel,
    loggedAt: new Date().toISOString()
  };

  PeriodTrackingData.symptoms.push(symptomEntry);
  saveData();
  
  updateDashboard();

  showNotification('✅ Symptoms logged successfully! Your information has been saved.', 'success');
  e.target.reset();
  document.getElementById('mood-rating').value = '3';
  document.getElementById('energy-level').value = '5';
  document.getElementById('energy-value').textContent = '5';
  switchSection('dashboard');
}

async function handleInsightsSubmit(e) {
  e.preventDefault();

  const feeling = document.getElementById('feeling-input').value;

  if (!feeling.trim()) {
    showNotification('Please describe how you\'re feeling', 'warning');
    return;
  }

  const insightsContent = document.getElementById('insights-content');
  insightsContent.innerHTML = '<div class="empty-state pulse">Analyzing your feelings...</div>';

  try {
    if (OPENAI_API_KEY) {
      const insights = await getAIAnalysis(feeling);
      insightsContent.innerHTML = formatAIResponse(insights);
    } else {
      const insights = generateDefaultInsights(feeling);
      insightsContent.innerHTML = insights;
    }
  } catch (error) {
    insightsContent.innerHTML = '<p class="empty-state">Unable to get insights. Please try again.</p>';
  }

  e.target.reset();
}

// ============================================
// DASHBOARD UPDATES
// ============================================

function updateDashboard() {
  if (PeriodTrackingData.periods.length > 0) {
    const lastPeriod = new Date(PeriodTrackingData.periods[PeriodTrackingData.periods.length - 1].startDate);
    const daysInCycle = calculateDaysBetween(lastPeriod, new Date());
    const cyclePhase = calculateCyclePhase(daysInCycle, PeriodTrackingData.averageCycleLength);

    document.getElementById('cycle-day').textContent = daysInCycle;
    document.getElementById('cycle-phase').textContent = `Phase: ${cyclePhase}`;
    
    const nextPeriod = new Date(lastPeriod);
    nextPeriod.setDate(nextPeriod.getDate() + PeriodTrackingData.averageCycleLength);
    document.getElementById('next-period-estimate').textContent = 
      `Next period: ${formatDate(nextPeriod)}`;
    
    document.getElementById('last-period').textContent = formatDate(lastPeriod);
  } else {
    document.getElementById('cycle-day').textContent = '-';
    document.getElementById('cycle-phase').textContent = 'Not tracked';
    document.getElementById('next-period-estimate').textContent = 'Next period: Not calculated';
    document.getElementById('last-period').textContent = 'No data';
  }

  document.getElementById('avg-cycle').textContent = `${PeriodTrackingData.averageCycleLength} days`;
  document.getElementById('periods-count').textContent = PeriodTrackingData.periods.length;

  const todaySymptoms = PeriodTrackingData.symptoms.find(s => 
    isToday(new Date(s.date))
  );

  if (todaySymptoms) {
    const moodEmojis = ['😢', '😞', '😐', '🙂', '😄'];
    const emoji = moodEmojis[todaySymptoms.moodRating - 1] || '😐';
    document.getElementById('mood-emoji').textContent = emoji;
    document.getElementById('mood-text').textContent = `Mood: ${todaySymptoms.moodRating}/5`;
  } else {
    document.getElementById('mood-emoji').textContent = '😐';
    document.getElementById('mood-text').textContent = 'No mood logged today';
  }
}

// ============================================
// CALENDAR FUNCTIONS
// ============================================

let currentCalendarDate = new Date();

function generateCalendar() {
  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  
  const monthName = currentCalendarDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  document.getElementById('calendar-month').textContent = monthName;
  
  const calendarView = document.getElementById('calendar-view');
  calendarView.innerHTML = '';
  
  const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  dayHeaders.forEach(day => {
    const header = document.createElement('div');
    header.className = 'calendar-day calendar-header';
    header.textContent = day;
    header.style.fontWeight = '600';
    header.style.backgroundColor = 'var(--bg-tertiary)';
    calendarView.appendChild(header);
  });
  
  for (let i = 0; i < startingDayOfWeek; i++) {
    const emptyDay = document.createElement('div');
    emptyDay.className = 'calendar-day other-month';
    emptyDay.textContent = '';
    calendarView.appendChild(emptyDay);
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    dayElement.textContent = day;
    
    const currentDate = new Date(year, month, day);
    
    if (isToday(currentDate)) {
      dayElement.classList.add('today');
    }
    
    const isPeriodDay = PeriodTrackingData.periods.some(period => {
      const periodStart = new Date(period.startDate);
      const daysDiff = calculateDaysBetween(periodStart, currentDate);
      return daysDiff >= 0 && daysDiff <= 5;
    });
    
    if (isPeriodDay) {
      dayElement.classList.add('period-day');
    }
    
    if (PeriodTrackingData.periods.length > 0) {
      const lastPeriod = new Date(PeriodTrackingData.periods[PeriodTrackingData.periods.length - 1].startDate);
      const daysSince = calculateDaysBetween(lastPeriod, currentDate);
      if (daysSince > 0 && daysSince < PeriodTrackingData.averageCycleLength) {
        if (Math.abs(daysSince - 14) <= 2) {
          dayElement.classList.add('ovulation');
        }
      }
    }
    
    calendarView.appendChild(dayElement);
  }
}

function previousMonth() {
  currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
  generateCalendar();
}

function nextMonth() {
  currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
  generateCalendar();
}

// ============================================
// HISTORY DISPLAY
// ============================================

function updateHistory() {
  updatePeriodsHistory();
  updateSymptomsHistory();
}

function updatePeriodsHistory() {
  const periodsList = document.getElementById('periods-history');
  
  if (PeriodTrackingData.periods.length === 0) {
    periodsList.innerHTML = '<p class="empty-state">No periods logged yet</p>';
    return;
  }
  
  let html = '';
  
  PeriodTrackingData.periods.forEach((period, index) => {
    const startDate = new Date(period.startDate);
    html += `
      <div class="history-item">
        <div class="history-item-date">Period #${PeriodTrackingData.periods.length - index}</div>
        <div class="history-item-details">
          <p><strong>Start Date:</strong> ${formatDate(startDate)}</p>
          <p><strong>Flow:</strong> ${capitalizeFirst(period.flowIntensity)}</p>
          <p><strong>Cramps:</strong> ${period.cramping ? 'Yes' : 'No'}</p>
          ${period.notes ? `<p><strong>Notes:</strong> ${period.notes}</p>` : ''}
        </div>
      </div>
    `;
  });
  
  periodsList.innerHTML = html;
}

function updateSymptomsHistory() {
  const symptomsList = document.getElementById('symptoms-history');
  
  if (PeriodTrackingData.symptoms.length === 0) {
    symptomsList.innerHTML = '<p class="empty-state">No symptoms logged yet</p>';
    return;
  }
  
  let html = '';
  
  PeriodTrackingData.symptoms.forEach((symptom, index) => {
    const date = new Date(symptom.date);
    const moodEmojis = ['😢', '😞', '😐', '🙂', '😄'];
    const emoji = moodEmojis[symptom.moodRating - 1] || '😐';
    
    html += `
      <div class="history-item">
        <div class="history-item-date">${formatDate(date)}</div>
        <div class="history-item-details">
          <p><strong>Mood:</strong> ${emoji} ${symptom.moodRating}/5</p>
          <p><strong>Energy:</strong> ${symptom.energyLevel}/10</p>
          ${symptom.symptoms.length > 0 ? 
            `<p><strong>Symptoms:</strong> ${symptom.symptoms.map(s => capitalizeFirst(s)).join(', ')}</p>` 
            : '<p><strong>Symptoms:</strong> None</p>'}
        </div>
      </div>
    `;
  });
  
  symptomsList.innerHTML = html;
}

// ============================================
// SETTINGS MODAL
// ============================================

function openSettingsModal() {
  const modal = document.getElementById('settings-modal');
  modal.classList.add('active');
  
  document.getElementById('api-key').value = OPENAI_API_KEY;
  document.getElementById('cycle-length').value = PeriodTrackingData.averageCycleLength;
}

function closeSettingsModal() {
  closeModal('settings-modal');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}

function saveSettings() {
  const apiKey = document.getElementById('api-key').value;
  const cycleLength = parseInt(document.getElementById('cycle-length').value) || 28;
  
  OPENAI_API_KEY = apiKey;
  PeriodTrackingData.averageCycleLength = cycleLength;
  
  localStorage.setItem('apiKey', apiKey);
  localStorage.setItem('cycleLength', cycleLength);
  
  saveData();
  showNotification('✅ Settings saved successfully!', 'success');
  closeModal('settings-modal');
}

// ============================================
// MOOD SELECTOR
// ============================================

function selectMood(e) {
  const moodValue = e.target.closest('.mood-btn').getAttribute('data-mood');
  document.getElementById('mood-rating').value = moodValue;
  
  document.querySelectorAll('.mood-btn').forEach(btn => {
    btn.classList.remove('selected');
  });
  e.target.closest('.mood-btn').classList.add('selected');
}

// ============================================
// UTILITY FUNCTIONS - COMPLETE SECTION
// ============================================

function calculateDaysBetween(date1, date2) {
  const timeDifference = Math.abs(date2 - date1);
  const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  return daysDifference;
}

function calculateAndShowAverageCycle() {
  if (PeriodTrackingData.periods.length < 2) {
    return;
  }

  let cycleLengths = [];

  for (let i = 1; i < PeriodTrackingData.periods.length; i++) {
    const currentPeriod = new Date(PeriodTrackingData.periods[i].startDate);
    const previousPeriod = new Date(PeriodTrackingData.periods[i - 1].startDate);
    const cycleLength = calculateDaysBetween(previousPeriod, currentPeriod);
    cycleLengths.push(cycleLength);
  }

  const totalDays = cycleLengths.reduce((sum, length) => sum + length, 0);
  const average = Math.round(totalDays / cycleLengths.length);

  PeriodTrackingData.averageCycleLength = average;
  localStorage.setItem('cycleLength', average);
}

function calculateCyclePhase(dayOfCycle, cycleLength) {
  if (dayOfCycle <= 5) return 'Menstrual';
  if (dayOfCycle <= 13) return 'Follicular';
  if (dayOfCycle <= 16) return 'Ovulation';
  return 'Luteal';
}

function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

function formatDateISO(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
}

function isToday(date) {
  const today = new Date();
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
}

function setTodayDate() {
  const today = new Date();
  const periodStartInput = document.getElementById('period-start-date');
  const symptomDateInput = document.getElementById('symptom-date');
  if (periodStartInput) periodStartInput.valueAsDate = today;
  if (symptomDateInput) symptomDateInput.valueAsDate = today;
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, ' ');
}

// ============================================
// AI ANALYSIS (OPTIONAL)
// ============================================

async function getAIAnalysis(prompt) {
  if (!OPENAI_API_KEY) {
    throw new Error('API key not configured');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'user',
          content: prompt
        }],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('AI Analysis Error:', error);
    throw error;
  }
}

function generateDefaultInsights(feeling) {
  const today = new Date();
  let html = '<div class="prediction-item">';
  
  if (PeriodTrackingData.periods.length > 0) {
    const lastPeriod = new Date(PeriodTrackingData.periods[PeriodTrackingData.periods.length - 1].startDate);
    const daysInCycle = calculateDaysBetween(lastPeriod, today);
    const phase = calculateCyclePhase(daysInCycle, PeriodTrackingData.averageCycleLength);
    
    html += `
      <h4>Your Current Cycle Phase</h4>
      <p>You're currently in the <strong>${phase} phase</strong> (Day ${daysInCycle} of your cycle). This phase typically brings specific physical and emotional changes.</p>
      
      <h4>How You're Feeling</h4>
      <p>You mentioned: "${feeling}"</p>
      <p>This feeling is common during the ${phase} phase. Your hormonal changes during this time can significantly affect your mood and energy levels.</p>
      
      <h4>Self-Care Tips</h4>
      <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
        <li>Stay hydrated and maintain a balanced diet</li>
        <li>Get adequate sleep (7-9 hours recommended)</li>
        <li>Engage in gentle exercise like yoga or walking</li>
        <li>Practice stress-reduction techniques like meditation</li>
        <li>Track your symptoms to identify patterns</li>
      </ul>
    `;
  } else {
    html += `
      <h4>Start Tracking to Get Better Insights</h4>
      <p>You mentioned: "${feeling}"</p>
      <p>To provide more personalized insights, please start logging your period and symptoms. This will help identify patterns and provide cycle-specific advice.</p>
    `;
  }
  
  html += '</div>';
  return html;
}

function formatAIResponse(text) {
  const paragraphs = text.split('\n\n');
  let html = '';
  
  paragraphs.forEach(para => {
    if (para.trim()) {
      if (para.includes(':') && para.length < 100) {
        const parts = para.split(':');
        html += `<div class="prediction-item"><h4>${parts[0].trim()}</h4><p>${parts.slice(1).join(':').trim()}</p></div>`;
      } else {
        html += `<div class="prediction-item"><p>${para.trim()}</p></div>`;
      }
    }
  });
  
  return html || '<p class="empty-state">No insights available</p>';
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    background-color: ${type === 'success' ? '#4caf50' : type === 'warning' ? '#ff9800' : type === 'error' ? '#f44336' : '#2196f3'};
    color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 10000;
    animation: slideIn 0.3s ease;
    font-weight: 600;
    max-width: 400px;
    word-wrap: break-word;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease forwards';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ============================================
// DATA PERSISTENCE
// ============================================

function saveData() {
  localStorage.setItem('periodTrackingData', JSON.stringify(PeriodTrackingData));
  console.log('✓ Data saved to localStorage');
}

function loadData() {
  const saved = localStorage.getItem('periodTrackingData');
  if (saved) {
    Object.assign(PeriodTrackingData, JSON.parse(saved));
    console.log('✓ Data loaded from localStorage');
  }
  
  const savedCycleLength = localStorage.getItem('cycleLength');
  if (savedCycleLength) {
    PeriodTrackingData.averageCycleLength = parseInt(savedCycleLength);
  }
}

// ============================================
// EXPORT FUNCTIONALITY
// ============================================

function exportData() {
  const dataStr = JSON.stringify(PeriodTrackingData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `period-tracker-backup-${formatDateISO(new Date())}.json`;
  link.click();
  showNotification('✓ Data exported successfully!', 'success');
}
