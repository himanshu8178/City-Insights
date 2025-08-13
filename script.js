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
    // 1. Get city coordinates & info (GeoDB Cities API - Free)
    const geoRes = await fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${city}&limit=1`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'a40af4aef1mshf94000ed4686c87p1a9e48jsn4d277b08662c',
        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
      }
    });
    const geoData = await geoRes.json();
    if (!geoData.data.length) {
      alert("City not found.");
      return;
    }
    const cityData = geoData.data[0];

    document.getElementById("city-info").innerHTML = `
      <h2>${cityData.city}, ${cityData.country}</h2>
      <p>📍 Coordinates: ${cityData.latitude}, ${cityData.longitude}</p>
      <p>👥 Population: ${cityData.population || "N/A"}</p>
    `;

    // 2. Get weather (OpenWeatherMap API)
    const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${cityData.latitude}&lon=${cityData.longitude}&units=metric&appid=50fb71355f52e1e0bef4804a00a3063c`);
    const weather = await weatherRes.json();
    document.getElementById("weather-info").innerHTML = `
      <h3>🌤 Weather</h3>
      <p>${weather.weather[0].description}, ${weather.main.temp}°C</p>
    `;

    // 3. Get local time (WorldTimeAPI)
    const timeRes = await fetch(`https://worldtimeapi.org/api/timezone/${cityData.countryCode}/${cityData.city}`);
    const timeData = await timeRes.json();
    document.getElementById("time-info").innerHTML = `
      <h3>🕒 Local Time</h3>
      <p>${timeData.datetime ? new Date(timeData.datetime).toLocaleString() : "N/A"}</p>
    `;

    // 4. Get fun fact (Wikipedia)
    const wikiRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${cityData.city}`);
    const wikiData = await wikiRes.json();
    document.getElementById("fact-info").innerHTML = `
      <h3>📚 Fun Fact</h3>
      <p>${wikiData.extract || "No fact available."}</p>
    `;

  } catch (error) {
    console.error(error);
    alert("Error fetching city data.");
  }
}
