# 🌸 Period Tracker - Modern Web Application

A beautiful, user-friendly period tracking system with AI-powered insights and predictions.

## ✨ Features

### Dashboard

- **Current Cycle Status**: Real-time day of cycle tracking
- **Cycle Statistics**: Average cycle length, last period date, total logged periods
- **Today's Mood**: Quick mood display with emoji
- **Interactive Calendar**: Visual representation of periods and ovulation days
- **Quick Actions**: Fast access to frequently used features

### Core Functionality

- **Log Period**: Track period start date, flow intensity, cramping, and notes
- **Log Symptoms**: Record daily symptoms, mood, energy levels
- **Cycle Predictions**: AI-powered or default predictions based on your data
- **Personalized Insights**: Get insights based on how you're feeling
- **Complete History**: View all logged periods and symptoms with detailed information

### Advanced Features

- **AI Integration**: Optional OpenAI API integration for advanced insights
- **Local Data Storage**: All data saved securely in browser's localStorage
- **Data Export**: Download your tracking data as JSON backup
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile

## 🚀 How to Use

### Opening the App

1. Open `index.html` in any modern web browser
2. No installation or server setup required
3. App works completely offline

### Getting Started

1. **Log Your First Period**
   - Click "Log Period" in the sidebar
   - Enter when your period started
   - Select flow intensity (Light/Moderate/Heavy)
   - Indicate if you have cramps
   - Add optional notes
   - Click "Log Period"

2. **Track Symptoms Daily**
   - Click "Log Symptoms" in the sidebar
   - Select your mood using emoji buttons (Terrible to Great)
   - Set your energy level using the slider
   - Select symptoms you're experiencing
   - Click "Save Symptoms"

3. **View Dashboard**
   - Dashboard shows your current cycle phase
   - Calendar displays period days (pink) and ovulation days (orange)
   - Today's date is highlighted with a border

4. **Get Predictions**
   - Click "Predictions" to see cycle-based predictions
   - Requires at least one logged period

5. **Get Insights**
   - Click "Insights" and describe how you're feeling
   - Get personalized responses based on your cycle

### Settings

- Click ⚙️ (Settings) in the sidebar
- Enter OpenAI API key (optional) for AI features
- Customize your average cycle length
- Enable/disable notifications

## 📊 Understanding Your Cycle

The app automatically calculates and displays your cycle phases:

- **Menstrual (Days 1-5)**: Your period - shown in pink on calendar
- **Follicular (Days 6-13)**: Follicle growth and development
- **Ovulation (Days 14-16)**: Most fertile period - shown in orange on calendar
- **Luteal (Days 17-28)**: Luteal phase after ovulation

## 💾 Data Storage

All your data is stored locally in your browser:

- No data is sent to any server (except optional AI requests)
- Data persists even after closing the browser
- Clear browser data to delete all stored information

### Backing Up Your Data

- Click the export button (if added) to download JSON backup
- Save the file safely
- You can restore data by re-importing

## 🔐 Privacy & Security

- **No Cloud Sync**: All data stays on your device
- **No Tracking**: We don't track your usage
- **Optional AI**: AI features only work if you provide an API key
- **Open Source Ready**: Code is transparent and modifiable

## 🛠️ Troubleshooting

### App Not Loading

1. **Check Console**: Press F12 and look at the Console tab for errors
2. **Browser Compatibility**: Use Chrome, Firefox, Safari, or Edge
3. **Clear Cache**: Try clearing browser cache and reloading
4. **Check File Path**: Ensure `index.html`, `styles.css`, and `index.js` are in the same folder

### Forms Not Working

1. Check that all form elements have correct IDs
2. Open Developer Tools (F12) and check Console for errors
3. Try refreshing the page
4. Ensure JavaScript is enabled in your browser

### Data Not Saving

1. Check if LocalStorage is enabled in your browser
2. You should see console message: "✓ Data structure initialized"
3. Try logging a period again and check localStorage in DevTools

### AI Features Not Working

1. Verify API key is correctly entered in Settings
2. Check API key has active credits
3. Ensure internet connection is active
4. Check browser console for specific error messages

## 🌐 Using the App Offline

The app works completely offline! You can:

- ✅ View dashboard
- ✅ Log periods and symptoms
- ✅ View history
- ✅ See calendar
- ✅ Get default insights (without AI)

**Only requires internet for:**

- ❌ AI-powered predictions
- ❌ Exporting data (browser feature)

## 📱 Mobile Features

The app is fully responsive:

- Sidebar converts to horizontal navigation on mobile
- All forms adapt to small screens
- Touch-friendly buttons and controls
- Optimized spacing for mobile devices

## 🎨 Customization

### Change Colors

Edit the CSS variables in `styles.css`:

```css
:root {
  --primary-color: #e91e63; /* Main pink color */
  --secondary-color: #9c27b0; /* Purple color */
  --accent-color: #ff6f00; /* Orange color */
}
```

### Modify Average Cycle

1. Click Settings ⚙️
2. Change "Average Cycle Length"
3. Click "Save Settings"

## 🔄 Browser Storage Limits

Your browser localStorage has a limit (usually 5-10MB):

- Can store data for 100+ years of daily tracking
- If you hit the limit, export and clear data

## 📞 Support

If you encounter issues:

1. **Check Console**: F12 → Console tab for error messages
2. **Check Files**: Ensure all three files are present and in same folder
3. **Try Different Browser**: Test in Chrome, Firefox, or Safari
4. **Clear Data**: Clear browser cache and try again

## 📝 License

Free to use and modify for personal use.

## 🎯 Future Enhancement Ideas

- [ ] Period prediction algorithm
- [ ] Medication tracking
- [ ] Integration with health apps
- [ ] Dark mode
- [ ] Multi-language support
- [ ] Export to PDF
- [ ] Email reminders
- [ ] Community features

---

**Made with ❤️ for your health**

Last Updated: January 21, 2026
