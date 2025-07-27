// This file would be part of your database models if using MongoDB/Mongoose
// Here's a simplified version

class AlertPreference {
  constructor(userId, email, criteria, frequency) {
    this.userId = userId;
    this.email = email;
    this.criteria = criteria; // Object containing job search criteria
    this.frequency = frequency; // 'daily', 'weekly', 'immediate'
    this.lastSent = null;
    this.isActive = true;
    this.createdAt = new Date();
  }

  // In a real implementation, you'd have methods to save to database
}

// Mock database for demonstration
const alertPreferencesDB = [];

const saveAlertPreference = (preference) => {
  // In a real app, this would save to a database
  alertPreferencesDB.push(preference);
  return preference;
};

const getAlertPreferencesByUserId = (userId) => {
  return alertPreferencesDB.filter(pref => pref.userId === userId);
};

const getAllActiveAlertPreferences = () => {
  return alertPreferencesDB.filter(pref => pref.isActive);
};

const updateAlertPreference = (userId, preferenceId, updates) => {
  const index = alertPreferencesDB.findIndex(
    pref => pref.userId === userId && pref._id === preferenceId
  );
  
  if (index !== -1) {
    alertPreferencesDB[index] = { ...alertPreferencesDB[index], ...updates };
    return alertPreferencesDB[index];
  }
  
  return null;
};

module.exports = {
  AlertPreference,
  saveAlertPreference,
  getAlertPreferencesByUserId,
  getAllActiveAlertPreferences,
  updateAlertPreference
};