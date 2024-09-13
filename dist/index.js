"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer = __importStar(require("puppeteer"));
const secrets_1 = require("./secrets");
let authenticate = (page) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const inputSelector = 'input'; // Modify this selector if necessary
        yield page.waitForSelector(inputSelector, { visible: true, timeout: 10000 });
        const usernameInputs = yield page.$$(inputSelector);
        if (usernameInputs.length > 0) {
            const usernameInput = usernameInputs[0]; // Change the index if necessary
            yield usernameInput.focus();
            yield page.keyboard.type(secrets_1.username);
            console.log('Focused on input element:', usernameInput);
        }
        else {
            console.log('No input elements found');
        }
        const buttonSelector = '.css-175oi2r.r-sdzlij.r-1phboty.r-rs99b7.r-lrvibr.r-ywje51.r-184id4b.r-13qz1uu.r-2yi16.r-1qi8awa.r-3pj75a.r-1loqt21.r-o7ynqc.r-6416eg.r-1ny4l3l';
        yield page.waitForSelector(buttonSelector, { visible: true, timeout: 10000 });
        // Select all matching input elements
        const button = yield page.$$(buttonSelector);
        if (button.length > 0) {
            const buttonClick = button[0]; // Change the index if necessary
            yield buttonClick.click();
            console.log('Focused on button element:', buttonClick);
        }
        else {
            console.log('No button elements found');
        }
        yield page.waitForSelector(inputSelector, { visible: true, timeout: 10000 });
        const pws = yield page.$$(inputSelector);
        if (pws.length > 0) {
            const usernameInput = pws[1]; // Change the index if necessary
            yield usernameInput.focus();
            yield page.keyboard.type(secrets_1.password);
            yield page.keyboard.press('Enter');
            console.log('Focused on input element:', usernameInput);
        }
        else {
            console.log('No input elements found');
        }
    }
    catch (e) {
        console.log('Error during authentication:', e);
    }
});
let navigateToPage = (page, URL) => __awaiter(void 0, void 0, void 0, function* () {
    yield page.goto(URL, { waitUntil: 'networkidle2' });
});
let extractSpanText = (page) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Select all the div elements
        const divs = yield page.$$('div.css-146c3p1.r-8akbws.r-krxsd3.r-dnmrzs.r-1udh08x.r-bcqeeo.r-1ttztb7.r-qvutc0.r-37j5jr.r-a023e6.r-rjixqe.r-16dba41.r-bnwqim');
        // Iterate over each div
        for (const div of divs) {
            // Extract the text content from each span within the div
            const spanTexts = yield div.$$eval('span', spans => spans.map(span => { var _a; return (_a = span.textContent) === null || _a === void 0 ? void 0 : _a.trim(); }).filter(text => text));
            // Log the extracted texts
            console.log(spanTexts);
        }
    }
    catch (e) {
        console.log('Error during text extraction:', e);
    }
});
let main_actual = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const browser = yield puppeteer.launch({ headless: false, userDataDir: './user_data' });
        const page = yield browser.newPage();
        const URL = 'https://twitter.com/login';
        yield page.setViewport({
            width: 1280, height: 800,
            deviceScaleFactor: 1
        });
        yield page.goto(URL, { waitUntil: 'networkidle2' });
        // await authenticate(page);
        // await page.waitForSelector('div[data-testid="SideNav_AccountSwitcher_Button"]', { visible: true, timeout: 10000 });
        yield navigateToPage(page, 'https://twitter.com/indy_with/status/1401990319529463815/likes');
        yield extractSpanText(page);
    }
    catch (e) {
        console.log(e);
    }
});
let main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield main_actual();
});
main();
