import { db, storageBucket } from "../config/firebase";
import * as admin from 'firebase-admin';

export async function storeMarkdownInFirestore(markdown: string, url:string) {
    try {
        const docRef = await db.collection("markdowns").add({
            content: markdown,
            website: url
        });
    } catch (e) {
        console.error("Error storing markdown or uploading file: ", e);
    }
}

export async function storeScreenshotAndUrlInFirestore(screenshot: Uint8Array, URL : string) {
    try {
        const fileName = `screenshots/${URL}.png`;
        const file = storageBucket.file(fileName);
        await file.save(screenshot, {
            metadata: {
                contentType: 'image/png',
            }
            });

        const [url] = await file.getSignedUrl({
            action: 'read',
            expires: '03-09-2500',
        });

        const docRef = await db.collection('screenshots').add({
            fileUrl: url,
            website: URL
        });

        return url;
  } catch (error) {
        console.error("Error uploading screenshot or storing URL: ", error);
        return "";
  }
}