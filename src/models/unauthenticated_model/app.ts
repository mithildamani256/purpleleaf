import { scrapeWithPuppeteer } from "../../scraping_methods/puppeteer";
import { scrapewithAxios } from "../../scraping_methods/axios";

const main_actual = async (URL: string) => {
    let val = await scrapewithAxios(URL);
    if (val == undefined) {
        val = await scrapeWithPuppeteer(URL);
    }
    return val;
}
export const main = async () => {
    const URL = process.argv[2];  // Capture the URL from command-line arguments
    if (!URL) {
        return
    }
    const data = await main_actual(URL);
    return data;
}
