
var helpers = require('./helpers');
var giphy = require('giphy-api')();

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

 module.exports = async function(search) {
    
  const result = await giphy.search({
    q: search,
    rating: 'g',
    limit:1,
    offset:getRandomInt(0,100)
  });
  
   if(result.data.length > 0){
     const {images} = result.data[0];
     console.log(images.fixed_height_downsampled.url);
     return images.fixed_height_downsampled.url;
   }
   return null;
};
        

  

