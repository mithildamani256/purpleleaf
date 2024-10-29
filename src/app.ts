import { checkExistence } from "./database/operations/checkExistence";
import { retrieval } from "./database/operations/retrieval";
import { scrapeWithPuppeteer } from "./scraping_methods/puppeteer";
import {z} from 'Zod';
import { PageDataSchema } from "./types/page-data";

type PageData = z.infer<typeof PageDataSchema>;

const scrape = async (URL: string) => {
    try {
        let val: boolean = await checkExistence(URL);
        if (val) {
            let obj = await retrieval(URL);
            return obj;
        }
    }
    catch (e) {
        throw (e);
    }

    try {
        let val = await scrapeWithPuppeteer(URL);
        return val;
    } catch (e) {
        throw e;
    }
};

export const main = async () => {
    const URL = process.argv[2];

    if (!URL) {
        throw new Error("Please provide a valid URL!");
    }

    try {
        const data: PageData = await scrape(URL);
        return {data, URL};
    }
    catch (e) {
        throw(e);
    }
}