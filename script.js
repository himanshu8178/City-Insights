const weatherApiKey = "50fb71355f52e1e0bef4804a00a3063c";

document.getElementById("search-btn").addEventListener("click", searchCity);
document.getElementById("city-input").addEventListener("keypress", function (e) {
  if (e.key === "Enter") searchCity();
});

async function searchCity() {
  const city = document.getElementById("city-input").value.trim();
  if (!city) {
    alert("Please enter a city name.");
    return;
  }

  try {
    // 1. Get city coordinates from OpenWeatherMap (no RapidAPI needed)
    const geoRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}`);
    if (!geoRes.ok) {
      alert("City not found.");
      return;
    }
    const geoData = await geoRes.json();

    const lat = geoData.coord.lat;
    const lon = geoData.coord.lon;
    const cityName = geoData.name;
    const countryCode = geoData.sys.country;
    const population = geoData.population || "N/A";

    document.getElementById("city-info").innerHTML = `
      <h2>${cityName}, ${countryCode}</h2>
      <p>📍 Coordinates: ${lat}, ${lon}</p>
      <p>👥 Population: ${population}</p>
    `;

    // 2. Weather details
    const weather = geoData.weather[0].description;
    const temp = geoData.main.temp - 273.15; // Kelvin to Celsius
    document.getElementById("weather-info").innerHTML = `
      <h3>🌤 Weather</h3>
      <p>${weather}, ${temp.toFixed(1)}°C</p>
    `;

    // 3. Local time (WorldTimeAPI)
    try {
      const timeRes = await fetch(`https://worldtimeapi.org/api/timezone/Etc/GMT`);
      const timeData = await timeRes.json();
      document.getElementById("time-info").innerHTML = `
        <h3>🕒 Local Time</h3>
        <p>${new Date(timeData.datetime).toLocaleString()}</p>
      `;
    } catch {
      document.getElementById("time-info").innerHTML = `<h3>🕒 Local Time</h3><p>N/A</p>`;
    }

    // 4. Fun fact from Wikipedia
    try {
      const wikiRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${cityName}`);
      const wikiData = await wikiRes.json();
      document.getElementById("fact-info").innerHTML = `
        <h3>📚 Fun Fact</h3>
        <p>${wikiData.extract || "No fact available."}</p>
      `;
    } catch {
      document.getElementById("fact-info").innerHTML = `<h3>📚 Fun Fact</h3><p>N/A</p>`;
    }

  } catch (error) {
    console.error(error);
    alert("Error fetching city data.");
  }
}
