import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let selectedDate = null;
let userSelectedDate = null;
const startButton = document.querySelector('[data-start]');
const input = document.querySelector('#datetime-picker');
const daysSpan = document.querySelector('[data-days]');
const hoursSpan = document.querySelector('[data-hours]');
const minutesSpan = document.querySelector('[data-minutes]');
const secondsSpan = document.querySelector('[data-seconds]');
startButton.disabled = true;

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function updateTimer(ms) {
  const { days, hours, minutes, seconds } = convertMs(ms);
  daysSpan.textContent = addLeadingZero(days);
  hoursSpan.textContent = addLeadingZero(hours);
  minutesSpan.textContent = addLeadingZero(minutes);
  secondsSpan.textContent = addLeadingZero(seconds);
}

flatpickr(input, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const now = new Date();
    userSelectedDate = selectedDates[0];

    if (userSelectedDate <= now) {
      iziToast.warning({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      startButton.disabled = true;
    } else {
      selectedDate = userSelectedDate;
      startButton.disabled = false;
    }
  },
});

let timeInterval = null;

startButton.addEventListener('click', () => {
  if (!selectedDate) return;

  startButton.disabled = true;
  input.disabled = true;

  timeInterval = setInterval(() => {
    const now = new Date();
    const difference = userSelectedDate - now;
    if (difference <= 0) {
      clearInterval(timeInterval);
      updateTimer(0);
      startButton.disabled = false;
      input.disabled = false;
      iziToast.success({
        title: 'Success',
        message: 'Time is up',
        position: 'topRight',
      });
      return;
    }

    updateTimer(difference);
  }, 1000);
});
