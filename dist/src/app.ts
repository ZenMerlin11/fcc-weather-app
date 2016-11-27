// Global app data
const apiKey: string = 'ffceec59df88c4336a45c093deedd062';
const baseUrl: string = 'http://api.openweathermap.org/data/2.5/weather?';
const baseIconUrl: string = 'http://openweathermap.org/img/w/';
const geoUrl: string = 'http://freegeoip.net/json/';
const degSign: string = '\u00B0';
let tempKelvin: number; // inital value retrieved from openweather
let tempUnit: string = 'F';
let convertTemp: Function = kelvinToFahrenheit;

// Interface for freegeoip.net json
interface IFreeGeoIP_JSON {
    ip: string;
    country_code: string;
    country_name: string;
    region_code: string;
    region_name: string;
    city: string;
    zip_code: string;
    time_zone: string;
    latitude: number;
    longitude: number;
    metro_code: number;
}

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
    // Initiate get location and local weather requests
    getJSON(geoUrl, getWeather);
}

function getJSON(url: string, callback: Function): void {
    let xhr: XMLHttpRequest = new XMLHttpRequest();
    if (!xhr) {
        errorMsg('Error: Cannot create XMLHttpRequest instance');
        return;
    }
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onreadystatechange = function() {
        handleXhrResponse(xhr, callback);
    };    
    xhr.send();
}

// XMLHttpRequest Response handler
function handleXhrResponse(xhr: XMLHttpRequest, callback: Function) {
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
    callback(xhr.response);
}

// Get weather for current location
function getWeather(response: IFreeGeoIP_JSON): void {
    // Build URL for weather request
    let lat: number = response.latitude;
    let lon: number = response.longitude;
    let url: string = `${ baseUrl }lat=${ lat }&lon=${ lon }&appid=${ apiKey }`;

    // Create and issue request for weather data
    getJSON(url, displayWeather);
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
        .textContent = `${ temp.toString() }${ degSign }${ tempUnit }`;
}

function updateCond(condDesc: string): void {
    document.getElementById('cond')
        .textContent = condDesc;
}

function updateIcon(icon: string): void {
    let elem: HTMLImageElement = 
        document.getElementById('cond-icon') as HTMLImageElement;
    elem.src = `${ baseIconUrl }${ icon }.png`;
}

// Convert temperature in Kelvins to Degrees Fahrenheit
function kelvinToFahrenheit(tempK: number): number {
    // Tf = Tk x 9/5 - 459.67
    // Rounds result to nearest integer
    return Math.round(tempK * 9 / 5 - 459.67);
}

// Convert temperature in Kelvins to Degrees Celsius
function kelvinToCelsius(tempK: number): number {
    // Tc = Tk - 273.15
    // Rounds result to nearest integer
    return Math.round(tempK - 273.15);
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