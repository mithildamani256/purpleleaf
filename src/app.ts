import { scrapeWithPuppeteer } from "./scraping_methods/puppeteer";

const scrape = async (URL: string) => {
    let val;
    try {
        val = await scrapeWithPuppeteer(URL);
    } catch (e) {
        throw e;
    }
    
    return val;
};

export const main = async () => {
    const URL = process.argv[2];

    if (!URL) {
        throw new Error("Please provide a valid URL!");
    }

    try {
        const data = await scrape(URL);
        return {data, URL};
    }
    catch (e) {
        throw(e);
    }
}
