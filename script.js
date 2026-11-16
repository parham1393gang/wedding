
const config = weddingConfig;

const $ = (id) => document.getElementById(id);

// نمایش اسامی
$('groomName').textContent = config.groom;
$('brideName').textContent = config.bride;

$('messageGroom').textContent = config.groom;
$('messageBride').textContent = config.bride;

$('footerNames').textContent =
  `${config.groom} & ${config.bride}`;

// نمایش تاریخ
function updateEventDetails() {
  const dateElement = $('eventDate');
  const venueElement = $('eventVenue');

  dateElement.textContent = config.date
    ? new Date(config.date).toLocaleString('fa-IR', {
        dateStyle: 'long',
        timeStyle: 'short'
      })
    : 'به‌زودی اعلام می‌شود';

  venueElement.textContent =
    config.venue || 'به‌زودی اعلام می‌شود';

  if (config.mapUrl) {
    const map = $('mapLink');
    map.href = config.mapUrl;
    map.hidden = false;
  }
}

updateEventDetails();

// Opening
$('openBtn').addEventListener('click', () => {
  $('intro').classList.add('hidden');
  $('main').classList.add('visible');
});

// Countdown
let countdownTimer;

function updateCountdown() {
  const container = $('countdown');

  if (!config.date) {
    container.textContent =
      'تاریخ مراسم به‌زودی اعلام می‌شود 🌸';
    return;
  }

  const target = new Date(config.date).getTime();

  if (Number.isNaN(target)) {
    container.textContent = 'تاریخ مراسم هنوز تنظیم نشده است.';
    return;
  }

  const distance = target - Date.now();

  if (distance <= 0) {
    container.textContent = 'امروز روز زیبای ماست! 🌸';
    clearInterval(countdownTimer);
    return;
  }

  const days = Math.floor(distance / 86400000);
  const hours = Math.floor((distance % 86400000) / 3600000);
  const minutes = Math.floor((distance % 3600000) / 60000);
  const seconds = Math.floor((distance % 60000) / 1000);

  container.innerHTML = `
    <div class="countdown-grid">
      <div class="time-box">
        <strong>${days}</strong>
        <span>روز</span>
      </div>
      <div class="time-box">
        <strong>${hours}</strong>
        <span>ساعت</span>
      </div>
      <div class="time-box">
        <strong>${minutes}</strong>
        <span>دقیقه</span>
      </div>
      <div class="time-box">
        <strong>${seconds}</strong>
        <span>ثانیه</span>
      </div>
    </div>
  `;
}

updateCountdown();
countdownTimer = setInterval(updateCountdown, 1000);

// Music
const music = $('music');
const musicButton = $('musicButton');

if (config.musicUrl) {
  music.src = config.musicUrl;
} else {
  musicButton.hidden = true;
}

musicButton.addEventListener('click', async () => {
  try {
    if (music.paused) {
      await music.play();
      musicButton.textContent = '♫';
    } else {
      music.pause();
      musicButton.textContent = '♪';
    }
  } catch {
    musicButton.textContent = '♪';
  }
});

// RSVP
$('rsvpForm').addEventListener('submit', (event) => {
  event.preventDefault();

  const name = $('guestName').value.trim();
  const attendance = $('attendance').value;

  if (!name || !attendance) return;

  const responses = JSON.parse(
    localStorage.getItem('weddingResponses') || '[]'
  );

  responses.push({
    name,
    attendance,
    date: new Date().toISOString()
  });

  localStorage.setItem(
    'weddingResponses',
    JSON.stringify(responses)
  );

  $('result').textContent =
    'پاسخ شما ثبت شد. از شما سپاسگزاریم 🌸';

  $('rsvpForm').reset();
});
