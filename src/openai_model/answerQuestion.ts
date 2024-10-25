import readline from 'readline';
import { main } from "../app";
import { answerQuestion } from './script';
import { ChatCompletionMessageParam } from "../../node_modules/openai/src/resources/chat/completions"
import { uploadChatHistory } from '../chatHistory/uploadChatHistory';

let chatHistory : Array<ChatCompletionMessageParam> = [];

const userInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

main().then(obj => {
    if(obj){
        userInterface.prompt();
        userInterface.on("line", async input => {
            chatHistory.push({ role: 'user', content: input });

            if (chatHistory.length > 10) {
                chatHistory.shift(); 
                chatHistory.shift();
            }

            let answer;
            if (obj.data) {
                answer = await answerQuestion(obj.data, input, chatHistory);
            }
           
            chatHistory.push({ role: 'assistant', content: answer });
            
            await uploadChatHistory(obj.URL, chatHistory);

            userInterface.prompt();
        })
    }
}).catch(error => console.error('Error:', error));