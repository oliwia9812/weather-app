import './styles/main.scss';
import sun from './assets/sun.svg';
import lightCloud from './assets/lightCloud.svg';
import cloud from './assets/cloud.svg';
import lightRain from './assets/lightRain.svg';
import heavyRain from './assets/heavyRain.svg';
import thunderstorm from './assets/thunderstorm.svg';
import background from './assets/background.jpg';
import search from './assets/search.svg';





//Add images
const weatherIcon = document.querySelector('.weather__weather-icon');
weatherIcon.setAttribute('src', sun);

const mainSection = document.querySelector('.weather__main');
mainSection.style.backgroundImage = `url(${background})`;


//Search 
const searchInput = document.querySelector('.weather__search-input');
const searchIcon = document.querySelector('.weather__search-icon');
searchIcon.setAttribute('src', search);

window.addEventListener('click', (e) => {
    if (e.target == searchIcon) {
        searchInput.classList.toggle('active');
    } else if (e.target !== searchInput) {
        searchInput.classList.remove('active');
    }

    searchInput.classList.contains('active') ? searchInput.value : searchInput.value = '';
});


// //Show more section 
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


//Add weather icons 
const nextDaysIcons = document.querySelectorAll('.weather__day-icon');

nextDaysIcons.forEach(day => {
    day.setAttribute('src', sun);
});

//Greeting
let currentTime = new Date().getHours();
let greetingMsg;

if (currentTime > 5 && currentTime < 12) {
    greetingMsg = 'Good morning'
} else if (currentTime > 12 && currentTime < 18) {
    greetingMsg = 'Good afternoon'
} else {
    greetingMsg = 'Good evening'
}

document.querySelector('.weather__greeting').innerHTML = greetingMsg + ". " + "it's currently";


//Weather API 
const location = document.querySelector('.weather__location');
const currentTemp = document.querySelector('.weather__temperature');


function initPosition() {
    let lat;
    let lon;

    let checkPosition = new Promise(resolve => {
        window.addEventListener('load', () => {
            navigator.geolocation.getCurrentPosition(showCurrentLocation);

            function showCurrentLocation(position) {
                lat = position.coords.latitude,
                    lon = position.coords.longitude
                resolve({
                    lat: lat,
                    lon: lon
                })
            }
        })
    })
    return checkPosition
}

function getWeatherDataFromCurrentPosition(lat, lon) {
    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.API_KEY}&units=metric`;
    fetch(api)
        .then(response => response.json())
        .then(data => {
            location.innerHTML = 'in ' + data.name + ', ' + data.sys.country;
            currentTemp.innerHTML = Math.round(data.main.temp) + '&#8451;';
        });
}

function getDefaultWeatherData() {
    const api = `https://api.openweathermap.org/data/2.5/weather?q=Warsaw&appid=${process.env.API_KEY}&units=metric`;
    fetch(api)
        .then(response => response.json())
        .then(data => {
            currentTemp.innerHTML = Math.round(data.main.temp) + '&#8451;';
        });
}

initPosition()
    .then(response => getWeatherDataFromCurrentPosition(response.lat, response.lon))
    .catch(getDefaultWeatherData())