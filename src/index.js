import './styles/main.scss';
import sun from './assets/sun.svg';
import lightCloud from './assets/lightCloud.svg';
import cloud from './assets/cloud.svg';
import lightRain from './assets/lightRain.svg';
import heavyRain from './assets/heavyRain.svg';
import thunderstorm from './assets/thunderstorm.svg';
import background from './assets/background.jpg';
import search from './assets/search.svg';

window.onload = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

//Add images
const weatherIcon = document.querySelector('.weather__weather-icon');
weatherIcon.setAttribute('src', sun);

const mainSection = document.querySelector('.weather__main');
mainSection.style.backgroundImage = `url(${background})`


//Search 
const searchInput = document.querySelector('.weather__search-input');
const searchIcon = document.querySelector('.weather__search-icon');
searchIcon.setAttribute('src', search);

window.addEventListener('click', (e) => {
    if (e.target !== searchInput && e.target == searchIcon) {
        searchInput.classList.toggle('active');
    } else {
        searchInput.classList.remove('active');
    }
})


//Show more section 
const showMoreBtn = document.querySelector('.weather__button');
const textButton = document.querySelector('.weather__button-text');
const arrow = document.querySelector('.weather__button-circle');
let moreIsopen = false;

showMoreBtn.addEventListener('click', () => {
    if (moreIsopen) {
        showLess();
    } else if (!moreIsopen) {
        showMore();
    }
});

function showMore() {
    arrow.classList.add('active');
    textButton.innerHTML = 'less';
    mainSection.classList.add('active');
    document.body.style.overflow = 'scroll';
    moreIsopen = true;
}

function showLess() {
    arrow.classList.remove('active');
    textButton.innerHTML = 'more';
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    mainSection.classList.remove('active');
    document.body.style.overflow = 'hidden';
    moreIsopen = false;
}



