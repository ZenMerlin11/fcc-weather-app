# freeCodeCamp Local Weather App
Live examples on [codepen](http://codepen.io/ZenMerlin11/full/ZBemxx/)

## Getting Started ##

This project was built using typescript and webpack. The dev and build
scripts below require bash. If your environment does not support bash
shell scripts, you will need to modify these to suit your needs.

A live example of the project can be viewed on codepen from the link
above or it can be run locally as follows. First, install Node
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

## Notes ##

The current build of the app only works over http due to the use of
cross-origin http resources used. Since gh-pages is served over https,
you may have to change permissions in your browser to allow the use of
unsafe scripts to view it on gh-pages.