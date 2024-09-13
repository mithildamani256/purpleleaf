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
const cheerio = require('cheerio');
const TurndownService = require('turndown');
const axios = require('axios');
let scrapeWithPuppeteer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const browser = yield puppeteer.launch({ headless: false, userDataDir: './user_data' });
        const page = yield browser.newPage();
        const URL = 'https://www.airbnb.co.in';
        yield page.setViewport({
            width: 1280,
            height: 800,
            deviceScaleFactor: 1
        });
        yield page.goto(URL, { waitUntil: 'networkidle2' });
        const bodyHTML = yield page.evaluate(() => document.body.innerHTML);
        const $ = cheerio.load(bodyHTML);
        $('script, style, img, a').remove();
        // Get the cleaned-up HTML
        const cleanHTML = $('body').html();
        // Convert to markdown using Turndown
        const turndownService = new TurndownService();
        const markdown = turndownService.turndown(cleanHTML);
        console.log(markdown);
        yield browser.close();
    }
    catch (e) {
        console.log(e);
    }
});
let main_actual = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const URL = 'https://www.airbnb.co.in';
        // Fetch the HTML using axios
        const { data: bodyHTML } = yield axios.get(URL);
        // Load the bodyHTML into Cheerio for parsing
        const $ = cheerio.load(bodyHTML);
        // Remove unwanted tags
        $('script, style, img, a').remove();
        // Get the cleaned-up HTML
        const cleanHTML = $('body').html();
        // Check the length of cleanHTML
        if (cleanHTML && cleanHTML.length < 200) {
            console.log("Clean HTML is too short, switching to Puppeteer...");
            yield scrapeWithPuppeteer();
        }
        else {
            // Convert to markdown using Turndown
            const turndownService = new TurndownService();
            const markdown = turndownService.turndown(cleanHTML);
            console.log(markdown.length);
        }
    }
    catch (e) {
        console.log(e);
    }
});
let main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield main_actual();
});
main();
