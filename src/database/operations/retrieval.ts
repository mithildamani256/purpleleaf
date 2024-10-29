import { db } from "../config/firebase";

export async function retrieval(url: string) {
    try {
        const querySnapshot = await db.collection("details").where("URL", "==", url).get();
        const doc = querySnapshot.docs[0];
        const data = doc.data();

        return {
            title: data.title,
            keywords: data.keywords,
            description: data.description,
            markdown: data.markdown,
            screenshot: data.screenshot,
        }; throw new Error(`No document found with URL: ${url}`);
    }
    catch (e) {
        throw new Error(`Error retrieving details for ${url}: ${e}`);
    }
}