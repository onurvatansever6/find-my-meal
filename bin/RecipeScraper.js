const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const allRecipes = JSON.parse(fs.readFileSync('allRecipes.json'));

console.log(allRecipes.length);
let recipes = [];

let recipe = {
    name: "",
    quantityIngredients: "",
    servings: "",
    prepTime: "",
    directions: "",
    ingredients: {
        keywords: [],
        fullDescription: []
    },
};

async function scrape(index) {
    const response = await axios.get(allRecipes[index]);
    const $ = cheerio.load(response.data);

    recipe.name = $('.svelte-1muv3s8').text();
    recipe.prepTime = $('dd.facts__value').eq(0).text().trim();
    recipe.quantityIngredients = $('dd.facts__value').eq(1).text().trim();
    recipe.servings = $('dd.facts__value').eq(2).text().trim();
    recipe.directions = $('.direction.svelte-5aqxnx').map((_, el) => $(el).text().trim()).get();

    $('.ingredient-list li').each((i, el) => {
        const quantity = $(el).find('.ingredient-quantity').text().trim();
        const unit = $(el).find('.ingredient-text a').first().text().trim();
        const text = $(el).find('.ingredient-text').contents().filter((_, c) => c.nodeType === 3).text().trim();
    
        if (quantity !== '') {
            const fullDescription = `${quantity} ${unit} ${text}`;
            recipe.ingredients.fullDescription.push(fullDescription.replace(/,/g, ''));
            
            if (unit !== ''){
                recipe.ingredients.keywords.push(unit);
            }
        }
    });

    recipes.push(recipe); 
    recipe = {
        name: "",
        quantityIngredients: "",
        servings: "",
        prepTime: "",
        directions: "",
        ingredients: {
            keywords: [],
            fullDescription: []
        },
    };
    console.log(recipes[index])
}


let promises = [];

for (let i = 0; i < 100; i++) {
    let promise = new Promise((resolve) => {
        setTimeout(() => {
            scrape(i);
            resolve();
        }, i * 500);
    });
    promises.push(promise);
}

Promise.all(promises).then(() => {
    fs.writeFile('Recipes.json', JSON.stringify(recipes), (err) => {
        if (err) throw err;
        console.log('Data written to file');
    });
});
