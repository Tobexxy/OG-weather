const cityInput = document.querySelector('.city-input')
const searchBtn = document.querySelector('.search-btn')

const weatherInfoSection = document.querySelector('.weather-info')
const notFoundSection = document.querySelector('.not-found')
const searchCitySection = document.querySelector('.search-city')

const countryTxt = document.querySelector('.country-txt')
const tempTxt = document.querySelector('.temp-txt')
const conditionTxt = document.querySelector('.condition-txt')
const humidityValueTxt = document.querySelector('.humidity-value-txt')
const windValueTxt = document.querySelector('.wind-value-txt')
const weatherSummaryImg = document.querySelector('.weather-summary-img')
const currentDateTxt = document.querySelector('.current-date-txt')

const forecastItemsContainer = document.querySelector('.forecast-items-container')

const apiKey = '18f69745627bb28276e41b8076dee015'

searchBtn.addEventListener('click', () => {
    if (cityInput.value.trim() != '') {
        updateWeatherInfo(cityInput.value)
        cityInput.value = ''
        cityInput.blur()
    }
})
cityInput.addEventListener('keydown', (event) => {
    if (event.key == 'Enter' &&
        cityInput.value.trim() != ''
    ) {
        updateWeatherInfo(cityInput.value)
        cityInput.value = ''
        cityInput.blur()
    }
})

async function getFetchData(endPoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`

    const response = await fetch(apiUrl)
    
    return response.json()
}


function updateBackground(main, icon) {
    const appContainer = document.body; // Change the background of the entire body or a specific container.

    // Set a default background
    let backgroundImage = "url('assets/weather/img/clear.jpg')";

    // Update background based on weather conditions
    if (icon === "01d") backgroundImage = "url('assets/weather/img/clear.jpg')";
    else if (icon === "01n") backgroundImage = "url('assets/weather/night.jpg')";
    else if (icon === "02d") backgroundImage = "url('assets/weather/clouds.jpg')";
    else if (icon === "02n") backgroundImage = "url('assets/weather/clouds.jpg')";
    else if (main === "Rain") backgroundImage = "url('assets/weather/rainy-bg.jpg')";
    else if (main === "Snow") backgroundImage = "url('assets/weather/snow.jpg')";
    else if (main === "Thunderstorm") backgroundImage = "url('assets/weather/thunderstorm-bg.jpg')";
    else if (main === "Clouds") backgroundImage = "url('assets/weather/clouds.jpg')";
    else if (main === "Mist") backgroundImage = "url('assets/weather/mist2.jpg')";


    // Apply the background
    appContainer.style.backgroundImage = backgroundImage;
    appContainer.style.backgroundSize = "cover";
    appContainer.style.backgroundPosition = "center";
    appContainer.style.transition = "background 0.5s ease-in-out";
}

function getWeaatherIcon(icon, main) {

    
    
    if (icon == "01d") return 'Sun.png'
    if (icon == "01n") return 'Moon.png'
    if (icon == "02d") return 'few clouds.png'
    if (icon == "02n") return 'Moon cloud.png'
    if (icon == "50d") return 'Cloud slow wind.png'
    if (icon == "50n") return 'Cloud slow wind.png'
    if (icon == "10d") return 'Sun cloud angled rain.png'
    if (icon == "09d") return 'Sun cloud angled rain.png'
    if (icon == "10n") return 'Moon cloud angled rain.png'
    if (icon == "09n") return 'Moon cloud angled rain.png'
    if (icon == "03n") return 'Moon cloud.png'
    if (icon == "04d") return 'broken clouds.png'
    if (icon == "04n") return 'broken clouds.png'


    if (main === "Clouds") return "Cloud1.png";
    if (main === "Snow") return "Big snow.png";
    if (main === "Thunderstorm") return "thunderstorm.png";


    
    
    
    else return 'Cloud1.png'
}


function getCurrentDate() {
    const currentDate = new Date()
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    }
    
    return currentDate.toLocaleDateString('en-GB', options)
}

async function updateWeatherInfo(city) {
    const weatherData = await getFetchData('weather', city)
    
    if (weatherData.cod != 200) {
        showDisplaySection(notFoundSection)
        return
    }
    
    const {
        name: country,
        main: { temp, humidity },
        weather: [{ icon, main }],
        wind: { speed }
    } = weatherData

    countryTxt.textContent = country
    tempTxt.textContent = Math.round(temp) + ' °C'
    conditionTxt.textContent = main
    humidityValueTxt.textContent = humidity + '%'
    windValueTxt.textContent = speed + ' M/s'

    

    currentDateTxt.textContent = getCurrentDate();

    const weatherIconPath = `assets/weather/img/${getWeaatherIcon(icon, main)}`;
    weatherSummaryImg.src = weatherIconPath;
    // weatherSummaryImg.src = `assets/weather/img/${getWeaatherIcon(icon)}`

     // **Update Background**
     updateBackground(main, icon);

    await updateForecastsInfo(city)
    showDisplaySection(weatherInfoSection)

   
}

async function updateForecastsInfo(city) {
    const forecastsData = await getFetchData('forecast', city)

    const timeTaken = '12:00:00'
    const todayDate = new Date().toISOString().split('T')[0]

    forecastItemsContainer.innerHTML = '';
    forecastsData.list.forEach(forecastWeather => {
        if (forecastWeather.dt_txt.includes(timeTaken) &&
            !forecastWeather.dt_txt.includes(todayDate)) {
            updateForecastItems(forecastWeather)
        }
    })
}

function updateForecastItems(weatherData) {
    const {
        dt_txt: date,
        weather: [{ icon, main }],
        main: { temp },
    } = weatherData

    const dateTaken = new Date(date)
    const dateOption = {
        day: '2-digit',
        month: 'short'
    }
    const dateResult = dateTaken.toLocaleDateString('en-US', dateOption)

    const forecastItem = `
        <div class="forecast-item">
            <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
            <img src="assets/weather/img/${getWeaatherIcon(icon, main)}" class="forecast-item-img">
            <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
        </div>
    `

    forecastItemsContainer.insertAdjacentHTML('beforeend', forecastItem)
}

function showDisplaySection(section) {
    [weatherInfoSection, searchCitySection, notFoundSection]
        .forEach(section => section.style.display = 'none')

    section.style.display = 'flex'
}