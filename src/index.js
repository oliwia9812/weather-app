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

//Search city
const searchInput = document.querySelector('.weather__search-input');
const searchIcon = document.querySelector('.weather__search-icon');
const searchArrowIcon = document.querySelector('.weather__search-arrow');
let inputValue;

searchIcon.setAttribute('src', Search);
searchArrowIcon.setAttribute('src', ArrowRight)

searchInput.addEventListener('keyup', (e) => {
    inputValue = e.target.value;
});

window.addEventListener('click', (e) => {
    if(e.target === searchIcon) {
        displayInput();
        displayArrow();
    } else if (e.target === searchArrowIcon) {
        if(inputValue){
            if(inputValue.length < 3){
                displayError('Please provide correct location');
            } else {
                getWeatherDataByCityName(inputValue)
                    .catch(err => displayError('Incorrect city name'));
            }
        } else {
            displayError('Please provide location');
        }
        clearInputValue();
    } else if (e.target !== searchInput) {
        hideInput();
        displaySearch();
        clearInputValue();
    }
})

const displaySearch = () => {
    searchArrowIcon.classList.remove('active');
    searchIcon.classList.remove('hide'); 
}
const displayArrow = () => {
    searchArrowIcon.classList.add('active');
    searchIcon.classList.add('hide');
}
const displayInput = () => {
    searchInput.classList.add('active');
}
const hideInput = () => {
    searchInput.classList.remove('active');
}
const clearInputValue = () => {
    inputValue = '';
    searchInput.value = ''
}


//Show more section 
const mainSection = document.querySelector('.weather__main');
const weatherIcon = document.querySelector('.weather__weather-icon');
const showMoreBtn = document.querySelector('.weather__button');
const textButton = document.querySelector('.weather__button-text');
const arrow = document.querySelector('.weather__button-circle');
const moreSection = document.querySelector('.weather__more');
let moreIsopen = false;

showMoreBtn.addEventListener('click', () => {
    if (moreIsopen) {
        showLess();
    } else if (!moreIsopen) {
        showMore();
    }
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


// Get dates for next 7 days 
const getDateForNextDays = () => {
    const cards = document.querySelectorAll('.weather__day-date');
    let today = new DateTime.now();
    let days = [];
    
    function formatDays(day) {
        day = day.toFormat('EEE, d MMM');
        return day
    }
    
    for (var i = 1; i <= 7; i++) {
        days.push(formatDays(today.plus({
            days: i
        })));
    }
    
    for (var i = 0; i <= 6; i++) {
        cards[i].innerHTML = days[i]
    }
    
}
getDateForNextDays();

//Greeting
function displayGreeting() {
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
displayGreeting();



//Weather API
const checkInitialPosition = () => {
    let checkGeolocationPermission = new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            position => {
                resolve(position.coords)
            },
            error => {
                reject(`ERROR ${error.code}: ${error.message}`)
            }
        )
    }).catch(error => error)

    return checkGeolocationPermission
}

const getInitialData = async() => {
    let response = await checkInitialPosition();
    let data = await response;
    return data
}

 const getCurrentWeatherData = async(lat,lon) => {
    const api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.API_KEY}&units=metric`;
    const response = await fetch(api);
    const data = await response.json();

   displayCurrentData(data);
   getForecastWeatherData(data.coord.lat, data.coord.lon);
}

const getForecastWeatherData = async(lat, lon) => {
    const api = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=metric&appid=${process.env.API_KEY}`;
    const response = await fetch(api);
    let data = await response.json();

    displayForecastData(data);
}

const getWeatherDataByCityName = async(cityName) => {
    const api = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${process.env.API_KEY}&units=metric`;
    const response = await fetch(api);
    let data = await response.json();
    
    getForecastWeatherData(data.coord.lat, data.coord.lon);
    displayCurrentData(data);
}

window.addEventListener('load', () => {
   getInitialData()
        .then(response => { getCurrentWeatherData(response.latitude, response.longitude)})
        .catch(getCurrentWeatherData(52.237049, 21.017532));
})

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
    visibility.innerHTML = ((data.visibility)*0.001) + 'KM';
    pressure.innerHTML = data.main.pressure + ' ' +'hPa';
    wind.innerHTML = Math.round(data.wind.speed*10)/10 + ' ' + 'm/s';
}

function displayForecastData(data) {
    const icons = document.querySelectorAll('.weather__day-icon');
    const dayTemp = document.querySelectorAll('.weather__day-temp--day');
    const nightTemp = document.querySelectorAll('.weather__day-temp--night');

    let iconName;
    let dayTempValue;
    let nightTempValue;

    for(var i = 1; i<=7; i++) {
       iconName = data.daily[i].weather[0].main;
       dayTempValue = (Math.round(data.daily[i].temp.max));
       nightTempValue = (Math.round(data.daily[i].temp.min)).toFixed().replace('-0', '0');

       icons[i-1].setAttribute('src', `${iconName}.svg`)
       dayTemp[i-1].innerHTML = dayTempValue + '&#8451;';
       nightTemp[i-1].innerHTML = nightTempValue + '&#8451;';
    }
}

const displayError = msg => {
    alert(msg);
}
