// Global app data
const apiKey: string = 'ffceec59df88c4336a45c093deedd062';
const baseUrl: string = 'http://api.openweathermap.org/data/2.5/weather?';
const baseIconUrl: string = 'http://openweathermap.org/img/w/';
const degSign: string = '\u00B0';
let tempKelvin: number; // inital value retrieved from openweather
let tempUnit: string = 'F';
let convertTemp: Function = kelvinToFahrenheit;
let watchId: number = 0;

// Interfaces for Open Weather API json
// Only features needed for this app are implemented
// See sample-output.json or openweathermap.org API documentation
// for additional data available if needed
interface IOpenWeatherJSON {
    weather: Array<IWeather>;
    main: IMain;
    sys: ISys;
    name: string; // city name
}

interface IWeather {
    main: string; // terse weather conditions description
    description: string; // verbose weather conditions description
    icon: string; // icon flag
}

interface IMain {
    temp: number; // default temperature given in Kelvin    
}

interface ISys {
    country: string; // only interested in country description
}

// App entry point
function main(): void {
    // Verify browser support
    if (!navigator.geolocation) {
        errorMsg("Error: Geolocation not supported by your browser.");
        return;
    }

    // Add event listeners on position change
    watchId = navigator.geolocation.watchPosition(
        getWeather, geoError, geoOptions
    );
}

// watchPosition on error callback
function geoError(): void {
    errorMsg("Error: Unable to retrieve position.")
}

// watchPosition options 
let geoOptions: PositionOptions = {
    enableHighAccuracy: false,
    maximumAge: 0,
    timeout: 30000
}

// Get weather for current location
function getWeather(position: Position): void {
    // Build URL for weather request
    let lat: number = position.coords.latitude;
    let lon: number = position.coords.longitude;
    let url: string = `${ baseUrl }lat=${ lat }&lon=${ lon }&appid=${ apiKey }`;

    // Create and issue request for weather data
    let xhr: XMLHttpRequest = new XMLHttpRequest();
    if (!xhr) {
        errorMsg('Error: Cannot create XMLHttp instance');
        return;
    }
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onreadystatechange = function() {
        displayWeather(xhr.response);
    };    
    xhr.send();
}

// Response handler
function handleXhrResponse(xhr: XMLHttpRequest) {
    // Check that request is completed
    if (xhr.readyState != 4) {
        // do nothing if request is incomplete
        return;
    }

    // Check for null response from server
    if (xhr.response === null) {
        errorMsg('Error: no response from server');
        return;
    }

    // Check for error status
    if (xhr.status != 200) {
        errorMsg(`Error: status ${ xhr.status }`);
        return;
    }

    // If no errors, display weather data
    displayWeather(xhr.response);
}

// Update display of current weather
function displayWeather(response: IOpenWeatherJSON): void {
    if (response === null) {
        return; // if response is null, do nothing
    }
    
    // Save inital Kelvin temperature for toggling unit conversions
    tempKelvin = response.main.temp;

    let city: string = response.name, // city name
        country: string = response.sys.country, // country name         
        condDesc: string = response.weather[0].main, // weather description
        icon: string = response.weather[0].icon;
    
    // Update weather display
    updateLocation(city, country);
    updateTemp(convertTemp(tempKelvin));
    updateCond(condDesc);
    updateIcon(icon);
}

function updateLocation(city: string, country: string): void {
    document.getElementById('location')
        .textContent = `${ city }, ${ country }`;
}

function updateTemp(temp: number): void {
    document.getElementById('temp')
        .textContent = `${ temp.toString() } ${ degSign } ${ tempUnit }`;
}

function updateCond(condDesc: string): void {
    document.getElementById('cond')
        .textContent = condDesc;
}

function updateIcon(icon: string): void {
    let elem: HTMLImageElement = 
        document.getElementById('cond-icon') as HTMLImageElement;
    elem.src = `${ baseIconUrl }${ icon }.png`;
    elem.width = elem.width * 1.5;
}

// Convert temperature in Kelvins to Degrees Fahrenheit
function kelvinToFahrenheit(tempK: number): number {
    // Tf = Tk x 9/5 - 459.67
    // Rounds result to one decimal place
    return Math.round((tempK * 9 / 5 - 459.67) * 10) / 10;
}

// Convert temperature in Kelvins to Degrees Celsius
function kelvinToCelsius(tempK: number): number {
    // Tc = Tk - 273.15
    // Rounds result to one decimal place
    return Math.round((tempK - 273.15) * 10) / 10;
}

// Toggle between Fahrenheit or Celsius units
function toggleUnits(): void {
    if (tempUnit === 'F') {
        tempUnit = 'C';
        convertTemp = kelvinToCelsius;
    } else {
        tempUnit = 'F';
        convertTemp = kelvinToFahrenheit;
    }
    updateTemp(convertTemp(tempKelvin));
}

// Display error message
function errorMsg(msg: string) {
    alert(msg);
}

// Register event listeners and Define entry
document.getElementById('temp').addEventListener('click', toggleUnits, false);
window.onload = main;