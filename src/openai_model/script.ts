import { main } from "../models/unauthenticated_model/app";
import {z} from 'Zod';
import * as dotenv from 'dotenv';
import { PageDataSchema } from "../types/page-data";
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
const deployment : string = process.env.AZURE_OPENAI_CHAT_COMPLETION_MODEL_DEPLOYMENT_ID || ""; 

const client = new OpenAIClient(endpoint, new AzureKeyCredential(apiKey));

async function answerQuestion(pageData : PageData , question : string) {
    const systemMessage = "Act as a large language model that is unaware of everything, just use the given title, description and keywords to answer the question. For questions that are unrelated, answer back by saying that you are not aware of the answer.";
    const userMessage = 
    `Title: ${pageData.title || "No Ttile provided."}
    Description: ${pageData.description || "No description provided."}
    Keywords: ${pageData.keywords || "No Keywords provided."}
    screenshotURL : ${pageData.screenshot || "No image available"}

    Question: ${question}
    Answer:
    `;

    const messages = [
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
    if(data){
        userInterface.prompt();
        userInterface.on("line" , async input => {
            await answerQuestion(data, input);
            userInterface.prompt();
        })
    }
}).catch(error => console.error('Error:', error));