const weatherApiKey = "50fb71355f52e1e0bef4804a00a3063c"; 
const newsApiKey = "e9fd659a609f40dbb24bd1ad7546e84c"; 

document.getElementById("search-btn").addEventListener("click", searchCity);
document.getElementById("city-input").addEventListener("keypress", function(e) {
  if (e.key === "Enter") searchCity();
});

function searchCity() {
  const city = document.getElementById("city-input").value.trim();
  if (!city) return alert("Please enter a city name.");

  fetchWeather(city);
  fetchPopulation(city);
  fetchNews(city);
}

function fetchWeather(city) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`)
    .then(res => res.json())
    .then(data => {
      if (data.cod === "404") {
        document.getElementById("weather-info").innerText = "City not found.";
        return;
      }
      document.getElementById("weather-info").innerText =
        `${data.weather[0].description}, ${data.main.temp}°C`;
    })
    .catch(() => document.getElementById("weather-info").innerText = "Error fetching weather.");
}

function fetchPopulation(city) {
  fetch(`https://countriesnow.space/api/v0.1/countries/population/cities`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ city })
  })
    .then(res => res.json())
    .then(data => {
      if (data.error || !data.data) {
        document.getElementById("population-info").innerText = "Population data not found.";
        return;
      }
      document.getElementById("population-info").innerText =
        `Population: ${data.data.populationCounts.slice(-1)[0].value.toLocaleString()}`;
    })
    .catch(() => document.getElementById("population-info").innerText = "Error fetching population.");
}

function fetchNews(city) {
  fetch(`https://newsapi.org/v2/everything?q=${city}&apiKey=${newsApiKey}`)
    .then(res => res.json())
    .then(data => {
      const newsList = document.getElementById("news-list");
      newsList.innerHTML = "";
      if (!data.articles || data.articles.length === 0) {
        newsList.innerHTML = "<li>No news found.</li>";
        return;
      }
      data.articles.slice(0, 5).forEach(article => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="${article.url}" target="_blank">${article.title}</a>`;
        newsList.appendChild(li);
      });
    })
    .catch(() => document.getElementById("news-list").innerHTML = "<li>Error fetching news.</li>");
}
