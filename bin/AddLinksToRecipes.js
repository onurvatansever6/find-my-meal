const fs = require('fs');

const recipes = JSON.parse(fs.readFileSync('../src/Recipes.json'));
const imageLinks = JSON.parse(fs.readFileSync('../src/Images.json'));

// Loop through each recipe and add the corresponding image URL
for (let i = 0; i < recipes.length; i++) {
  recipes[i].image = imageLinks[i];
}

// Write the modified recipes array to a file
fs.writeFileSync('./recipes-with-images.json', JSON.stringify(recipes));
