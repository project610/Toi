document.documentElement.classList.add("js");

const CONFIG = {
  // Имя именинника / туған күн иесі.
  honoreeName: "әкеміздің",

  // Дата события для таймера. Формат: YYYY-MM-DDTHH:mm:ss+05:00.
  eventDate: "2026-05-23T16:00:00+05:00",

  // Дата, месяц, год и время, которые видит гость на сайте.
  dayText: "23 мамыр",
  calendarMonth: "Мамыр",
  calendarYear: "2026",
  calendarDay: "23",
  eventTimeText: "16:00",

  // Ресторан, город и адрес.
  restaurantName: "Tabys Hall",
  city: "Астана",
  address: "Ғабиден Мұстафин көшесі, 10/1",

  // Номер WhatsApp укажите без плюса, пробелов и скобок.
  whatsappNumber: "77755143241",

  // Готовый текст для WhatsApp. Выбранный вариант из сауалнамa добавится автоматически.
  whatsappText: "Сәлеметсіз бе! Әкеміздің 60 жас мерейтойына қатысты жауабым:",

  // Ссылка на карту.
  mapLink: "https://2gis.kz/astana/geo/70000001038898575"
};

const setText = (id, value) => {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value;
  }
};

setText("calendarMonth", CONFIG.calendarMonth);
setText("calendarYear", CONFIG.calendarYear);
setText("calendarDay", CONFIG.calendarDay);
setText("honoreeName", CONFIG.honoreeName);
setText("dayText", CONFIG.dayText);
setText("eventTimeText", CONFIG.eventTimeText);
setText("eventCity", CONFIG.city);
setText("eventAddress", CONFIG.address);
setText("restaurantName", CONFIG.restaurantName);

const whatsappNumber = CONFIG.whatsappNumber.replace(/\D/g, "");
const whatsappButton = document.getElementById("whatsappBtn");
const attendanceChoices = document.querySelectorAll("input[name='attendance']");
const inviteAudio = document.getElementById("inviteAudio");
const musicToggle = document.getElementById("musicToggle");
const musicLabel = musicToggle ? musicToggle.querySelector(".music-label") : null;

function setMusicState(isPlaying) {
  if (!musicToggle || !musicLabel) {
    return;
  }

  musicToggle.classList.toggle("is-playing", isPlaying);
  musicToggle.setAttribute("aria-pressed", String(isPlaying));
  musicLabel.textContent = isPlaying ? "Әуен тоқтату" : "Әуен қосу";
}

if (inviteAudio && musicToggle) {
  inviteAudio.volume = 0.65;

  musicToggle.addEventListener("click", async () => {
    if (inviteAudio.paused) {
      try {
        await inviteAudio.play();
        setMusicState(true);
      } catch (error) {
        setMusicState(false);
      }
    } else {
      inviteAudio.pause();
      setMusicState(false);
    }
  });

  inviteAudio.addEventListener("pause", () => setMusicState(false));
  inviteAudio.addEventListener("play", () => setMusicState(true));
}

function updateWhatsappLink() {
  if (!whatsappButton || !whatsappNumber) {
    return;
  }

  const selectedChoice = document.querySelector("input[name='attendance']:checked");
  const selectedText = selectedChoice ? selectedChoice.value : "";
  const message = `${CONFIG.whatsappText} ${selectedText}`;
  whatsappButton.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

attendanceChoices.forEach((choice) => {
  choice.addEventListener("change", updateWhatsappLink);
});
updateWhatsappLink();

const mapButton = document.getElementById("mapBtn");
if (mapButton) {
  mapButton.href = CONFIG.mapLink;
}

const timerFields = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds")
};

const pad = (value) => String(value).padStart(2, "0");

function updateTimer() {
  const targetTime = new Date(CONFIG.eventDate).getTime();
  const diff = targetTime - Date.now();

  if (Number.isNaN(targetTime)) {
    return;
  }

  if (diff <= 0) {
    Object.values(timerFields).forEach((field) => {
      if (field) {
        field.textContent = "00";
      }
    });
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  if (timerFields.days) timerFields.days.textContent = pad(days);
  if (timerFields.hours) timerFields.hours.textContent = pad(hours);
  if (timerFields.minutes) timerFields.minutes.textContent = pad(minutes);
  if (timerFields.seconds) timerFields.seconds.textContent = pad(seconds);
}

updateTimer();
setInterval(updateTimer, 1000);

const revealElements = document.querySelectorAll(".reveal");

revealElements.forEach((element, index) => {
  element.style.setProperty("--reveal-delay", `${Math.min(index * 70, 280)}ms`);
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -10% 0px"
    }
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}
