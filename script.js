const cityInput = document.querySelector('#city');
const search = document.querySelector('#search_btn');
const currentLocation = document.querySelector('#current_location_btn');
const currentLocDiv = document.querySelector('.current_details');
const weatherCardDiv = document.querySelector('.forecast');

const API_KEY = "58250d9a3a42a8bd7e23e01ed001c54a";

const getCityCoordinates = () => {                              // getting location
    const cityName = cityInput.value.trim();
    if(!cityName) return;
    const LOCATION_API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`;

    fetch(LOCATION_API_URL)
    .then(res => res.json())
    .then(data => {
        const name= data.name;
        const lat= data.coord.lat;
        const lon = data.coord.lat;
        getWeatherDetails(name, lat, lon);
    })
    .catch(() => {
        alert("An error occurred while fetching the Coordinates.")
    });

}

const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const {latitude, longitude } = position.coords;
            const CURRENT_LOCATION_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

            fetch(CURRENT_LOCATION_API_URL)
            .then(res => res.json())
            .then(data => {

                const {name} = data;
                getWeatherDetails(name, latitude, longitude);
            })
            .catch(() => {
                alert("An error occurred while fetching the City.")
            });
        },
        error => {
            if(error.code == error.PERMISSION_DENIED){
                alert("Geolocation request denied. Can't access.")
            }
        }
    )
}

const getWeatherDetails = (name, lat, lon) => {                         // getting Weather
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL)
    .then(res => res.json())
    .then(data => {
        const uniqeForcasteDays = [];
        const fiveForcaste = data.list.filter(forcaste => {
            const forcastDate = new Date(forcaste.dt_txt).getDate();
            if(!uniqeForcasteDays.includes(forcastDate)){
                return uniqeForcasteDays.push(forcastDate)
            }
        })
        
        cityInput.value = "";
        currentLocDiv.innerHTML = "";
        weatherCardDiv.innerHTML = "";

        fiveForcaste.forEach((weatherItem, index) => {
            if(index === 0){
                currentLocDiv.insertAdjacentHTML("beforeend", createWeatherCard(name, weatherItem, index));
            }
            else if(index <= 4){
            weatherCardDiv.insertAdjacentHTML("beforeend", createWeatherCard(name, weatherItem, index));

            }
    });

    })
    .catch(() => {
        alert("An error occurred while fetching the weather details.")
    })
        
}

const createWeatherCard = (name, weatherItem, index) => {
    if(index === 0){
        return `<div class="details">
                    <h2>${name} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <p>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</p>
                    <p>Wind       : ${weatherItem.wind.speed} M/S</p>
                    <p>Humidity   : ${weatherItem.main.humidity}%</p>
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="Weather_icon" id="current_icon">
                    <p>${weatherItem.weather[0].description}</p>
                </div>`
    }
    else {
        return `<li>
                    <h3>${weatherItem.dt_txt.split(" ")[0]}</h3>
                    <div class="ficon">
                        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="Weather_icon">
                    </div>
                    <p>Temp    : ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</p>
                    <p>Wind    : ${weatherItem.wind.speed} M/S</p>
                    <p>Humidity: ${weatherItem.main.humidity}%</p>
                </li>`;
    }

}


search.addEventListener('click', getCityCoordinates);
currentLocation.addEventListener('click', getUserCoordinates);
cityInput.addEventListener('submit', getCityCoordinates);
