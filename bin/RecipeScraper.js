const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const links = JSON.parse(fs.readFileSync('Links.json'));

console.log(links.length);
let recipes = [];

const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-US,en;q=0.5',
    'Referer': 'https://www.google.com/',
    'DNT': '1',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
  };


  async function scrape(index) {
    const response = await axios.get(links[index], { headers });
    const $ = cheerio.load(response.data);

    const recipe = {
        name: $('.svelte-1muv3s8').text(),
        prepTime: $('dd.facts__value').eq(0).text().trim(),
        quantityIngredients: $('dd.facts__value').eq(1).text().trim(),
        servings: $('dd.facts__value').eq(2).text().trim(),
        directions: $('.direction.svelte-ovaflp').map((_, el) => $(el).text().trim()).get(),
        ingredients: {
            keywords: [],
            fullDescription: []
        },
    };

    $('.ingredient-list li').each((i, el) => {
        const quantity = $(el).find('.ingredient-quantity').text().trim();
        const unit = $(el).find('.ingredient-text a').first().text().trim();
        const text = $(el).find('.ingredient-text').contents().filter((_, c) => c.nodeType === 3).text().trim();
    
        if (quantity !== '') {
            let fullDescription = `${quantity} ${unit} ${text}`;
            fullDescription = fullDescription.replace(/,/g, '');
            fullDescription = fullDescription.replace(/\s+/g, ' ');
            fullDescription = fullDescription.replace(/(\d+)\s*-\s*(\d+)/g, '$1-$2');
            recipe.ingredients.fullDescription.push(fullDescription);
            
            if (unit !== ''){
                recipe.ingredients.keywords.push(unit);
            }
        }
    });

    return recipe;
}



let promises = [];

for (let i = 0; i < links.length; i++) {
    let promise = new Promise((resolve) => {
        setTimeout(() => {
            scrape(i).then((recipe) => {
                recipes.push(recipe);
                console.log(recipe);
                resolve();
            });
        }, i * 500);
    });
    promises.push(promise);
    
    if ((i + 1) % 100 === 0 || i === links.length - 1) {
        Promise.all(promises).then(() => {
            fs.writeFileSync('Recipes.json', JSON.stringify(recipes), { flag: 'a' });
            console.log(`Data written to file for recipes ${i - 99} to ${i}`);
            recipes = [];
        });
        promises = [];
    }
}

