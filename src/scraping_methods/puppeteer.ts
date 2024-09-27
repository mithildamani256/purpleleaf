import cheerio from 'cheerio';
import * as puppeteer from 'puppeteer';
import TurndownService from 'turndown';
import { PageDataSchema } from '../types/page-data';
import { storage } from '../database/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export const scrapeWithPuppeteer = async (URL: string) => {
    try {
        const browser = await puppeteer.launch({ headless: false, userDataDir: './user_data' });
        const page = await browser.newPage();
        await page.setViewport({
            width: 1280,
            height: 800,
            deviceScaleFactor: 1
        });
        await page.goto(URL, { waitUntil: ["load", "domcontentloaded"] });

        const bodyHTML = await page.evaluate(() => document.body.innerHTML);
        const $ = cheerio.load(bodyHTML);

        $('script, style, img, a').remove();

        // Get the cleaned-up HTML
        const cleanHTML = $('body').html() || "";

        const headHTML = await page.evaluate(() => document.head.innerHTML);
        const $1 = cheerio.load(headHTML);

        const head = $1('head');

        const title = head.find('title').text() || 'no title p';
        const description = head.find('meta[name="description"]').attr('content') || 'no desc p';
        const keywords = head.find('meta[name="keywords"]').attr('content') || 'no keywords p';

        // Convert to markdown using Turndown
        const turndownService = new TurndownService();
        const markdown = turndownService.turndown(cleanHTML);
        
        if (markdown.length < 1500) {
            throw new Error(`Markdown length is too short: ${markdown.length} characters. Minimum required is 1500.`);
        }
        else {
            const markdownFileRef = ref(storage, `markdowns/pageInfo_${Date.now()}.md`);
            const markdownBuffer = Buffer.from(markdown, 'utf-8');
            await uploadBytes(markdownFileRef, markdownBuffer);

            const screenshotBuffer = await page.screenshot({ fullPage: true });
            const screenshotFileRef = ref(storage, `screenshots/screenshot_${Date.now()}.png`);
            await uploadBytes(screenshotFileRef, screenshotBuffer);

            const screenshotUrl = await getDownloadURL(screenshotFileRef);

            const pageData = PageDataSchema.parse({
                    title,
                    description,
                    keywords,
                    markdown,
                    screenshot : screenshotUrl
            });
            
             await browser.close();

            return pageData;
        }
    } catch (e) {
        console.log(e);
    }
}