import * as puppeteer from 'puppeteer';
const cheerio = require('cheerio');
const TurndownService = require('turndown');
const axios = require('axios');

let scrapeWithPuppeteer = async () => {
    try {
        const browser = await puppeteer.launch({ headless: false, userDataDir: './user_data' });
        const page = await browser.newPage();
        const URL = 'https://www.airbnb.co.in';
        await page.setViewport({
            width: 1280,
            height: 800,
            deviceScaleFactor: 1
        });
        await page.goto(URL, { waitUntil: 'networkidle2' });

        const bodyHTML = await page.evaluate(() => document.body.innerHTML);
        const $ = cheerio.load(bodyHTML);
        $('script, style, img, a').remove();

        // Get the cleaned-up HTML
        const cleanHTML = $('body').html();

        // Convert to markdown using Turndown
        const turndownService = new TurndownService();
        const markdown = turndownService.turndown(cleanHTML);

        console.log(markdown);
        await browser.close();
    } catch (e) {
        console.log(e);
    }
}

let main_actual = async () => {
    try {
        const URL = 'https://www.airbnb.co.in';

        // Fetch the HTML using axios
        const { data: bodyHTML } = await axios.get(URL);

        // Load the bodyHTML into Cheerio for parsing
        const $ = cheerio.load(bodyHTML);

        // Remove unwanted tags
        $('script, style, img, a').remove();

        // Get the cleaned-up HTML
        const cleanHTML = $('body').html();

        // Check the length of cleanHTML
        if (cleanHTML && cleanHTML.length < 200) {
            console.log("Clean HTML is too short, switching to Puppeteer...");
            await scrapeWithPuppeteer();
        } else {
            // Convert to markdown using Turndown
            const turndownService = new TurndownService();
            const markdown = turndownService.turndown(cleanHTML);

            console.log(markdown.length);

        }
    } catch (e) {
        console.log(e);
    }
}

let main = async () => {
    await main_actual();
}

main();
