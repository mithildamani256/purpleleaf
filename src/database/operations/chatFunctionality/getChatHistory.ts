import { db } from '../../config/firebase';
import * as admin from 'firebase-admin';
import { ChatCompletionMessageParam } from "openai/src/resources/chat/completions.js";

export async function getChatHistory(url: string) {
    try {
        const collectionRef = db.collection('chatHistory');
        const querySnapshot = await collectionRef.where("url", "==", url).get();

        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            const data = doc.data();

            const history = data.chatHistory;

            if (history.length >= 20) {
                return history.slice(-10);
            }

            return history;
        }
        else {
            return [];
        }
    }
    catch (e) {
        throw new Error(`There is an error in uploading the chat history ${e}`);
    }
}