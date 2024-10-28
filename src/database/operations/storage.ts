import { db, storageBucket } from "../config/firebase";
import * as admin from 'firebase-admin';

export async function storeMarkdownInFirestore(markdown: string, url: string, name:string) {
    try {
        const docRef = await db.collection("markdowns").add({
            content: markdown,
            website: name,
            URL: url
        });
    } catch (e) {
        throw new Error(`Error storing markdown or uploading file: ${e}`);
    }
}

export async function storeScreenshotAndUrlInFirestore(screenshot: Uint8Array, url: string, name: string) {
    const fileName = `screenshots/${name}.png`;
    const file = storageBucket.file(fileName);
    let file_location;

    try {
        await file.save(screenshot, {
            metadata: {
                contentType: 'image/png',
            }
        });
    }
    catch (e) {
        throw new Error(`error saving screenshot of file on firebase storage ${e}`);
    }

    try {
        [file_location] = await file.getSignedUrl({
            action: 'read',
            expires: '03-09-2500',
        });
    }
    catch (e) {
        throw new Error(`error in finding the url of the saved screenshot file ${e}`);
    }

    try {
        const docRef = await db.collection('screenshots').add({
            fileUrl: file_location,
            website: name
        });
    }
    catch (e) {
        throw new Error(`error in saving screenshot file url ${e}`)
    }

    return file_location;
}