import readline from 'readline';
import { main } from "../app";
import { answerQuestion } from './script';
import { ChatCompletionMessageParam } from "../../node_modules/openai/src/resources/chat/completions"
import { getChatHistory } from '../database/operations/chatFunctionality/getChatHistory';
import { uploadChatHistory } from '../database/operations/chatFunctionality/uploadChatHistory';

let chatHistory : Array<ChatCompletionMessageParam> = [];

const userInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

main().then(obj => {
    userInterface.prompt();
    userInterface.on("line", async input => {
        chatHistory = [];
        // so whenever a question is asked, you first make an api call to get the last 5 questions
        // + the chat summary. 
        // say a user has only asked 1 question, in that case, chat summary would be empty. 
        // say a user has asked 12 questions and is asking the 13th one. in this case, the chat summary here
        // should hold the summary for the first 8 questions and chathistory should hold the last 5 questions.
        // you pass this to the api now. 
        
        // there will be an api call here. this will get me the chatSummary and the chatHistory based on the website URL.
        let current: Array<ChatCompletionMessageParam> = await getChatHistory(obj.URL);

        const answer = await answerQuestion(obj.data, input, current); // send both chatHistory and chatSummary
        
        chatHistory.push({ role: 'user', content: input });
        chatHistory.push({ role: 'assistant', content: answer });

        await uploadChatHistory(obj.URL, chatHistory);

        userInterface.prompt();
        })
}).catch(error => {
    console.log(error);
    process.exit();
});