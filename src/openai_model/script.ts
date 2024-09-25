import { main } from "../models/unauthenticated_model/app";
import { Configuration, OpenAIApi } from 'openai';
import {z} from 'Zod';
import * as dotenv from 'dotenv';
import { PageDataSchema } from "../scraping_methods/puppeteer";
import readline from 'readline';
dotenv.config();

const key = process.env.API_KEY;
const configuration = new Configuration({
    apiKey: key,
});
const openai = new OpenAIApi(configuration);

type PageData = z.infer<typeof PageDataSchema>;

const userInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

async function answerQuestion(pageData : PageData , question : string) {
    // Create a prompt by combining page data fields
    const prompt = `
    As a large language model that is unaware of anything, just use the given data to answer the questions. 
    Description: ${pageData.description || "No description provided."}

    Question: ${question}
    Answer:
    `;

    // Make the API call to OpenAI
    const response = await openai.createCompletion({
        model: "gpt-4o-mini",
        prompt: prompt,
        max_tokens: 2000, // Adjust the token count as needed
        temperature: 0.5,
    });

    return response.data.choices[0];

}


main().then(data => {
    const myData: { title: string; bodyHTML: string; bodyMarkdown: string; description?: string; keywords?: string; } | undefined = data;
    if(myData){
        userInterface.prompt();
        userInterface.on("line" , async input => {
            await answerQuestion(myData, input);
            userInterface.prompt();
        })
    }

}).catch(error => console.error('Error:', error));