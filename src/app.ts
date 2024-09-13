import * as puppeteer from 'puppeteer';
const cheerio = require('cheerio');
const TurndownService = require('turndown');
const axios = require('axios');
import {z} from 'Zod';

const PageDataSchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    keywords: z.string().optional(),
    bodyHTML: z.string(),
    bodyMarkdown: z.string(),
});


let scrapeWithPuppeteer = async () => {
    try {
        const browser = await puppeteer.launch({ headless: false, userDataDir: './user_data' });
        const page = await browser.newPage();
        const URL = 'https://www.willow.tv/tvchannel';
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

        const headHTML = await page.evaluate(() => document.head.innerHTML);
        const $1 = cheerio.load(headHTML);

        const head = $1('head');

        const title = head.find('title').text() || 'no title p';
        const description = head.find('meta[name="description"]').attr('content') || 'no desc p';
        const keywords = head.find('meta[name="keywords"]').attr('content') || 'no keywords p';

        // Convert to markdown using Turndown
        const turndownService = new TurndownService();
        const markdown = turndownService.turndown(cleanHTML);

        const pageData = PageDataSchema.parse({
            title,
            description,
            keywords,
            bodyHTML: cleanHTML,
            bodyMarkdown: markdown
        });

        await browser.close();

        return pageData;
    } catch (e) {
        console.log(e);
    }
}

let main_actual = async () => {
    try {
        const URL = 'https://www.willow.tv/tvchannel';

        // Fetch the HTML using axios
        const { data: bodyHTML } = await axios.get(URL);

        // Load the bodyHTML into Cheerio for parsing
        const $ = cheerio.load(bodyHTML);

        // Remove unwanted tags
        $('script, style, img, a').remove();

        // Get the cleaned-up HTML
        const cleanHTML = $('body').html();
        const head = $('head')

        const title = head.find('title').text() || 'no title p';
        const description = head.find('meta[name="description"]').attr('content') || 'no desc p';
        const keywords = head.find('meta[name="keywords"]').attr('content') || 'no keywords p';

        // // Convert to markdown using Turndown
        const turndownService = new TurndownService();
        const markdown = turndownService.turndown(cleanHTML);

        const pageData = PageDataSchema.parse({
            title,
            description,
            keywords,
            bodyHTML: cleanHTML,
            bodyMarkdown: markdown
        });

        if(markdown.length < 2000){
            return scrapeWithPuppeteer();
        }
        else{
            return pageData; 
        }

    } catch (e) {
        console.log(e);
    }
}

let main = async () => {
    await main_actual();
}

main();
