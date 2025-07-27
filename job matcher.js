// app.js
document.addEventListener('DOMContentLoaded', function() {
    // Fetch the job data
    fetch('data/jobs_data.json')
        .then(response => response.json())
        .then(data => {
            // Store the original data
            window.originalData = data;
            // Initialize the dashboard
            initializeDashboard(data);
            // Populate filter options
            populateFilterOptions(data);
        })
        .catch(error => console.error('Error loading data:', error));

    // Event listener for filter button
    document.getElementById('applyFilters').addEventListener('click', function() {
        applyFilters();
    });
});

function initializeDashboard(data) {
    createJobTrendChart(data);
    createSalaryChart(data);
    createSkillsChart(data);
    createLocationChart(data);
}

function createJobTrendChart(data) {
    // Group data by date
    const dateGroups = {};
    data.forEach(job => {
        const date = job.date_posted.split('T')[0];
        if (!dateGroups[date]) {
            dateGroups[date] = 0;
        }
        dateGroups[date]++;
    });

    const dates = Object.keys(dateGroups).sort();
    const counts = dates.map(date => dateGroups[date]);

    const trace = {
        x: dates,
        y: counts,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Job Postings',
        line: { color: '#17A2B8' }
    };

    const layout = {
        autosize: true,
        margin: { l: 50, r: 20, b: 50, t: 20, pad: 4 },
        xaxis: { title: 'Date' },
        yaxis: { title: 'Number of Postings' }
    };

    Plotly.newPlot('jobTrendChart', [trace], layout, {responsive: true});
}

function createSalaryChart(data) {
    // Filter out jobs without salary info
    const jobsWithSalary = data.filter(job => job.salary_normalized);
    
    const trace = {
        x: jobsWithSalary.map(job => job.salary_normalized),
        type: 'histogram',
        marker: { color: '#28A745' }
    };

    const layout = {
        autosize: true,
        margin: { l: 50, r: 20, b: 50, t: 20, pad: 4 },
        xaxis: { title: 'Annual Salary ($)' },
        yaxis: { title: 'Count' }
    };

    Plotly.newPlot('salaryChart', [trace], layout, {responsive: true});
}

function createSkillsChart(data) {
    // Count skills frequency
    const skillsCount = {};
    data.forEach(job => {
        if (job.skills) {
            job.skills.forEach(skill => {
                if (!skillsCount[skill]) {
                    skillsCount[skill] = 0;
                }
                skillsCount[skill]++;
            });
        }
    });

    // Sort and take top 10
    const sortedSkills = Object.entries(skillsCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    const trace = {
        x: sortedSkills.map(item => item[0]),
        y: sortedSkills.map(item => item[1]),
        type: 'bar',
        marker: { color: '#FFC107' }
    };

    const layout = {
        autosize: true,
        margin: { l: 50, r: 20, b: 80, t: 20, pad: 4 },
        xaxis: { 
            title: 'Skills',
            tickangle: -45
        },
        yaxis: { title: 'Demand (Count)' }
    };

    Plotly.newPlot('skillsChart', [trace], layout, {responsive: true});
}

function createLocationChart(data) {
    // Count jobs by location
    const locationCount = {};
    data.forEach(job => {
        if (job.location) {
            if (!locationCount[job.location]) {
                locationCount[job.location] = 0;
            }
            locationCount[job.location]++;
        }
    });

    // Sort and take top 10
    const sortedLocations = Object.entries(locationCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    const trace = {
        labels: sortedLocations.map(item => item[0]),
        values: sortedLocations.map(item => item[1]),
        type: 'pie',
        marker: {
            colors: ['#007BFF', '#6610F2', '#6F42C1', '#E83E8C', '#DC3545', 
                    '#FD7E14', '#FFC107', '#28A745', '#20C997', '#17A2B8']
        }
    };

    const layout = {
        autosize: true,
        margin: { l: 20, r: 20, b: 20, t: 20, pad: 4 }
    };

    Plotly.newPlot('locationChart', [trace], layout, {responsive: true});
}

function populateFilterOptions(data) {
    // Get unique values for each filter
    const roles = [...new Set(data.map(job => job.title))];
    const locations = [...new Set(data.map(job => job.location))];
    const companies = [...new Set(data.map(job => job.company))];
    
    // Populate role filter
    const roleFilter = document.getElementById('roleFilter');
    roles.forEach(role => {
        const option = document.createElement('option');
        option.value = role;
        option.textContent = role;
        roleFilter.appendChild(option);
    });
    
    // Populate location filter
    const locationFilter = document.getElementById('locationFilter');
    locations.forEach(location => {
        const option = document.createElement('option');
        option.value = location;
        option.textContent = location;
        locationFilter.appendChild(option);
    });
    
    // Populate company filter
    const companyFilter = document.getElementById('companyFilter');
    companies.forEach(company => {
        const option = document.createElement('option');
        option.value = company;
        option.textContent = company;
        companyFilter.appendChild(option);
    });
}

function applyFilters() {
    const roleFilter = document.getElementById('roleFilter').value;
    const locationFilter = document.getElementById('locationFilter').value;
    const companyFilter = document.getElementById('companyFilter').value;
    
    let filteredData = window.originalData;
    
    // Apply role filter
    if (roleFilter !== 'all') {
        filteredData = filteredData.filter(job => job.title === roleFilter);
    }
    
    // Apply location filter
    if (locationFilter !== 'all') {
        filteredData = filteredData.filter(job => job.location === locationFilter);
    }
    
    // Apply company filter
    if (companyFilter !== 'all') {
        filteredData = filteredData.filter(job => job.company === companyFilter);
    }
    
    // Update charts with filtered data
    initializeDashboard(filteredData);
}