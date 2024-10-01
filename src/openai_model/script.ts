import {z} from 'Zod';
import * as dotenv from 'dotenv';
import { PageDataSchema } from "../types/page-data";
import { AzureOpenAI } from "openai";
import { ChatCompletionMessageParam } from "../../node_modules/openai/src/resources/chat/completions"
dotenv.config();

type PageData = z.infer<typeof PageDataSchema>;

const endpoint:string = process.env["AZURE_OPENAI_ENDPOINT"] || "";
const apiKey: string = process.env["AZURE_OPENAI_API_KEY"] || "";
const apiVersion: string = process.env["AZURE_OPENAI_API_VERSION"] || "";
const deployment : string = process.env.AZURE_OPENAI_CHAT_COMPLETION_MODEL_DEPLOYMENT_ID || ""; 

const options = { apiKey, deployment, endpoint, apiVersion }

const client = new AzureOpenAI(options);

export async function answerQuestion(pageData : PageData , question : string, chatHistory : Array<ChatCompletionMessageParam> ) {
    const systemMessage = "Act as a large language model that is unaware of everything, just use the given title, description and keywords to answer the question. For questions that are unrelated, answer back by saying that you are not aware of the answer.";
    const userMessage =      
    `Title: ${pageData.title || "No Ttile provided."}
    Description: ${pageData.description || "No description provided."}
    Keywords: ${pageData.keywords || "No Keywords provided."}
    screenshotURL : ${pageData.screenshot || "No image available"}
    Question: ${question}
    Answer:
    `;

    const messages : Array<ChatCompletionMessageParam>= [
        { content: userMessage, role: 'user' },
        ...chatHistory,
        { content: systemMessage, role: 'system'}
    ];
    
    const val  = {messages, max_tokens: 200, model: deployment} 

    const result = await client.chat.completions.create(val);

    if(result){
        const answer = result.choices[0].message.content;
        console.log(answer);

        return answer;
    }
}
