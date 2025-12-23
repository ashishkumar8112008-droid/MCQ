// Answer key for CSE326 Unit-6 questions (correct answers)
const answerKey = {
    q1: 'A',  // Document Object Model
    q2: 'B',  // Tree structure
    q3: 'D',  // document
    q4: 'B',  // getElementById()
    q5: 'B',  // getElementsByClassName()
    q6: 'A',  // querySelector()
    q7: 'B',  // querySelectorAll()
    q8: 'C',  // innerHTML
    q9: 'D',  // Both B and C
    q10: 'C', // style
    q11: 'B', // element.style.color = "red";
    q12: 'C', // onclick
    q13: 'B', // onkeydown
    q14: 'A', // onmouseover
    q15: 'C', // onload
    q16: 'B', // classList
    q17: 'C', // addEventListener()
    q18: 'C', // removeEventListener()
    q19: 'B', // createElement()
    q20: 'C'  // appendChild()
};

// Timer configuration (20 minutes = 1200 seconds)
let totalTime = 1200; // 20 minutes in seconds (1 minute per question)
let timerInterval;
let isTestSubmitted = false;

// Initialize the test
document.addEventListener('DOMContentLoaded', function () {
    startTimer();
    setupSubmitButton();
});

// Start the countdown timer
function startTimer() {
    const timerElement = document.getElementById('timer');

    timerInterval = setInterval(function () {
        if (totalTime <= 0) {
            clearInterval(timerInterval);
            autoSubmitTest();
            return;
        }

        totalTime--;

        // Calculate minutes and seconds
        const minutes = Math.floor(totalTime / 60);
        const seconds = totalTime % 60;

        // Format the time display
        timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        // Add warning class when time is running out (last 5 minutes)
        if (totalTime <= 300) {
            timerElement.classList.add('warning');
        }

        // Change color to red in last minute
        if (totalTime <= 60) {
            timerElement.parentElement.style.background = 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)';
        }
    }, 1000);
}

// Setup submit button event listener
function setupSubmitButton() {
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.addEventListener('click', function () {
        if (!isTestSubmitted) {
            submitTest();
        }
    });
}

// Auto-submit when time runs out
function autoSubmitTest() {
    if (!isTestSubmitted) {
        alert('⏰ Time is up! Your test will be submitted automatically.');
        submitTest();
    }
}

// Submit the test and calculate results
function submitTest() {
    if (isTestSubmitted) {
        return;
    }

    isTestSubmitted = true;

    // Stop the timer
    clearInterval(timerInterval);

    // Disable submit button
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.6';
    submitBtn.innerHTML = '<span class="btn-text">Test Submitted</span> <span class="btn-icon">✓</span>';

    // Calculate results
    const results = calculateResults();

    // Highlight answers
    highlightAnswers();

    // Disable all radio buttons
    disableAllOptions();

    // Display results
    displayResults(results);

    // Scroll to results
    setTimeout(() => {
        document.getElementById('resultContainer').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 300);
}

// Calculate the test results
function calculateResults() {
    let correct = 0;
    let wrong = 0;
    let unattempted = 0;
    const totalQuestions = Object.keys(answerKey).length;

    // Loop through each question
    for (const [questionName, correctAnswer] of Object.entries(answerKey)) {
        const selectedOption = document.querySelector(`input[name="${questionName}"]:checked`);

        if (!selectedOption) {
            // Question not attempted
            unattempted++;
        } else if (selectedOption.value === correctAnswer) {
            // Correct answer
            correct++;
        } else {
            // Wrong answer
            wrong++;
        }
    }

    // Calculate final score
    // +1 for correct, -0.25 for wrong, 0 for unattempted
    const finalScore = (correct * 1) + (wrong * -0.25);

    return {
        totalQuestions,
        correct,
        wrong,
        unattempted,
        finalScore: finalScore.toFixed(2)
    };
}

// Highlight correct and wrong answers
function highlightAnswers() {
    for (const [questionName, correctAnswer] of Object.entries(answerKey)) {
        const allOptions = document.querySelectorAll(`input[name="${questionName}"]`);
        const selectedOption = document.querySelector(`input[name="${questionName}"]:checked`);

        allOptions.forEach(option => {
            const optionLabel = option.closest('.option');

            // Highlight correct answer in green
            if (option.value === correctAnswer) {
                optionLabel.classList.add('correct');
            }

            // Highlight wrong selected answer in red
            if (selectedOption && option === selectedOption && option.value !== correctAnswer) {
                optionLabel.classList.add('wrong');
            }
        });
    }
}

// Disable all radio buttons after submission
function disableAllOptions() {
    const allRadioButtons = document.querySelectorAll('input[type="radio"]');
    allRadioButtons.forEach(radio => {
        radio.disabled = true;
    });

    const allOptions = document.querySelectorAll('.option');
    allOptions.forEach(option => {
        option.classList.add('disabled');
        option.style.cursor = 'not-allowed';
    });
}

// Display the results
function displayResults(results) {
    // Update result values
    document.getElementById('totalQuestions').textContent = results.totalQuestions;
    document.getElementById('correctAnswers').textContent = results.correct;
    document.getElementById('wrongAnswers').textContent = results.wrong;
    document.getElementById('unattemptedQuestions').textContent = results.unattempted;
    document.getElementById('finalScore').textContent = results.finalScore;

    // Show result container with animation
    const resultContainer = document.getElementById('resultContainer');
    resultContainer.style.display = 'block';
}

// Optional: Add keyboard shortcut to submit (Ctrl + Enter)
document.addEventListener('keydown', function (event) {
    if (event.ctrlKey && event.key === 'Enter' && !isTestSubmitted) {
        submitTest();
    }
});

// Optional: Prevent accidental page refresh during test
window.addEventListener('beforeunload', function (event) {
    if (!isTestSubmitted) {
        event.preventDefault();
        event.returnValue = '';
        return '';
    }
});
