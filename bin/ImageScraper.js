const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const links = JSON.parse(fs.readFileSync('../src/Links.json'));

async function scrape() {
    const response = await axios.get(links[0]);
    const $ = cheerio.load(response.data);

    const imageLink = $('.svelte-kb6fq').attr('src');
    console.log(imageLink);
}

scrape();