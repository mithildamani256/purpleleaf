import { ChatCompletionMessageParam } from "openai/src/resources/chat/completions.js";
import { db } from '../database/config/firebase';
import * as admin from 'firebase-admin';

export async function uploadChat(url: string, chatHistory: Array<ChatCompletionMessageParam>) {
    try {
        const collectionRef = db.collection('chatHistory');
        const querySnapshot = await collectionRef.where("url", "==", url).get();
        
        if (!querySnapshot.empty) {
            querySnapshot.forEach(async (doc) => {
                await doc.ref.update({chatHistory: admin.firestore.FieldValue.arrayUnion(...chatHistory),});
            });
        }
        else {
            await collectionRef.add({url: url, chatHistory: chatHistory,});
        }
    }
    catch (e) {
        console.log(e);
    }
}
