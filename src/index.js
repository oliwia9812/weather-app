import './styles/main.scss';
import Fog from './assets/Fog.svg';
import FewClouds from './assets/FewClouds.svg';
import Clear from './assets/Clear.svg';
import Clouds from './assets/Clouds.svg';
import Drizzle from './assets/Drizzle.svg';
import Rain from './assets/Rain.svg';
import Snow from './assets/Snow.svg';
import Thunderstorm from './assets/Thunderstorm.svg';
import Background from './assets/background.jpg';
import Search from './assets/search.svg';
import ArrowRight from './assets/ArrowRight.svg';
import {
    DateTime
} from "luxon";


const mainSection = document.querySelector('.weather__main');
const moreSection = document.querySelector('.weather__more');
const weatherIcon = document.querySelector('.weather__weather-icon');

//Search functionality
(() => {
    const searchIcon = document.querySelector('.weather__search-icon');
    searchIcon.setAttribute('src', Search);

    const searchInput = document.querySelector('.weather__search-input');
    const searchButton = document.querySelector('.weather__search-btn');
    let inputValue = '';

    ['click', 'touchstart'].forEach(evt => {
        window.addEventListener(evt, (e) => {
            if (e.target === searchIcon) {
                displayInput();
            } else if (e.target !== searchInput) {
                hideInput();
            } else if (e.target === searchInput) {
                e.stopPropagation();
            }
        });
    });

    window.addEventListener('keyup', (e) => {
        inputValue = e.target.value;

        if (e.key == 'Enter') {
            validateCityName();
        }
    });

    const displayInput = () => {
        searchButton.classList.add('active');
        searchInput.classList.add('active');
    }

    const hideInput = () => {
        searchButton.classList.remove('active');
        searchInput.classList.remove('active');
        clearValueFromInput();
    }

    const clearValueFromInput = () => {
        inputValue = '';
        searchInput.value = '';
    }

    const validateCityName = () => {
        if (inputValue) {
            if (inputValue.length <= 3) {
                displayError('City name is too short. Please enter correct city name.');
            } else {
                searchCity(inputValue);
            }
        } else {
            displayError('Please enter city name');
        }
    }

    const searchCity = (value) => {
        getWeatherDataByCityName(inputValue)
            .then(hideInput())
            .catch(error => {
                displayError('City not found. Please provide correct city name.')
            })
    }
})();


//Show more section 
(() => {
    const showMoreBtn = document.querySelector('.weather__button');
    const textButton = document.querySelector('.weather__button-text');
    const arrow = document.querySelector('.weather__button-circle');

    let moreIsopen = false;

    showMoreBtn.addEventListener('click', () => {
        moreIsopen ? showLess() : showMore();
    });



    function showMore() {
        weatherIcon.classList.add('is-hidden');
        arrow.classList.add('active');
        textButton.innerHTML = 'less';
        mainSection.classList.add('active');
        moreSection.classList.add('active');
        moreIsopen = true;
    }

    function showLess() {
        weatherIcon.classList.remove('is-hidden');
        arrow.classList.remove('active');
        textButton.innerHTML = 'more';
        mainSection.classList.remove('active');
        setTimeout(() => {
            moreSection.classList.remove('active');
        }, 300);
        moreIsopen = false;
    }
})();


// Get dates for next 7 days 
const getDateForNextDays = () => {
    const cards = document.querySelectorAll('.weather__day-date');
    const today = new DateTime.now();
    const days = [];

    for (var i = 1; i <= 7; i++) {
        days.push(formatDays(today.plus({
            days: i
        })));
    }

    for (var i = 0; i <= 6; i++) {
        cards[i].innerHTML = days[i];
    }

    function formatDays(day) {
        day = day.toFormat('EEE, d MMM');
        return day
    }
}
getDateForNextDays();


//Weather API
window.addEventListener('load', () => {
    getInitialData()
        .then(response => {
            getCurrentWeatherData(response.latitude, response.longitude)
                .catch(error => {
                    displayError('Network error. Please check weather later.')
                });
        })
        .catch(err => {
            getCurrentWeatherData(52.237049, 21.017532)
                .catch(error => {
                    displayError('Network error. Please check weather later.')
                });
        });
});

const checkInitialPosition = () => {
    let checkGeolocationPermission = new Promise((resolve, reject) => {

        navigator.geolocation.getCurrentPosition(
            position => {
                resolve(position.coords);
            },
            error => {
                reject();
            }
        )
    }).catch(error => console.error(error));

    return checkGeolocationPermission
}

const getInitialData = async () => {
    let response = await checkInitialPosition();
    let data = await response;
    return data
}

const getCurrentWeatherData = async (lat, lon) => {
    const api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.API_KEY}&units=metric`;
    const response = await fetch(api);
    const data = await response.json();

    displayCurrentData(data);
    getForecastWeatherData(data.coord.lat, data.coord.lon);
}

const getForecastWeatherData = async (lat, lon) => {
    const api = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=metric&appid=${process.env.API_KEY}`;
    const response = await fetch(api);
    let data = await response.json();

    displayForecastData(data);
}

const getWeatherDataByCityName = async (cityName) => {
    const api = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${process.env.API_KEY}&units=metric`;
    const response = await fetch(api);
    let data = await response.json();

    console.log(response);

    getForecastWeatherData(data.coord.lat, data.coord.lon);
    displayCurrentData(data);
}

const displayGreeting = () => {
    let currentTime = new Date().getHours();
    let greetingMsg;

    if (currentTime > 5 && currentTime < 12) {
        greetingMsg = 'Good morning'
    } else if (currentTime >= 12 && currentTime < 18) {
        greetingMsg = 'Good afternoon'
    } else if (currentTime >= 18) {
        greetingMsg = 'Good evening'
    }

    document.querySelector('.weather__greeting').innerHTML = greetingMsg + ". " + "it's currently";
}

const displayCurrentData = (data) => {
    const location = document.querySelector('.weather__location');
    const currentTemp = document.querySelector('.weather__temperature');
    const humidity = document.querySelector('#humidity');
    const visibility = document.querySelector('#visibility');
    const pressure = document.querySelector('#pressure');
    const wind = document.querySelector('#wind');
    let iconName = data.weather[0].main;
    let iconId = data.weather[0].id;

    if (iconId === 801) {
        iconName = 'FewClouds'
    }

    weatherIcon.setAttribute('src', `${iconName}.svg`);
    location.innerHTML = 'in' + ' ' + data.name + ', ' + data.sys.country;
    currentTemp.innerHTML = Math.round(data.main.temp) + '&#8451;';
    humidity.innerHTML = data.main.humidity + '%';
    visibility.innerHTML = ((data.visibility) * 0.001) + 'KM';
    pressure.innerHTML = data.main.pressure + ' ' + 'hPa';
    wind.innerHTML = Math.round(data.wind.speed * 10) / 10 + ' ' + 'm/s';

    displayGreeting();
}

function displayForecastData(data) {
    const icons = document.querySelectorAll('.weather__day-icon');
    const dayTemp = document.querySelectorAll('.weather__day-temp--day');
    const nightTemp = document.querySelectorAll('.weather__day-temp--night');

    let iconName;
    let dayTempValue;
    let nightTempValue;

    for (var i = 1; i <= 7; i++) {
        iconName = data.daily[i].weather[0].main;
        dayTempValue = (Math.round(data.daily[i].temp.max));
        nightTempValue = (Math.round(data.daily[i].temp.min)).toFixed().replace('-0', '0');

        icons[i - 1].setAttribute('src', `${iconName}.svg`)
        dayTemp[i - 1].innerHTML = dayTempValue + '&#8451;';
        nightTemp[i - 1].innerHTML = nightTempValue + '&#8451;';
    }
}


//Display errors
const modal = document.querySelector('.modal');
const modalButton = document.querySelector('.modal__button');
const overlay = document.querySelector('.overlay');

const displayError = msg => {
    const modalText = document.querySelector('.modal__msg');

    overlay.classList.add('active');
    modal.classList.add('active');
    modalText.innerHTML = msg;
}

modalButton.addEventListener('click', (e) => {
    e.stopPropagation();

    modal.classList.remove('active');
    overlay.classList.remove('active');
});