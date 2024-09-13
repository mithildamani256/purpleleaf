import * as puppeteer from 'puppeteer';
import { username, password } from './secrets';

let authenticate = async (page : puppeteer.Page) => {

    try{
    const inputSelector = 'input'; // Modify this selector if necessary
    await page.waitForSelector(inputSelector, { visible: true, timeout: 10000 });
    const usernameInputs = await page.$$(inputSelector);
    if (usernameInputs.length > 0) {
        const usernameInput = usernameInputs[0]; // Change the index if necessary
        await usernameInput.focus();
        await page.keyboard.type(username);
        console.log('Focused on input element:', usernameInput);
    } else {
        console.log('No input elements found');
    }

    const buttonSelector = '.css-175oi2r.r-sdzlij.r-1phboty.r-rs99b7.r-lrvibr.r-ywje51.r-184id4b.r-13qz1uu.r-2yi16.r-1qi8awa.r-3pj75a.r-1loqt21.r-o7ynqc.r-6416eg.r-1ny4l3l';
    await page.waitForSelector(buttonSelector, { visible: true, timeout: 10000 });
    // Select all matching input elements
    const button = await page.$$(buttonSelector);
    if (button.length > 0) {
        const buttonClick = button[0]; // Change the index if necessary
        await buttonClick.click();
        console.log('Focused on button element:', buttonClick);
    } else {
        console.log('No button elements found');
    }

    await page.waitForSelector(inputSelector, { visible: true, timeout: 10000 });
    const pws = await page.$$(inputSelector);
    if (pws.length > 0) {
        const usernameInput = pws[1]; // Change the index if necessary
        await usernameInput.focus();
        await page.keyboard.type(password);
        await page.keyboard.press('Enter');
        console.log('Focused on input element:', usernameInput);
    } else {
        console.log('No input elements found');
    }
}
 catch (e) {
    console.log('Error during authentication:', e);
}
}

let navigateToPage = async (page : puppeteer.Page, URL: string) => {
    await page.goto(URL, {waitUntil: 'networkidle2'});
}

let extractSpanText = async (page: puppeteer.Page) => {
    try {
        // Select all the div elements
        const divs = await page.$$('div.css-146c3p1.r-8akbws.r-krxsd3.r-dnmrzs.r-1udh08x.r-bcqeeo.r-1ttztb7.r-qvutc0.r-37j5jr.r-a023e6.r-rjixqe.r-16dba41.r-bnwqim');
        
        // Iterate over each div
        for (const div of divs) {
            // Extract the text content from each span within the div
            const spanTexts = await div.$$eval('span', spans => spans.map(span => span.textContent?.trim()).filter(text => text));
            
            // Log the extracted texts
            console.log(spanTexts);
        }
    } catch (e) {
        console.log('Error during text extraction:', e);
    }
}



let main_actual = async() => {
    try{
        const browser = await puppeteer.launch({ headless : false, userDataDir: './user_data'});
        const page = await browser.newPage();
        const URL = 'https://twitter.com/login'

        await page.setViewport({
            width: 1280, height: 800,
            deviceScaleFactor: 1
        })
        await page.goto(URL, {waitUntil: 'networkidle2'});
        // await authenticate(page);
        // await page.waitForSelector('div[data-testid="SideNav_AccountSwitcher_Button"]', { visible: true, timeout: 10000 });
        await navigateToPage(page, 'https://twitter.com/indy_with/status/1401990319529463815/likes');

        await extractSpanText(page);
    }
    catch(e){
        console.log(e)
    }
}

let main = async () => {
    await main_actual();
}

main();