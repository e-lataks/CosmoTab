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

  <div id="media"></div>
`;

function updateTime() {
  const now = new Date();
  document.querySelector("#clock").textContent =
    now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

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

fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`)
  .then(response => response.json())
  .then(data => {
    const media = data.media_type === "image"
      ? `<img src="${data.url}">`
      : `<video src="${data.url}" autoplay muted loop></video>`;

    document.querySelector("#media").innerHTML = media;
  });




document.querySelector("#search").addEventListener("keydown", e => {
  if (e.key === "Enter" && e.target.value.trim()) {
    window.location.href =
      `https://www.google.com/search?q=${encodeURIComponent(e.target.value)}`;
  }
});                                                                       