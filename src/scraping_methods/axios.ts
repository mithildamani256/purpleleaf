import cheerio from 'cheerio';
import TurndownService from 'turndown';
import axios from 'axios';
import { PageDataSchema } from '../types/page-data';
import { storage } from '../database/firebase';
import { ref, uploadBytes } from 'firebase/storage';

export const scrapewithAxios = async (URL: string) => {
    try {
    // Fetch the HTML using axios
    const { data: bodyHTML } = await axios.get(URL);

    // Load the bodyHTML into Cheerio for parsing
    const $ = cheerio.load(bodyHTML);

    // Remove unwanted tags
    $('script, style, img, a').remove();

    // Get the cleaned-up HTML
    const cleanHTML = $('body').html() || "";
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
        markdown
    });

    if(markdown.length < 2500){
        return undefined;
    }
    else {  
        const markdownFileRef = ref(storage, `markdowns/pageInfo_${Date.now()}.md`);
        const markdownBuffer = Buffer.from(markdown, 'utf-8');
        await uploadBytes(markdownFileRef, markdownBuffer);

        return pageData; 
    }
} catch (e) {
    console.log(e);
}
}