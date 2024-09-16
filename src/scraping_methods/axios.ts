import * as puppeteer from 'puppeteer';
const cheerio = require('cheerio');
const TurndownService = require('turndown');
const axios = require('axios');
import {z} from 'Zod';
const fs = require('fs');

const PageDataSchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    keywords: z.string().optional(),
    bodyHTML: z.string(),
    bodyMarkdown: z.string(),
});

export const scrapewithAxios = async (URL: string) => {
    try {
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
        return "";
    }
    else{             // Save the website info in a markdown file
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
        return pageData; 
    }

} catch (e) {
    console.log(e);
}
}