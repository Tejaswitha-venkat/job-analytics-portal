const fs = require('fs').promises;
const path = require('path');

// Function to fetch job data from an API or other source
async function fetchJobData() {
  // In a real application, this would fetch data from an API
  // For demonstration, we'll return sample data
  return [
    {
      id: 'job-1',
      title: 'Senior Frontend Developer',
      company: 'Tech Innovations Inc.',
      location: 'New York, NY',
      salary_normalized: 135000,
      skills: ['JavaScript', 'React', 'TypeScript', 'CSS'],
      date_posted: '2023-06-20',
      url: 'https://example.com/jobs/senior-frontend-developer'
    },
    {
      id: 'job-2',
      title: 'Data Scientist',
      company: 'Analytics Pro',
      location: 'Remote',
      salary_normalized: 125000,
      skills: ['Python', 'Machine Learning', 'SQL', 'Data Visualization'],
      date_posted: '2023-06-19',
      url: 'https://example.com/jobs/data-scientist'
    },
    {
      id: 'job-3',
      title: 'Full Stack Developer',
      company: 'Web Solutions',
      location: 'San Francisco, CA',
      salary_normalized: 140000,
      skills: ['JavaScript', 'Node.js', 'React', 'MongoDB'],
      date_posted: '2023-06-18',
      url: 'https://example.com/jobs/full-stack-developer'
    }
  ];
}

// Process the job data (clean, transform, etc.)
async function processJobData(rawData) {
  // In a real application, you would process the data here
  // For now, we'll just return the data as is
  return rawData;
}

// Save processed data to a JSON file
async function saveProcessedData(processedData) {
  try {
    // Ensure the directory exists
    const dataDir = path.join(__dirname, 'public', 'data');
    await fs.mkdir(dataDir, { recursive: true });
    
    // Write the data to a JSON file
    const filePath = path.join(dataDir, 'jobs_data.json');
    await fs.writeFile(filePath, JSON.stringify(processedData, null, 2));
    
    console.log(`Data saved to ${filePath}`);
    return true;
  } catch (error) {
    console.error('Error saving processed data:', error);
    return false;
  }
}

// Main function to fetch and process job data
async function fetchAndProcessJobData() {
  try {
    console.log('Fetching job data...');
    const rawData = await fetchJobData();
    
    console.log(`Processing ${rawData.length} jobs...`);
    const processedData = await processJobData(rawData);
    
    // Save the processed data
    await saveProcessedData(processedData);
    
    return processedData;
  } catch (error) {
    console.error('Error in fetchAndProcessJobData:', error);
    return [];
  }
}

module.exports = { fetchAndProcessJobData };