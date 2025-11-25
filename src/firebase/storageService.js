import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { auth } from './config';

const storage = getStorage();

/**
 * Upload a pattern PDF file
 */
export async function uploadPatternPDF(file, projectId) {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      return { success: false, error: 'Not authenticated' };
    }
    
    // Create a reference to the file location
    const storageRef = ref(storage, `patterns/${userId}/${projectId}/${file.name}`);
    
    // Upload the file
    await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);
    
    return { success: true, url: downloadURL, fileName: file.name };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Delete a pattern file
 */
export async function deletePatternPDF(fileUrl) {
  try {
    const fileRef = ref(storage, fileUrl);
    await deleteObject(fileRef);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}



