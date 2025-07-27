const nodemailer = require('nodemailer');

// Create a test transporter using Mailtrap
const transporter = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: 'your_mailtrap_user', // Replace with your Mailtrap credentials
    pass: 'your_mailtrap_password'
  }
});

// Sample job data for testing
const testJobs = [
  {
    id: 'job-1',
    title: 'Senior Frontend Developer',
    company: 'Tech Innovations Inc.',
    location: 'New York, NY',
    salary: '120,000 - 150,000',
    skills: ['JavaScript', 'React', 'TypeScript', 'CSS'],
    datePosted: '2023-06-20',
    url: 'https://example.com/jobs/senior-frontend-developer'
  },
  {
    id: 'job-2',
    title: 'Data Scientist',
    company: 'Analytics Pro',
    location: 'Remote',
    salary: '110,000 - 140,000',
    skills: ['Python', 'Machine Learning', 'SQL', 'Data Visualization'],
    datePosted: '2023-06-19',
    url: 'https://example.com/jobs/data-scientist'
  }
];

// Sample user data
const testUser = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  alertId: 'alert-123'
};

// Function to send a test email
async function sendTestEmail() {
  // Create HTML content for the email
  // This is a simplified version - in production you'd use a template engine
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #0d6efd; color: white; padding: 20px; text-align: center;">
        <h1>New Job Matches Found!</h1>
        <p>We found ${testJobs.length} new job(s) matching your criteria</p>
      </div>
      
      <div style="padding: 20px;">
        <p>Hello ${testUser.name},</p>
        
        <p>Based on your job alert preferences, we've found the following new job postings that match your criteria:</p>
        
        ${testJobs.map(job => `
          <div style="border-left: 4px solid #0d6efd; background-color: #f8f9fa; padding: 15px; margin-bottom: 15px;">
            <h2 style="color: #0d6efd; margin-top: 0;">${job.title}</h2>
            <div style="font-weight: bold;">${job.company}</div>
            <div style="color: #666;">${job.location}</div>
            <div style="color: #28a745;">${job.salary}</div>
            <div>
              ${job.skills.map(skill => `
                <span style="display: inline-block; background-color: #e9ecef; padding: 3px 8px; border-radius: 4px; margin-right: 5px; font-size: 12px;">${skill}</span>
              `).join('')}
            </div>
            <div>Posted: ${job.datePosted}</div>
            <a href="${job.url}" style="display: inline-block; background-color: #0d6efd; color: white; text-decoration: none; padding: 10px 20px; border-radius: 4px; margin-top: 10px;">View Job</a>
          </div>
        `).join('')}
        
        <p>Visit your <a href="https://yourjobportal.com/dashboard">dashboard</a> to see more job matches and customize your alert preferences.</p>
      </div>
      
      <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
        <p>This email was sent to ${testUser.email} because you subscribed to job alerts from Job Analytics Portal.</p>
        <p>To update your preferences or unsubscribe, <a href="https://yourjobportal.com/alerts/settings?id=${testUser.alertId}" style="color: #999; text-decoration: underline;">click here</a>.</p>
        <p>&copy; 2023 Job Analytics Portal. All rights reserved.</p>
      </div>
    </div>
  `;

  // Configure email options
  const mailOptions = {
    from: '"Job Portal Alerts" <alerts@yourjobportal.com>',
    to: testUser.email,
    subject: `${testJobs.length} New Job Matches Found - Job Portal Alert`,
    html: htmlContent
  };

  // Send the email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Test email sent: ${info.messageId}`);
    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`Error sending test email:`, error);
    return { success: false, error: error.message };
  }
}

// Run the test
sendTestEmail()
  .then(result => {
    if (result.success) {
      console.log('Test completed successfully!');
    } else {
      console.error('Test failed:', result.error);
    }
  });