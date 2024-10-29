import { ChatCompletionMessageParam } from "openai/src/resources/chat/completions.js";
import { db } from '../../config/firebase';
import * as admin from 'firebase-admin';

export async function uploadChatHistory(url: string, chatHistory: Array<ChatCompletionMessageParam>) {
    try {
        const collectionRef = db.collection('chatHistory');
        const querySnapshot = await collectionRef.where("url", "==", url).get();
        
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            await doc.ref.update({
                chatHistory: admin.firestore.FieldValue.arrayUnion(...chatHistory),
            });
        }
        else {
            await collectionRef.add({url: url, chatHistory: chatHistory,});
        }
    }
    catch (e) {
        throw new Error(`There is an error in uploading the chat history ${e}`);
    }
}
