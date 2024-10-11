const inputContainer = document.getElementById("input-container");
const countdownForm = document.getElementById("countdownForm");
const dateEl = document.getElementById("date-picker");

const countdownEl = document.getElementById('countdown');
const countdownElTitle = document.getElementById('countdown-title');
const countdownBtn = document.getElementById('countdown-button');
const timeElements = document.querySelectorAll('span');

const compoleteEl = document.getElementById('complete');
const compoleteElInfo = document.getElementById('complete-info');
const compoleteBtn = document.getElementById('complete-button');

let countdownTitle = '';
let countdownDate = '';
let countdownValue = Date;
let countdownActive;
let savedCountdown;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

function getToday() {
  // Receive current date and time
  const now = new Date();
  // Retrieve time zone offset in minutes and convert to milliseconds
  const timezoneOffsetInMs = now.getTimezoneOffset() * 60 * 1000;
  // Correct local time by applying the offset to the current date
  const localDate = new Date(now.getTime() - timezoneOffsetInMs);
  // Return local date
  return localDate;
}

// Set Date Input Min & Value with Today's Date
const today = getToday().toISOString().split("T")[0];
dateEl.setAttribute("min", today);

// Populate Countdown / Complete UI
function updateDOM() {
  countdownActive = setInterval(() => {
    const now = new Date().getTime();
    const distance = countdownValue - now;
    const days = Math.floor(distance / day);
    const hours = Math.floor((distance % day) / hour);
    const minutes = Math.floor((distance % hour) / minute);
    const seconds = Math.floor((distance % minute) / second);
    // Hide Input
    inputContainer.hidden = true;
    // If the countdown has ended, show complete
    if (distance < 0) {
      countdownEl.hidden = true;
      clearInterval(countdownActive);
      compoleteElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
      compoleteEl.hidden = false;
    } else {
      // Else, show the countdown in progress
      countdownElTitle.textContent = `${countdownTitle}`;
      timeElements[0].textContent = `${days}`;
      timeElements[1].textContent = `${hours}`;
      timeElements[2].textContent = `${minutes}`;
      timeElements[3].textContent = `${seconds}`;
      compoleteEl.hidden = true;
      countdownEl.hidden = false;
    }
  }, second);
}

// Take Values from Form Input
function updateCountdown(e) {
  e.preventDefault();
  // Set title and date, save to local storage
  countdownTitle = e.srcElement[0].value;
  countdownDate = e.srcElement[1].value;
  savedCountdown = {
    title: countdownTitle,
    date: countdownDate,
  };
  localStorage.setItem('countdown', JSON.stringify(savedCountdown));
  // Check for valid date
  if (countdownDate === '') {
    alert('Please select a date for the countdown.');
  } else {
    // Get number version of current Date, updateDOM
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
  }
}

// Reset All Values
function reset() {
  // Hide countdown, show input
  countdownEl.hidden = true;
  compoleteEl.hidden = true;
  inputContainer.hidden = false;
  // Stop the countdown
  clearInterval(countdownActive);
  // Reset values, remove localStorage item
  countdownTitle = '';
  countdownDate = '';
  localStorage.removeItem('countdown');
}

function restorePreviousCountdown() {
  // Get countdown from localStorage if available
  if (localStorage.getItem('countdown')) {
    inputContainer.hidden = true;
    savedCountdown = JSON.parse(localStorage.getItem('countdown'));
    countdownTitle = savedCountdown.title;
    countdownDate = savedCountdown.date;
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
  }
}

// Event Listener
countdownForm.addEventListener("submit", updateCountdown);
countdownBtn.addEventListener("click", reset);
compoleteBtn.addEventListener("click", reset);

// On Load, check localStorage
restorePreviousCountdown();