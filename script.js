const input = document.querySelector('.weather-input')
const temperature = document.querySelector('.temperature')
const windVal = document.querySelector('.wind-value')
const wind = document.querySelector('.wind')
const btn = document.querySelector('.weather-btn')
const forecastWeatherContainer = document.querySelector('.forecast-weather-container')
const locValue = document.querySelector('.location')

const FORECAST_API_LINK = 'https://api.openweathermap.org/data/2.5/forecast?q='
const CURRENT_API_LINK = 'https://api.openweathermap.org/data/2.5/weather?q='
const API_KEY = '&appid=8c06d1807d8820e1bc9fca7e0940cead'
const API_UNITS = '&units=metric'

const getWeather = () => {
    getCurrentWeather()
    getForecastWeather()
}

const getCurrentWeather = () => {
    const city = input.value
    const URL = CURRENT_API_LINK + city + API_KEY + API_UNITS

    fetch(URL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Wystąpił błąd. Status odpowiedzi: ' + response.status)
            }
            return response.json()
        })
        .then(data => {
            console.log(JSON.stringify(data))
            const temperatureValue = data.main.temp
            const windValue = data.wind.speed
            const loc = input.value

            temperature.textContent = Math.round(temperatureValue) + '℃\t'
            windVal.textContent = Math.round(windValue)  + ' km/h'
            wind.classList.remove('hide')
            locValue.textContent = loc
        })
        .catch(error => {
            console.error("Błąd: " + error.message)
        })
}

const getFormattedDate = (timestamp) => {
    const date = new Date(timestamp * 1000)
    const options = { weekday: 'short'}
    return date.toLocaleDateString('pl-PL', options)
}

const createWeatherElement = (forecastData) => {
    const forecastDiv = document.createElement('div')
    forecastDiv.classList.add('forecast-item')

    const date = document.createElement('p')
    date.textContent = getFormattedDate(forecastData.dt)
    forecastDiv.append(date)

    const temp = document.createElement('p')
    temp.textContent = Math.round(forecastData.main.temp) + ' °C'
    forecastDiv.append(temp)

    const windValue = document.createElement('p')
    windValue.textContent = Math.round(forecastData.wind.speed) + ' km/h'
    forecastDiv.append(windValue)

    return forecastDiv
}

const getForecastWeather = () => {
    const city = input.value
    const URL = FORECAST_API_LINK + city + API_KEY + API_UNITS

    const xhr = new XMLHttpRequest()
    xhr.open('GET', URL, true)

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const data = JSON.parse(xhr.responseText)
                console.log(JSON.stringify(data))

                forecastWeatherContainer.innerHTML = ''

                const processedDates = {};

                if (data.list && data.list.length > 0) {

                    data.list.forEach(forecastData => {
                        const dateStr = getFormattedDate(forecastData.dt)

                        if (!processedDates[dateStr]) {
                            const forecastDiv = createWeatherElement(forecastData)
                            forecastWeatherContainer.append(forecastDiv)
                            processedDates[dateStr] = true
                        }

                    })
                } else {
                    const noData = document.createElement('p')
                    noData.textContent = 'Brak danych prognozy'
                    forecastWeatherContainer.append(noData)
                }
            }

        }
    }

    xhr.send()
}


btn.addEventListener('click', getWeather)
