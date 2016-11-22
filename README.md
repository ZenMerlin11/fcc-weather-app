# freeCodeCamp Local Weather App
Live examples on [github](https://zenmerlin11.github.io/fcc-weather-app/)

## Getting Started ##

This project was built using typescript and webpack. It can be viewed from
the link above or it can be run locally as follows. First, install Node
and NPM. Clone the repo and then in the root project folder run:

    npm install

This will install the project developer dependencies. To view, start the
web server by running:

    npm run dev

and go to <http://localhost:8080>. To build the project, run:

    npm run build

This will build the project and copy the production files to the dist
folder. To publish to gh-pages, commit the changes to the working branch
and then you can push the dist folder to your gh-pages branch using:

    git subtree push --prefix dist origin gh-pages

## References ##

Weather Data provided by [OpenWeatherMap](https://openweathermap.org/)