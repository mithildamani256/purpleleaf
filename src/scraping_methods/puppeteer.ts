import * as puppeteer from 'puppeteer';
const cheerio = require('cheerio');
const TurndownService = require('turndown');
import {z} from 'Zod';
const fs = require('fs');

export const PageDataSchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    keywords: z.string().optional(),
    bodyHTML: z.string(),
    bodyMarkdown: z.string(),
});


export const scrapeWithPuppeteer = async (URL: string) => {
    try {
        const browser = await puppeteer.launch({ headless: false, userDataDir: './user_data' });
        const page = await browser.newPage();
        await page.setViewport({
            width: 1280,
            height: 800,
            deviceScaleFactor: 1
        });
        await page.goto(URL, { waitUntil: 'networkidle2' });

        const screenshotPath = `C:\\Users\\DELL\\Desktop\\purpleleaf\\screenshots\\screenshot_${Date.now()}.png`;  // Save the file with a timestamp to avoid overwriting
        await page.screenshot({ path: screenshotPath, fullPage: true });

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

                // Save the website info in a markdown file
        const markdownContent = `
            # ${pageData.title}
                
            **Description**: ${pageData.description}
                
            **Keywords**: ${pageData.keywords}
                
            ---
                
            ## Content:
                
            ${pageData.bodyMarkdown}
        `;
                       
        const markdownPath = `C:\\Users\\DELL\\Desktop\\purpleleaf\\markdowns\\pageInfo_${Date.now()}.md`;  // Save the markdown file with a timestamp
        fs.writeFileSync(markdownPath, markdownContent);

        await browser.close();

        return pageData;
    } catch (e) {
        console.log(e);
    }
}