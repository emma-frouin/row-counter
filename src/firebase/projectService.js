import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './config';

const PROJECTS_COLLECTION = 'projects';

/**
 * Create a new project
 */
export async function createProject(userId, projectData) {
  try {
    const projectRef = await addDoc(collection(db, PROJECTS_COLLECTION), {
      userId,
      name: projectData.name,
      mode: projectData.mode,
      stitches: projectData.stitches,
      freq: projectData.freq,
      row: projectData.row || 1,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { success: true, projectId: projectRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Get all projects for a user
 */
export async function getUserProjects(userId) {
  try {
    const q = query(
      collection(db, PROJECTS_COLLECTION),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const projects = [];
    querySnapshot.forEach((doc) => {
      projects.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, projects };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Update a project
 */
export async function updateProject(projectId, updates) {
  try {
    const projectRef = doc(db, PROJECTS_COLLECTION, projectId);
    await updateDoc(projectRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Delete a project
 */
export async function deleteProject(projectId) {
  try {
    await deleteDoc(doc(db, PROJECTS_COLLECTION, projectId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Update project row count
 */
export async function advanceProjectRow(projectId, newRow, newStitches) {
  return updateProject(projectId, {
    row: newRow,
    stitches: newStitches
  });
}

