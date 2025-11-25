import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc,
  getDocs,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './config';

const PROJECTS_COLLECTION = 'projects_v2';

/**
 * Create a new project
 */
export async function createProject(userId, projectData) {
  try {
    const projectRef = await addDoc(collection(db, PROJECTS_COLLECTION), {
      userId,
      name: projectData.name,
      yarn: projectData.yarn || '',
      notes: projectData.notes || '',
      patternLink: projectData.patternLink || '',
      patternFile: projectData.patternFile || null,
      counters: [],
      activeCounterId: null,
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
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    const projects = [];
    querySnapshot.forEach((doc) => {
      projects.push({ id: doc.id, ...doc.data() });
    });
    
    // Sort manually by updatedAt
    projects.sort((a, b) => {
      const aTime = a.updatedAt?.seconds || 0;
      const bTime = b.updatedAt?.seconds || 0;
      return bTime - aTime;
    });
    
    return { success: true, projects };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Get a single project
 */
export async function getProject(projectId) {
  try {
    const docRef = doc(db, PROJECTS_COLLECTION, projectId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { success: true, project: { id: docSnap.id, ...docSnap.data() } };
    } else {
      return { success: false, error: 'Project not found' };
    }
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
 * Add a counter to a project
 */
export async function addCounter(projectId, counter) {
  try {
    const result = await getProject(projectId);
    if (!result.success) {
      return result;
    }
    
    const project = result.project;
    const newCounters = [...(project.counters || []), counter];
    
    await updateProject(projectId, {
      counters: newCounters,
      // Set as active if it's the first counter
      activeCounterId: newCounters.length === 1 ? counter.id : project.activeCounterId
    });
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Update a counter in a project
 */
export async function updateCounter(projectId, counterId, updates) {
  try {
    const result = await getProject(projectId);
    if (!result.success) {
      return result;
    }
    
    const project = result.project;
    const counters = project.counters.map(c => 
      c.id === counterId ? { ...c, ...updates } : c
    );
    
    await updateProject(projectId, { counters });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Delete a counter from a project
 */
export async function deleteCounter(projectId, counterId) {
  try {
    const result = await getProject(projectId);
    if (!result.success) {
      return result;
    }
    
    const project = result.project;
    const counters = project.counters.filter(c => c.id !== counterId);
    
    // If we're deleting the active counter, set a new one
    let activeCounterId = project.activeCounterId;
    if (activeCounterId === counterId) {
      activeCounterId = counters.length > 0 ? counters[0].id : null;
    }
    
    await updateProject(projectId, { counters, activeCounterId });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Set active counter
 */
export async function setActiveCounter(projectId, counterId) {
  try {
    await updateProject(projectId, { activeCounterId: counterId });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

