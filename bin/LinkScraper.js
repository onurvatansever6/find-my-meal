const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const topLinks = [
    "https://www.food.com/ideas/top-breakfast-recipes-6935#c-796349",
    "https://www.food.com/ideas/easy-lunch-recipes-7007?ref=nav",
    "https://www.food.com/ideas/top-appetizer-recipes-7009?ref=nav",
    "https://www.food.com/ideas/all-time-best-dinner-recipes-6009?ref=nav",
    "https://www.food.com/ideas/top-dessert-recipes-6930?ref=nav",
    "https://www.food.com/ideas/summer-cocktails-drinks-6268?ref=nav",
    "https://www.food.com/ideas/50-ultimate-side-dishes-6395?ref=nav",
    "https://www.food.com/ideas/top-grilling-recipes-6974#c-810337",
    "https://www.food.com/ideas/25-microwave-meals-for-busy-moms-6088?ref=nav",
    "https://www.food.com/ideas/top-sheet-pan-recipes-6836",
    "https://www.food.com/ideas/slow-cooker-recipes-and-crock-pot-recipes-6017#c-626363",
    "https://www.food.com/ideas/best-air-fryer-recipes-6847?ref=nav",
    "https://www.food.com/ideas/best-instant-pot-recipes-6928?ref=nav",
    "https://www.food.com/ideas/top-dessert-recipes-6930",
    "https://www.food.com/ideas/quick-easy-chicken-dinners-6013?ref=nav",
    "https://www.food.com/ideas/best-salmon-recipes-6370?ref=nav",
    "https://www.food.com/ideas/best-baked-pork-chops-6369?ref=nav",
    "https://www.food.com/ideas/quick-easy-ground-beef-dinners-6011?ref=nav",
    "https://www.food.com/ideas/top-shrimp-recipes-6566?ref=nav",
    "https://www.food.com/ideas/keto-recipes-6652?ref=nav",
    "https://www.food.com/ideas/top-healthy-recipes-6926#c-789404",
    "https://www.food.com/ideas/vegetarian-recipes-6323#c-605350",
    "https://www.food.com/ideas/best-vegan-recipes-6213?ref=nav",
    "https://www.food.com/ideas/mediterranean-diet-recipes-6794?ref=nav",
    "https://www.food.com/ideas/favorite-weight-watcher-recipes-6010#c-947",
    "https://www.food.com/ideas/low-carb-recipes-6118?ref=nav",
    "https://www.food.com/ideas/gluten-free-essentials-6320#c-20426",
    "https://www.food.com/ideas/mexican-food-at-home-6830?ref=nav",
    "https://www.food.com/ideas/italian-food-recipes-at-home-6828?ref=nav",
    "https://www.food.com/ideas/indian-food-recipes-at-home-6821?ref=nav",
    "https://www.food.com/ideas/thai-food-recipes-at-home-6820?ref=nav",
    "https://www.food.com/ideas/korean-food-recipes-at-home-7143?ref=nav",
    "https://www.food.com/ideas/french-food-at-home-7129?ref=nav",
    "https://www.food.com/ideas/best-latin-american-recipes-7133?ref=nav",
    "https://www.food.com/ideas/chinese-food-at-home-6807?ref=nav",
    "https://www.food.com/ideas/japanese-food-recipes-at-home-7140?ref=nav",
    "https://www.food.com/ideas/spanish-food-recipes-at-home-7122?ref=nav"
]

async function scrape() {
    const allRecipelLinks = [];
    for (const link of topLinks) {
        const response = await axios.get(link);
        const $ = cheerio.load(response.data);

        const tempLinks = $('.title a').map((_, el) => $(el).attr('href')).get();
        allRecipelLinks.push(...new Set(tempLinks));
    }

    fs.writeFile('./src/Links.json', JSON.stringify(allRecipelLinks), (err) => {
        if (err) throw err;
        console.log('Data written to file');
    });
}

scrape(topLinks);