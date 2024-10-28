import * as cheerio from 'cheerio';
import * as puppeteer from 'puppeteer';
import TurndownService from 'turndown';
import { PageDataSchema } from '../types/page-data';
import { screenshot } from '../screenshot_code/screenshot';
import { storeMarkdownInFirestore, storeScreenshotAndUrlInFirestore } from '../database/operations/storage'

export const scrapeWithPuppeteer = async (link: string) => {
    try {
        const browser = await puppeteer.launch({ headless: false, userDataDir: './user_data' });
        const page = await browser.newPage();
        await page.setViewport({
            width: 1280,
            height: 800,
            deviceScaleFactor: 1
        });
        await page.goto(link, { waitUntil: ["load", "domcontentloaded"] });

        const bodyHTML = await page.evaluate(() => document.body.innerHTML);
        const $ = cheerio.load(bodyHTML);

        $('script, style, img, a').remove();

        const cleanHTML = $('body').html() || "";

        const headHTML = await page.evaluate(() => document.head.innerHTML);
        const $1 = cheerio.load(headHTML);

        const head = $1('head');

        const title = head.find('title').text() || 'no title p';
        const description = head.find('meta[name="description"]').attr('content') || 'no desc p';
        const keywords = head.find('meta[name="keywords"]').attr('content') || 'no keywords p';

        const turndownService = new TurndownService();
        const markdown = turndownService.turndown(cleanHTML);
        
        if (markdown.length < 1500) {
            throw new Error(`Markdown length is too short: ${markdown.length} characters. Minimum required is 1500.`);
        }
        else {
            const screenshotBuffer = await screenshot(link);
            const parsedUrl = new URL(link);
            const websiteName = parsedUrl.hostname;

            await storeMarkdownInFirestore(markdown, link, websiteName);
            const screenshotUrl = await storeScreenshotAndUrlInFirestore(screenshotBuffer, link, websiteName);

            const pageData = PageDataSchema.parse({
                title,
                description,
                keywords,
                markdown,
                screenshot: screenshotUrl
            });
            
            await browser.close();

            return pageData;
        }
    } catch (e) {
        throw new Error(`There is an issue with the scraping function and the issue is : ${e}`  )
    }
}