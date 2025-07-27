document.addEventListener('DOMContentLoaded', function() {
    const alertForm = document.getElementById('alertForm');
    const myAlertsCard = document.getElementById('myAlertsCard');
    const loginPrompt = document.getElementById('loginPrompt');
    const alertsList = document.getElementById('alertsList');
    
    // For demo purposes, show the alerts section
    // In a real app, this would depend on authentication status
    myAlertsCard.style.display = 'block';
    
    // Handle form submission
    alertForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const email = document.getElementById('email').value;
        const jobTitle = document.getElementById('jobTitle').value;
        const location = document.getElementById('location').value;
        const company = document.getElementById('company').value;
        const minSalary = document.getElementById('minSalary').value;
        const skills = document.getElementById('skills').value.split(',').map(skill => skill.trim()).filter(Boolean);
        const frequency = document.querySelector('input[name="frequency"]:checked').value;
        
        // Create alert criteria object
        const alertData = {
            email,
            criteria: {
                title: jobTitle,
                location,
                company,
                minSalary: minSalary ? parseInt(minSalary) : null,
                skills
            },
            frequency
        };
        
        // In a real app, this would send the data to your API
        console.log('Creating job alert:', alertData);
        
        // Simulate API call
        createJobAlert(alertData)
            .then(response => {
                if (response.success) {
                    // Show success message
                    showNotification('Job alert created successfully!', 'success');
                    alertForm.reset();
                    
                    // In a real app, you would refresh the alerts list
                    // fetchUserAlerts();
                } else {
                    showNotification('Failed to create job alert. Please try again.', 'danger');
                }
            })
            .catch(error => {
                showNotification('An error occurred. Please try again later.', 'danger');
                console.error('Error creating job alert:', error);
            });
    });
    
    // Simulate API call to create job alert
    function createJobAlert(alertData) {
        // In a real app, this would be an actual API call
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simulate successful response
                resolve({ success: true, data: { id: 'alert-' + Date.now(), ...alertData } });
            }, 1000);
        });
    }
    
    // Function to show notification
    function showNotification(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        // Insert at the top of the form
        alertForm.parentNode.insertBefore(alertDiv, alertForm);
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            alertDiv.classList.remove('show');
            setTimeout(() => alertDiv.remove(), 300);
        }, 5000);
    }
    
    // Function to fetch and display user's alerts
    // In a real app, this would fetch from your API
    function fetchUserAlerts() {
        // Simulate authenticated user
        const isAuthenticated = false;
        
        if (isAuthenticated) {
            loginPrompt.style.display = 'none';
            alertsList.style.display = 'block';
            
            // Simulate API call to get user's alerts
            // In a real app, this would be an actual API call
            const mockAlerts = [
                {
                    id: 'alert-1',
                    criteria: {
                        title: 'Frontend Developer',
                        location: 'New York',
                        skills: ['JavaScript', 'React']
                    },
                    frequency: 'daily',
                    createdAt: '2023-06-15T10:30:00Z'
                },
                {
                    id: 'alert-2',
                    criteria: {
                        title: 'Data Scientist',
                        location: 'Remote',
                        minSalary: 100000,
                        skills: ['Python', 'Machine Learning']
                    },
                    frequency: 'weekly',
                    createdAt: '2023-06-10T14:45:00Z'
                }
            ];
            
            // Render alerts
            renderAlerts(mockAlerts);
        } else {
            loginPrompt.style.display = 'block';
            alertsList.style.display = 'none';
        }
    }
    
    // Function to render alerts in the UI
    function renderAlerts(alerts) {
        alertsList.innerHTML = '';
        
        if (alerts.length === 0) {
            alertsList.innerHTML = '<p>You have no job alerts set up yet.</p>';
            return;
        }
        
        alerts.forEach(alert => {
            const alertItem = document.createElement('div');
            alertItem.className = 'card mb-3';
            alertItem.innerHTML = `
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h5 class="card-title mb-0">${alert.criteria.title || 'Any Job'}</h5>
                        <span class="badge bg-primary">${alert.frequency}</span>
                    </div>
                    <p class="card-text">
                        <strong>Location:</strong> ${alert.criteria.location || 'Any'}<br>
                        ${alert.criteria.minSalary ? `<strong>Min Salary:</strong> $${alert.criteria.minSalary}<br>` : ''}
                        ${alert.criteria.skills && alert.criteria.skills.length ? 
                            `<strong>Skills:</strong> ${alert.criteria.skills.join(', ')}<br>` : ''}
                        <small class="text-muted">Created on ${new Date(alert.createdAt).toLocaleDateString()}</small>
                    </p>
                    <div class="d-flex justify-content-end">
                        <button class="btn btn-sm btn-outline-primary me-2" data-alert-id="${alert.id}">Edit</button>
                        <button class="btn btn-sm btn-outline-danger" data-alert-id="${alert.id}">Delete</button>
                    </div>
                </div>
            `;
            
            alertsList.appendChild(alertItem);
        });
        
        // Add event listeners for edit and delete buttons
        document.querySelectorAll('[data-alert-id]').forEach(button => {
            button.addEventListener('click', function() {
                const alertId = this.getAttribute('data-alert-id');
                if (this.classList.contains('btn-outline-danger')) {
                    deleteAlert(alertId);
                } else {
                    editAlert(alertId);
                }
            });
        });
    }
    
    // Function to delete an alert
    function deleteAlert(alertId) {
        // In a real app, this would call your API
        console.log('Deleting alert:', alertId);
        
        // Show confirmation dialog
        if (confirm('Are you sure you want to delete this job alert?')) {
            // Simulate API call
            setTimeout(() => {
                showNotification('Job alert deleted successfully!', 'success');
                // Refresh the alerts list
                fetchUserAlerts();
            }, 500);
        }
    }
    
    // Function to edit an alert
    function editAlert(alertId) {
        // In a real app, this would populate the form with the alert data
        console.log('Editing alert:', alertId);
        
        // Scroll to the form
        alertForm.scrollIntoView({ behavior: 'smooth' });
        
        // In a real app, you would fetch the alert data and populate the form
    }
    
    // Initialize the page
    fetchUserAlerts();
});