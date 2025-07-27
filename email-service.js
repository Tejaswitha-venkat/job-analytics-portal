const nodemailer = require('nodemailer');

// Configure email transporter
// For production, use actual SMTP credentials
// For development, you can use services like Mailtrap or Ethereal
const transporter = nodemailer.createTransport({
  host: 'smtp.example.com', // Replace with your SMTP host
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'your_email@example.com', // Replace with your email
    password: 'your_password' // Replace with your password or app-specific password
  }
});

// Function to send job alert emails
const sendJobAlert = async (recipient, jobMatches) => {
  // Create HTML content for the email
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #0d6efd; color: white; padding: 20px; text-align: center;">
        <h1>New Job Matches Found!</h1>
        <p>We found ${jobMatches.length} new job(s) matching your criteria</p>
      </div>
      
      <div style="padding: 20px;">
        <p>Hello ${recipient.name || recipient.email},</p>
        
        <p>Based on your job alert preferences, we've found the following new job postings that match your criteria:</p>
        
        ${jobMatches.map(job => `
          <div style="border-left: 4px solid #0d6efd; background-color: #f8f9fa; padding: 15px; margin-bottom: 15px;">
            <h2 style="color: #0d6efd; margin-top: 0;">${job.title}</h2>
            <div style="font-weight: bold;">${job.company}</div>
            <div style="color: #666;">${job.location}</div>
            <div style="color: #28a745;">${job.salary_normalized ? `$${job.salary_normalized.toLocaleString()}` : ''}</div>
            <div>
              ${job.skills.map(skill => `
                <span style="display: inline-block; background-color: #e9ecef; padding: 3px 8px; border-radius: 4px; margin-right: 5px; font-size: 12px;">${skill}</span>
              `).join('')}
            </div>
            <div>Posted: ${new Date(job.date_posted).toLocaleDateString()}</div>
            <a href="${job.url}" style="display: inline-block; background-color: #0d6efd; color: white; text-decoration: none; padding: 10px 20px; border-radius: 4px; margin-top: 10px;">View Job</a>
          </div>
        `).join('')}
        
        <p>Visit your <a href="https://yourjobportal.com/dashboard">dashboard</a> to see more job matches and customize your alert preferences.</p>
      </div>
      
      <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
        <p>This email was sent to ${recipient.email} because you subscribed to job alerts from Job Analytics Portal.</p>
        <p>To update your preferences or unsubscribe, <a href="https://yourjobportal.com/alerts/settings?id=${recipient._id}" style="color: #999; text-decoration: underline;">click here</a>.</p>
        <p>&copy; ${new Date().getFullYear()} Job Analytics Portal. All rights reserved.</p>
      </div>
    </div>
  `;

  // Configure email options
  const mailOptions = {
    from: '"Job Portal Alerts" <alerts@yourjobportal.com>',
    to: recipient.email,
    subject: `${jobMatches.length} New Job Matches Found - Job Portal Alert`,
    html: htmlContent
  };

  // Send the email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${recipient.email}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`Error sending email to ${recipient.email}:`, error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendJobAlert };