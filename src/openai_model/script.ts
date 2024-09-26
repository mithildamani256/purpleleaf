import { main } from "../models/unauthenticated_model/app";
import {z} from 'Zod';
import * as dotenv from 'dotenv';
import { PageDataSchema } from "../scraping_methods/puppeteer";
import readline from 'readline';
import { OpenAIClient , AzureKeyCredential} from '@azure/openai';
dotenv.config();

type PageData = z.infer<typeof PageDataSchema>;

const userInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const endpoint:string = process.env["AZURE_OPENAI_ENDPOINT"] || "";
const apiKey : string = process.env["AZURE_OPENAI_API_KEY"] || "";
const apiVersion = "2024-05-01-preview";
const deployment : string = process.env.AZURE_OPENAI_CHAT_COMPLETION_MODEL_DEPLOYMENT_ID || ""; 

const client = new OpenAIClient(endpoint, new AzureKeyCredential(apiKey));

async function answerQuestion(pageData : PageData , question : string) {
    const systemMessage = "Act as a large language model that is unaware of everything, just use the given description to answer the question. For questions that are unrelated to the description, answer back by saying that you are not aware of the answer.";
    const userMessage = 
    `Description: ${pageData.description || "No description provided."}
    Question: ${question}
    Answer:
    `;

    let messages = [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage },
      ];

    const result = await client.getChatCompletions( deployment, messages, { maxTokens: 200 });

    if(result){
        const answer = result.choices[0].message?.content;
        console.log(answer);
    }
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