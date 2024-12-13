/**=================
 * Theme Toggling
 =================*/
const themeToggle = document.getElementById('theme-toggle');

function setTheme(theme) {
    document.body.classList.toggle('dark-mode', theme === 'dark');
    themeToggle.checked = theme === 'dark';
    localStorage.setItem('theme', theme);
    updateCharts();
}

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
});

themeToggle.addEventListener('change', () => {
    const newTheme = themeToggle.checked ? 'dark' : 'light';
    setTheme(newTheme);
});

const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebar = document.getElementById('sidebar');
const sidebarClose = document.getElementById('sidebar-close');

sidebarToggle.addEventListener('click', () => {
    sidebar.classList.add('show-sidebar');
});

sidebarClose.addEventListener('click', () => {
    sidebar.classList.remove('show-sidebar');
});

/**=========================
 * Project Overview Chart
 =========================*/
const projectCtx = document.getElementById('projectChart');
const projectChart = new Chart(projectCtx, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Project Progress',
            data: [30, 45, 57, 60, 75, 90],
            borderColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color'),
            tension: 0.6,
            fill: false
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                max: 100
            }
        }
    }
});

/**=========================
 * Activity Overview Chart
 =========================*/
const activityCtx = document.getElementById('activityChart');
const activityChart = new Chart(activityCtx, {
    type: 'bar',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Activity Progress',
            data: [30, 45, 57, 60, 75, 90],
            backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color'),
            borderWidth: 2
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                title: {
                    display: true,
                    text: 'Progress (%)'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Months'
                }
            }
        },
        plugins: {
            legend: {
                display: true,
                position: 'top'
            }
        }
    }
});

/**=========================
 * Resource Usage Chart
 =========================*/
const cpuCtx = document.getElementById('cpuChart').getContext('2d');
const memoryCtx = document.getElementById('memoryChart').getContext('2d');
const diskCtx = document.getElementById('diskChart').getContext('2d');

const createDoughnutChart = (ctx, data, label) => {
    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Used', 'Available'],
            datasets: [{
                data: data,
                backgroundColor: [
                    getComputedStyle(document.documentElement).getPropertyValue('--primary-color'),
                    getComputedStyle(document.documentElement).getPropertyValue('--border-color')
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            cutout: '70%',
            aspectRatio: 1,
            layout: {
                padding: 0
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `${context.label}: ${context.raw}%`;
                        }
                    }
                }
            }
        }
    });
};

let cpuChart = createDoughnutChart(cpuCtx, [65, 35], 'CPU Usage');
let memoryChart = createDoughnutChart(memoryCtx, [80, 20], 'Memory Usage');
let diskChart = createDoughnutChart(diskCtx, [50, 50], 'Disk Usage');

/**===============
 * Update Chart
 ===============*/
function updateCharts() {
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
    const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary-color');
    const borderColor = getComputedStyle(document.documentElement).getPropertyValue('--border-color');

    projectChart.data.datasets[0].borderColor = primaryColor;
    projectChart.update();

    activityChart.data.datasets[0].backgroundColor = primaryColor;
    activityChart.data.datasets[0].borderColor = secondaryColor;
    activityChart.update();

    [cpuChart, memoryChart, diskChart].forEach(chart => {
        chart.data.datasets[0].backgroundColor = [primaryColor, borderColor];
        chart.update();
    });
}

/**==================
 * Task Management
 ==================*/
const taskList = document.getElementById('taskList');
const addTaskBtn = document.getElementById('addTaskBtn');

addTaskBtn.addEventListener('click', () => {
    const taskName = prompt('Enter task name:');
    if (taskName) {
        const li = document.createElement('li');
        li.innerHTML = `
                <span class="task-name">${taskName}</span>
                <span class="task-status pending">Pending</span>
            `;
        taskList.appendChild(li);
        updateTaskCount();
    }
});

taskList.addEventListener('click', (e) => {
    if (e.target.classList.contains('task-status')) {
        const statuses = ['pending', 'in-progress', 'completed'];
        let currentIndex = statuses.indexOf(e.target.classList[1]);
        let nextIndex = (currentIndex + 1) % statuses.length;

        e.target.classList.remove(statuses[currentIndex]);
        e.target.classList.add(statuses[nextIndex]);
        e.target.textContent = statuses[nextIndex].replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());

        updateTaskCount();
    }
});

function updateTaskCount() {
    const completedTasks = taskList.querySelectorAll('.task-status.completed').length;
    document.querySelector('.project-stats .stat-value').textContent = completedTasks;
}

/**=================
 * Activity Feed
 =================*/
const activityFeed = document.getElementById('activityFeed');
const loadMoreActivity = document.getElementById('loadMoreActivity');

const activities = [
    { name: 'David', action: 'updated the project roadmap', time: '30 minutes ago' },
    { name: 'Emma', action: 'submitted a new design proposal', time: '1 hour ago' },
    { name: 'Frank', action: 'resolved 3 high-priority bugs', time: '2 hours ago' },
    { name: 'Grace', action: 'scheduled a team meeting for next week', time: '3 hours ago' },
    { name: 'Henry', action: 'deployed the latest features to production', time: '4 hours ago' }
];

let activityIndex = 0;

function addActivityItem(activity) {
    const div = document.createElement('div');
    div.className = 'activity-item';
    div.innerHTML = `
            <img src="https://i.pravatar.cc/100?img=${Math.floor(Math.random() * 70)}" alt="${activity.name}" class="activity-avatar">
            <div class="activity-content">
                <p><strong>${activity.name}</strong> ${activity.action}</p>
                <span class="activity-time">${activity.time}</span>
            </div>
        `;
    activityFeed.appendChild(div);
}

loadMoreActivity.addEventListener('click', () => {
    for (let i = 0; i < 3 && activityIndex < activities.length; i++) {
        addActivityItem(activities[activityIndex]);
        activityIndex++;
    }
    if (activityIndex >= activities.length) {
        loadMoreActivity.style.display = 'none';
    }
});

/**===============================
 * Simulating Real Time Updates
 ===============================*/
setInterval(() => {
    // Update project progress
    const newProgress = Math.min(100, projectChart.data.datasets[0].data[5] + Math.random() * 5);
    projectChart.data.datasets[0].data[5] = newProgress;
    projectChart.update();

    // Update resource usage
    [cpuChart, memoryChart, diskChart].forEach(chart => {
        const newUsage = Math.min(100, chart.data.datasets[0].data[0] + (Math.random() - 0.5) * 10);
        chart.data.datasets[0].data = [newUsage, 100 - newUsage];
        chart.update();
    });

    // Update project stats
    document.querySelectorAll('.project-stats .stat-value').forEach(stat => {
        const currentValue = parseInt(stat.textContent);
        const newValue = Math.max(0, currentValue + Math.floor((Math.random() - 0.3) * 5));
        stat.textContent = newValue;
    });

    // Update deadline progress
    document.querySelectorAll('.deadline-progress .progress-bar').forEach(bar => {
        const currentWidth = parseInt(bar.style.width) || 0;
        const newWidth = Math.min(100, currentWidth + Math.random() * 5);
        bar.style.width = `${newWidth}%`;
    });
}, 5000);

/**===================
 * Form Navigation
 ===================*/
function nextPage() {
    if (validatePage1()) {
        document.getElementById('page1').style.display = 'none';
        document.getElementById('page2').style.display = 'block';
    }
}

function previousPage() {
    document.getElementById('page2').style.display = 'none';
    document.getElementById('page1').style.display = 'block';
}

/**=========================
 * Form-Page 1 Validation
 =========================*/
function validatePage1() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const country = document.getElementById('country').value;
    const gender = document.querySelector('input[name="gender"]:checked');

    if (!name || !email || !country || !gender) {
        alert('Please fill in all fields');
        return false;
    }

    if (!isValidEmail(email)) {
        alert('Please enter a valid email address');
        return false;
    }

    return true;
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

document.getElementById('userForm').addEventListener('submit', function (e) {
    e.preventDefault();
    if (validatePage2()) {
        const formData = new FormData(this);
        const submittedData = {};
        for (let [key, value] of formData.entries()) {
            submittedData[key] = value;
        }
        displaySubmittedData(submittedData);
    }
});

/**=========================
 * Form-Page 2 Validation
 =========================*/
function validatePage2() {
    const disability = document.querySelector('input[name="disability"]:checked');
    if (!disability) {
        alert('Please select whether you have a disability or medical condition');
        return false;
    }

    if (disability.value === 'yes') {
        const medicalCondition = document.getElementById('medical-condition').value;
        if (!medicalCondition) {
            alert('Please specify your disability or medical condition');
            return false;
        }
    }

    return true;
}

/**=========================
 * Display Form Details
 =========================*/
function displaySubmittedData(data) {
    const resultDiv = document.getElementById('submittedData');
    const formResultSection = document.getElementById('formResult');
    const userForm = document.getElementById('userForm');

    // Clear previous results
    resultDiv.innerHTML = '';

    // Populate submitted data
    for (let key in data) {
        if (key !== 'medical-condition' || data['disability'] === 'yes') {
            const p = document.createElement('p');
            p.innerHTML = `<strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${data[key]}`;
            resultDiv.appendChild(p);
        }
    }

    // Hide form
    userForm.style.display = 'none';

    // Show results overlay with important display properties
    formResultSection.style.display = 'flex';
    formResultSection.style.visibility = 'visible';
    formResultSection.style.opacity = '1';
}

/**====================
 * Close Form Result
 ====================*/
function closeFormResult() {
    const formResultSection = document.getElementById('formResult');
    const userForm = document.getElementById('userForm');

    // Hide result overlay
    formResultSection.style.display = 'none';

    // Reset form
    userForm.style.display = 'block';
    userForm.reset(); // Reset form fields

    // Reset to first page
    document.getElementById('page1').style.display = 'block';
    document.getElementById('page2').style.display = 'none';
}

// Show/hide medical condition textarea based on disability selection
document.querySelectorAll('input[name="disability"]').forEach(radio => {
    radio.addEventListener('change', function () {
        const medicalConditionGroup = document.getElementById('medical-condition-group');
        if (this.value === 'yes') {
            medicalConditionGroup.style.display = 'block';
        } else {
            medicalConditionGroup.style.display = 'none';
        }
    });
});