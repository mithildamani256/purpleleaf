import { scrapeWithPuppeteer } from "../../scraping_methods/puppeteer";

const scrape = async (URL: string) => {
    let val = await scrapeWithPuppeteer(URL);
    return val;
}

export const main = async () => {
    const URL = process.argv[2];  // Capture the URL from command-line arguments
    if (!URL) {
        return
    }
    const data = await scrape(URL);
    return data;
}
