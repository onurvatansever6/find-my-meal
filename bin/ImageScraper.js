const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const links = JSON.parse(fs.readFileSync('../src/Links.json'));

  async function scrape() {
    const imageLinks = [];
  
    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      const response = await axios.get(link);
      const $ = cheerio.load(response.data);
  
      const imageLink = $('.svelte-wgcq7z img').attr('srcset').split(" ");
      imageLinks.push(imageLink[0]);
      console.log("scraping links..." + i);
    }
  
    fs.writeFile('../src/Images.json', JSON.stringify(imageLinks), { flag: 'a' }, (err) => {
      if (err) throw err;
      console.log('Data written to file');
    });
  }
  
  scrape();
  
