import './style.css';

const API_KEY = import.meta.env.VITE_NASA_API_KEY;

document.querySelector("#app").innerHTML = `
  <div class="top">
    <div id="date"></div>
    <div id="weather">Loading...</div>
  </div>

  <div class="clock" id="clock"></div>

  <div class="search">
    <input id="search" placeholder="Search the web..." />
  </div>

  <button id="changeSpace">Change Space</button>

  <div id="media">Loading...</div>
`;

function updateTime() {
  const now = new Date();

  document.querySelector("#clock").textContent =
    now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

  document.querySelector("#date").textContent =
    now.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long"
    });
}

updateTime();
setInterval(updateTime, 1000);

navigator.geolocation.getCurrentPosition(position => {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m`
  )
    .then(response => response.json())
    .then(data => {
      document.querySelector("#weather").textContent =
        `${Math.round(data.current.temperature_2m)}°C`;
    });
});

function loadSpace() {
  const start = new Date(1995, 5, 16);
  const end = new Date();

  const randomDate = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  ).toISOString().split("T")[0];

  document.querySelector("#media").innerHTML = "Loading...";

  fetch(
    `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${randomDate}`
  )
    .then(response => {
      if (!response.ok) {
        throw new Error("NASA API error");
      }
      return response.json();
    })
    .then(data => {
      if (data.media_type === "image") {
        document.querySelector("#media").innerHTML =
          `<img src="${data.url}" alt="${data.title}">`;
      } else {
        loadSpace();
      }
    })
    .catch(() => {
      document.querySelector("#media").innerHTML = "Loading space...";
      setTimeout(loadSpace, 1000);
    });
}

loadSpace();

document.querySelector("#changeSpace").addEventListener("click", loadSpace);

document.querySelector("#search").addEventListener("keydown", e => {
  if (e.key === "Enter" && e.target.value.trim()) {
    window.location.href =
      `https://www.google.com/search?q=${encodeURIComponent(e.target.value)}`;
  }
});