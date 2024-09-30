import readline from 'readline';
import { main } from "../models/unauthenticated_model/app";
import { answerQuestion } from './script';

const userInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

main().then(data => {
    if(data){
        userInterface.prompt();
        userInterface.on("line" , async input => {
            await answerQuestion(data, input);
            userInterface.prompt();
        })
    }
}).catch(error => console.error('Error:', error));