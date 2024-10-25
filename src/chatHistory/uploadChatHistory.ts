import { getDownloadURL, ref, uploadBytes, uploadString } from 'firebase/storage';
import { ChatCompletionMessageParam } from "openai/src/resources/chat/completions.js";
import { db, storageBucket } from "../database/config/firebase";
import * as admin from 'firebase-admin';

export async function uploadChatHistory(url: string, chatHistory: Array<ChatCompletionMessageParam>) {
    try {
        const parsedUrl = new URL(url);
        const websiteName = parsedUrl.hostname;
        const querySnapshot = await db.collection('chatHistory').where('website', '==', websiteName).get();

        if (querySnapshot.empty) {
            console.log("No existing chat history found for the URL:", url);
        }
        
        const doc = querySnapshot.docs[0];
        let existingChatHistory = "";
        
        if (doc) {
            existingChatHistory = doc.data().chathistory || '';
        }

        const newChatHistory = existingChatHistory + '\n' + chatHistory.map(item => `${item.role}: ${item.content}`).join('\n');

        try {
            const docRef = await db.collection("chatHistory").add({
                history: newChatHistory,
                website: websiteName
            });
        } catch (e) {
            console.error("Error storing markdown or uploading file: ", e);
        }
    }
    catch (e) {
        console.log(e);
    }
}
