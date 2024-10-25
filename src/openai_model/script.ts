import {z} from 'Zod';
import * as dotenv from 'dotenv';
import { PageDataSchema } from "../types/page-data";
import { AzureOpenAI } from "openai";
import { ChatCompletionMessageParam } from "../../node_modules/openai/src/resources/chat/completions"
dotenv.config();

type PageData = z.infer<typeof PageDataSchema>;

const endpoint: string = process.env["AZURE_OPENAI_ENDPOINT"] || "";
const apiKey: string = process.env["AZURE_OPENAI_API_KEY"] || "";
const apiVersion: string = process.env["AZURE_OPENAI_API_VERSION"] || "";
const deployment : string = process.env.AZURE_OPENAI_CHAT_COMPLETION_MODEL_DEPLOYMENT_ID || ""; 

const options = { apiKey, deployment, endpoint, apiVersion }

const client = new AzureOpenAI(options);

export async function answerQuestion(pageData : PageData , question : string, chatHistory : Array<ChatCompletionMessageParam> ) {
    const systemMessage = "Act as a large language model that is aware of general knowledge relevant to the provided website, but exclusively use the given title, description, keywords, screenshot, question, and messages array to answer questions. For any questions unrelated to the provided website or outside the information given, respond by saying that you are unable to answer due to insufficient details from the provided website."
    const userMessage =      
    `Title: ${pageData.title || "No Ttile provided."}
    Description: ${pageData.description || "No description provided."}
    Keywords: ${pageData.keywords || "No Keywords provided."}
    Question: ${question}
    Answer:
    `;

    const messages : Array<ChatCompletionMessageParam>= [
        { content: systemMessage, role: 'system' },
        ...chatHistory,
        { content: [{type: 'text', text: userMessage}, {type: 'image_url', image_url: {"url" : pageData.screenshot || ""}}], role: 'user' }
    ];
    
    const result = await client.chat.completions.create( {messages, max_tokens: 200, model: deployment} );

    if(result){
        const answer = result.choices[0].message.content;

        return answer;
    }
}
