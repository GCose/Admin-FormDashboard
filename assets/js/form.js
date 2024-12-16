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

/**==================
 * Sidebar Toggle
 ==================*/
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebar = document.getElementById('sidebar');
const sidebarClose = document.getElementById('sidebar-close');

sidebarToggle.addEventListener('click', () => {
    sidebar.classList.add('show-sidebar');
});

sidebarClose.addEventListener('click', () => {
    sidebar.classList.remove('show-sidebar');
});


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