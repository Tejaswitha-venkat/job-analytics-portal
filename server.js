const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const { fetchAndProcessJobData } = require('./data-processor');
const { processNewJobsAndSendAlerts } = require('./job-matcher');
const alertRoutes = require('./alert-routes');

const app = express();
const PORT = process.env.PORT || 8080; // Change 3000 to 3001 or another available port

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// API Routes
app.use('/api/alerts', alertRoutes);

app.get('/api/jobs', (req, res) => {
  // Read from the processed data file
  const jobsData = require('./public/data/jobs_data.json');
  res.json(jobsData);
});

app.get('/api/stats', (req, res) => {
  const jobsData = require('./public/data/jobs_data.json');
  
  // Calculate statistics
  const totalJobs = jobsData.length;
  const avgSalary = jobsData.reduce((sum, job) => sum + (job.salary_normalized || 0), 0) / totalJobs;
  
  res.json({
    totalJobs,
    avgSalary,
    lastUpdated: new Date().toISOString()
  });
});

// Variable to store the last processed jobs
let lastProcessedJobs = [];

// Schedule data updates every hour
cron.schedule('0 * * * *', async () => {
  console.log('Running scheduled job data update');
  
  // Fetch and process new job data
  const newJobsData = await fetchAndProcessJobData();
  
  // Identify new jobs since last update
  const newJobs = identifyNewJobs(newJobsData, lastProcessedJobs);
  
  // Process new jobs and send alerts
  if (newJobs.length > 0) {
    await processNewJobsAndSendAlerts(newJobs);
  }
  
  // Update the last processed jobs
  lastProcessedJobs = newJobsData;
});

// Helper function to identify new jobs
function identifyNewJobs(currentJobs, previousJobs) {
  if (!previousJobs.length) {
    return []; // First run, don't send alerts for all jobs
  }
  
  // Create a set of previous job IDs for quick lookup
  const previousJobIds = new Set(previousJobs.map(job => job.id));
  
  // Filter out jobs that weren't in the previous batch
  return currentJobs.filter(job => !previousJobIds.has(job.id));
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Initial data fetch on server start
  fetchAndProcessJobData()
    .then(jobsData => {
      lastProcessedJobs = jobsData;
      console.log(`Initial data fetch complete: ${jobsData.length} jobs loaded`);
    })
    .catch(error => {
      console.error('Error during initial data fetch:', error);
    });
});