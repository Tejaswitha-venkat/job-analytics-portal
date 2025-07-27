document.addEventListener('DOMContentLoaded', function() {
    // Fetch job data
    fetchJobData();
    fetchStats();
});

async function fetchJobData() {
    try {
        const response = await fetch('/api/jobs');
        const jobs = await response.json();
        
        // Populate company filter
        populateCompanyFilter(jobs);
        
        // Display job listings
        displayJobListings(jobs);
        
        // Generate charts
        generateCompaniesChart(jobs);
        generateSkillsChart(jobs);
        
    } catch (error) {
        console.error('Error fetching job data:', error);
    }
}

async function fetchStats() {
    try {
        const response = await fetch('/api/stats');
        const stats = await response.json();
        
        // Update stats display
        document.getElementById('totalJobs').textContent = stats.totalJobs;
        document.getElementById('avgSalary').textContent = `$${Math.round(stats.avgSalary).toLocaleString()}`;
        document.getElementById('lastUpdated').textContent = `Last updated: ${new Date(stats.lastUpdated).toLocaleString()}`;
        
    } catch (error) {
        console.error('Error fetching stats:', error);
    }
}

function populateCompanyFilter(jobs) {
    const companyFilter = document.getElementById('companyFilter');
    
    // Get unique companies
    const companies = [...new Set(jobs.map(job => job.company))];
    companies.sort();
    
    // Add options to select
    companies.forEach(company => {
        const option = document.createElement('option');
        option.value = company;
        option.textContent = company;
        companyFilter.appendChild(option);
    });
    
    // Add event listener
    companyFilter.addEventListener('change', function() {
        filterJobs();
    });
}

function displayJobListings(jobs) {
    const jobListingsElement = document.getElementById('jobListings');
    jobListingsElement.innerHTML = '';
    
    // Store jobs globally for filtering
    window.allJobs = jobs;
    
    // Sort jobs by date (newest first)
    jobs.sort((a, b) => new Date(b.date_posted) - new Date(a.date_posted));
    
    jobs.forEach(job => {
        const row = document.createElement('tr');
        
        // Format the date
        const postedDate = new Date(job.date_posted);
        const formattedDate = postedDate.toLocaleDateString();
        
        row.innerHTML = `
            <td><strong class="job-title">${job.title}</strong></td>
            <td><span class="company-badge">${job.company}</span></td>
            <td>${job.location}</td>
            <td>$${job.salary_normalized.toLocaleString()}</td>
            <td>${formatSkills(job.skills)}</td>
            <td>${formattedDate}</td>
            <td><a href="${job.url}" target="_blank" class="btn btn-sm btn-primary">View</a></td>
        `;
        
        jobListingsElement.appendChild(row);
    });
    
    // Add search functionality
    const searchInput = document.getElementById('jobSearch');
    searchInput.addEventListener('input', function() {
        filterJobs();
    });
}

function filterJobs() {
    const searchTerm = document.getElementById('jobSearch').value.toLowerCase();
    const selectedCompany = document.getElementById('companyFilter').value;
    const jobListingsElement = document.getElementById('jobListings');
    const rows = jobListingsElement.querySelectorAll('tr');
    
    rows.forEach(row => {
        const jobTitle = row.querySelector('td:first-child').textContent.toLowerCase();
        const company = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
        const location = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
        
        const matchesSearch = jobTitle.includes(searchTerm) || 
                             company.includes(searchTerm) || 
                             location.includes(searchTerm);
                             
        const matchesCompany = !selectedCompany || company.includes(selectedCompany.toLowerCase());
        
        if (matchesSearch && matchesCompany) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function formatSkills(skills) {
    return skills.map(skill => `<span class="badge bg-secondary me-1">${skill}</span>`).join('');
}

function generateCompaniesChart(jobs) {
    // Count jobs by company
    const companyCounts = {};
    jobs.forEach(job => {
        companyCounts[job.company] = (companyCounts[job.company] || 0) + 1;
    });
    
    // Sort and get top 5 companies
    const topCompanies = Object.entries(companyCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    
    const labels = topCompanies.map(item => item[0]);
    const data = topCompanies.map(item => item[1]);
    
    // Create chart
    const ctx = document.getElementById('companiesChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of Jobs',
                data: data,
                backgroundColor: 'rgba(13, 110, 253, 0.7)',
                borderColor: 'rgba(13, 110, 253, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Top Companies by Job Listings'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            }
        }
    });
}

function generateSkillsChart(jobs) {
    // Count skills frequency
    const skillCounts = {};
    jobs.forEach(job => {
        job.skills.forEach(skill => {
            skillCounts[skill] = (skillCounts[skill] || 0) + 1;
        });
    });
    
    // Sort and get top skills
    const topSkills = Object.entries(skillCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    
    // Update top skill stat
    if (topSkills.length > 0) {
        document.getElementById('topSkill').textContent = topSkills[0][0];
    }
    
    const labels = topSkills.map(item => item[0]);
    const data = topSkills.map(item => item[1]);
    
    // Create chart
    const ctx = document.getElementById('skillsChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    'rgba(13, 110, 253, 0.7)',
                    'rgba(25, 135, 84, 0.7)',
                    'rgba(220, 53, 69, 0.7)',
                    'rgba(255, 193, 7, 0.7)',
                    'rgba(108, 117, 125, 0.7)'
                ],
                borderColor: [
                    'rgba(13, 110, 253, 1)',
                    'rgba(25, 135, 84, 1)',
                    'rgba(220, 53, 69, 1)',
                    'rgba(255, 193, 7, 1)',
                    'rgba(108, 117, 125, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right'
                },
                title: {
                    display: true,
                    text: 'Most In-Demand Skills'
                }
            }
        }
    });
}