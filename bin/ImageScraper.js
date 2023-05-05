const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const links = JSON.parse(fs.readFileSync('../src/Links.json'));
const imageLinks = [];

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


async function scrape() {
    for (const link of links) {
        const response = await axios.get(link, { headers });
        const $ = cheerio.load(response.data);

        const imageLink = $('.svelte-wgcq7z img').attr('srcset').split(" ");
        imageLinks.push(imageLink[0]);
        console.log("scraping links...");

        // Add a delay of 1 second between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    fs.writeFile('../src/Images.json', JSON.stringify(imageLinks), (err) => {
        if (err) throw err;
        console.log('Data written to file');
    });
}

scrape();
