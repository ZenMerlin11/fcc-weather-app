#!/bin/bash
if [ -d "dist" ]; then
    rm -r dist        
fi
mkdir dist
if [ -d "js" ]; then
    rm -r js    
fi
mkdir js
webpack -p
cp -r css dist/css
cp -r js dist/js
cp -r src dist/src
cp index.html dist/index.html
