import readline from 'readline';
import { main } from "../models/unauthenticated_model/app";
import { answerQuestion } from './script';
import { ChatCompletionMessageParam } from "../../node_modules/openai/src/resources/chat/completions"

let chatHistory:Array<ChatCompletionMessageParam> = [];

const userInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

main().then(data => {
    if(data){
        userInterface.prompt();
        userInterface.on("line", async input => {
            chatHistory.push({ role: 'user', content: input });
            const answer = await answerQuestion(data, input, chatHistory);
            chatHistory.push({ role: 'assistant', content: answer });
            userInterface.prompt();
        })
    }
}).catch(error => console.error('Error:', error));