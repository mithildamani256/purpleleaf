import { db } from "../config/firebase";

export async function checkExistence(url: string) {
    try {
        const collectionRef = db.collection('details');
        const querySnapshot = await collectionRef.where('URL', '==', url).get();
        if (!querySnapshot.empty) {
            return true;
        }
        else {
            return false;
        }
    }
    catch (error) {
        throw new Error("Unable to check existence of a document in firestore. ");
  }
}