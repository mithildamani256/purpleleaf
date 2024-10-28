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
    userInterface.prompt();
    userInterface.on("line", async input => {
        // so whenever a question is asked, you first make an api call to get the last 5 questions
        // + the chat summary. 
        // say a user has only asked 1 question, in that case, chat summary would be empty. 
        // say a user has asked 12 questions and is asking the 13th one. in this case, the chat summary here
        // should hold the summary for the first 8 questions and chathistory should hold the last 5 questions.
        // you pass this to the api now. 
        
        
        chatHistory.push({ role: 'user', content: input });

        if (chatHistory.length > 20) {
            chatHistory.shift(); 
            chatHistory.shift();
        }

        const answer = await answerQuestion(obj.data, input, chatHistory);
           
        chatHistory.push({ role: 'assistant', content: answer });
            
        await uploadChatHistory(obj.URL, chatHistory);

        userInterface.prompt();
        })
}).catch(error => {
    console.log(error);
    process.exit();
});