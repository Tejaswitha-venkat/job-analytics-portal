const { getAllActiveAlertPreferences, updateAlertPreference } = require('./alert-model');
const { sendJobAlert } = require('./email-service');

// Function to check if a job matches the user's criteria
const jobMatchesCriteria = (job, criteria) => {
  // Check each criterion
  if (criteria.title && !job.title.toLowerCase().includes(criteria.title.toLowerCase())) {
    return false;
  }
  
  if (criteria.location && job.location !== criteria.location) {
    return false;
  }
  
  if (criteria.company && job.company !== criteria.company) {
    return false;
  }
  
  if (criteria.minSalary && (!job.salary || job.salary < criteria.minSalary)) {
    return false;
  }
  
  if (criteria.skills && criteria.skills.length > 0) {
    // Check if job requires any of the specified skills
    const jobHasRequiredSkill = criteria.skills.some(skill => 
      job.skills && job.skills.includes(skill)
    );
    
    if (!jobHasRequiredSkill) {
      return false;
    }
  }
  
  // If all checks pass, the job matches the criteria
  return true;
};

// Function to process new jobs and send alerts
const processNewJobsAndSendAlerts = async (newJobs) => {
  console.log(`Processing ${newJobs.length} new jobs for alerts...`);
  
  // Get all active alert preferences
  const activeAlertPreferences = getAllActiveAlertPreferences();
  
  // For each preference, find matching jobs and send alerts
  for (const preference of activeAlertPreferences) {
    // Skip if not due for notification based on frequency
    if (!shouldSendAlert(preference)) {
      continue;
    }
    
    // Find jobs that match this user's criteria
    const matchingJobs = newJobs.filter(job => 
      jobMatchesCriteria(job, preference.criteria)
    );
    
    // If there are matching jobs, send an alert
    if (matchingJobs.length > 0) {
      try {
        await sendJobAlert(preference, matchingJobs);
        
        // Update the lastSent timestamp
        updateAlertPreference(preference.userId, preference._id, {
          lastSent: new Date()
        });
      } catch (error) {
        console.error(`Failed to send alert to ${preference.email}:`, error);
      }
    }
  }
};

// Helper function to determine if an alert should be sent based on frequency
const shouldSendAlert = (preference) => {
  if (preference.frequency === 'immediate') {
    return true;
  }
  
  const now = new Date();
  const lastSent = preference.lastSent ? new Date(preference.lastSent) : null;
  
  if (!lastSent) {
    return true; // First time sending
  }
  
  if (preference.frequency === 'daily') {
    // Check if it's been at least 24 hours
    return (now - lastSent) >= 24 * 60 * 60 * 1000;
  }
  
  if (preference.frequency === 'weekly') {
    // Check if it's been at least 7 days
    return (now - lastSent) >= 7 * 24 * 60 * 60 * 1000;
  }
  
  return false;
};

module.exports = { processNewJobsAndSendAlerts };