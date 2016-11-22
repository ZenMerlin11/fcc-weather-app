if [ -d "dist" ]; then
    rm -r dist        
fi
mkdir dist
if [ -d "js" ]; then
    rm -r js    
fi
mkdir js
npm run server
