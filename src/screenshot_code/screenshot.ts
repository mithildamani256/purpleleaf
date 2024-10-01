import * as puppeteer from 'puppeteer';

export const screenshot = async ( URL : string ) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setViewport({ width: 1280, height: 1024 });
    await page.goto( URL, {
        waitUntil: ["load", "domcontentloaded"],
    });

    await scroll(page);

    const page_promise = page.screenshot({
        type: "png",
        fullPage: true,
    });

    return page_promise;
};

async function scroll( page:puppeteer.Page ) {
    return await page.evaluate(async () => {
        return await new Promise((resolve, reject) => {
            var i = setInterval(() => {
                window.scrollBy(0, window.innerHeight);
                if (document.scrollingElement) {
                    if (document.scrollingElement.scrollTop + window.innerHeight >= document.scrollingElement.scrollHeight){
                        window.scrollTo(0, 0);
                        clearInterval(i);
                        resolve(null);
                    }
                }
            }, 100);
        });
    });
}