import React, { useState, useEffect } from 'react';
import { AuthScreen } from '../screens/AuthScreen.jsx';
import { ProjectListScreen } from '../screens/ProjectListScreen.jsx';
import { CreateProjectScreen } from '../screens/CreateProjectScreen.jsx';
import { ProjectDetailScreen } from '../screens/ProjectDetailScreen.jsx';
import { CreateCounterScreen} from '../screens/CreateCounterScreen.jsx';
import { CounterScreenNew } from '../screens/CounterScreenNew.jsx';
import { onAuthChange } from '../firebase/authService';
import { 
  createProject, 
  getProject,
  addCounter,
  updateCounter,
  setActiveCounter,
  toggleTimer,
  resetTimer
} from '../firebase/projectServiceNew';
import { advanceCounter, markCounterComplete } from '../state/projectState';

const VIEWS = {
  AUTH: 'auth',
  PROJECT_LIST: 'project_list',
  CREATE_PROJECT: 'create_project',
  PROJECT_DETAIL: 'project_detail',
  CREATE_COUNTER: 'create_counter',
  COUNTER: 'counter'
};

export function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState(VIEWS.AUTH);
  const [currentProject, setCurrentProject] = useState(null);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setLoading(false);
      
      if (user) {
        setCurrentView(VIEWS.PROJECT_LIST);
      } else {
        setCurrentView(VIEWS.AUTH);
        setCurrentProject(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Reload current project from Firebase
  const reloadProject = async () => {
    if (!currentProject) return;
    const result = await getProject(currentProject.id);
    if (result.success) {
      setCurrentProject(result.project);
    }
  };

  // Handle authentication success
  const handleAuthSuccess = (user) => {
    setUser(user);
    setCurrentView(VIEWS.PROJECT_LIST);
  };

  // Handle logout
  const handleLogout = () => {
    setUser(null);
    setCurrentProject(null);
    setCurrentView(VIEWS.AUTH);
  };

  // Handle creating a new project
  const handleCreateNewProject = () => {
    setCurrentView(VIEWS.CREATE_PROJECT);
  };

  // Handle project creation completion
  const handleProjectCreated = async (projectData) => {
    const result = await createProject(user.uid, projectData);
    
    if (result.success) {
      // Fetch the created project and show it
      const projectResult = await getProject(result.projectId);
      if (projectResult.success) {
        setCurrentProject(projectResult.project);
        setCurrentView(VIEWS.PROJECT_DETAIL);
      }
    } else {
      alert('Failed to create project: ' + result.error);
    }
  };

  // Handle selecting an existing project
  const handleSelectProject = async (project) => {
    const result = await getProject(project.id);
    if (result.success) {
      setCurrentProject(result.project);
      setCurrentView(VIEWS.PROJECT_DETAIL);
    }
  };

  // Handle adding a new counter
  const handleAddCounter = () => {
    setCurrentView(VIEWS.CREATE_COUNTER);
  };

  // Handle counter creation completion
  const handleCounterCreated = async (counter) => {
    const result = await addCounter(currentProject.id, counter);
    
    if (result.success) {
      await reloadProject();
      setCurrentView(VIEWS.PROJECT_DETAIL);
    } else {
      alert('Failed to add counter: ' + result.error);
    }
  };

  // Handle selecting/switching to a counter
  const handleSelectCounter = async (counter) => {
    // Set as active counter
    await setActiveCounter(currentProject.id, counter.id);
    await reloadProject();
    setCurrentView(VIEWS.COUNTER);
  };

  // Handle advancing a row in the counter
  const handleAdvanceRow = async () => {
    if (!currentProject || !currentProject.activeCounterId) return;

    const activeCounter = currentProject.counters.find(
      c => c.id === currentProject.activeCounterId
    );
    
    if (!activeCounter) return;

    // Calculate new counter state
    const newCounter = advanceCounter(activeCounter);
    
    // Update in Firebase
    await updateCounter(currentProject.id, activeCounter.id, {
      currentRow: newCounter.currentRow,
      completed: newCounter.completed
    });

    // Reload project to get updated data
    await reloadProject();
  };

  // Handle manually marking counter as complete (for open-ended counters)
  const handleMarkComplete = async () => {
    if (!currentProject || !currentProject.activeCounterId) return;

    const activeCounter = currentProject.counters.find(
      c => c.id === currentProject.activeCounterId
    );
    
    if (!activeCounter) return;

    // Mark as complete
    const newCounter = markCounterComplete(activeCounter);
    
    // Update in Firebase
    await updateCounter(currentProject.id, activeCounter.id, {
      completed: newCounter.completed
    });

    // Reload project to get updated data
    await reloadProject();
  };

  // Handle resetting counter to row 1
  const handleResetCounter = async () => {
    if (!currentProject || !currentProject.activeCounterId) return;

    // Update in Firebase - reset to row 1, not completed
    await updateCounter(currentProject.id, currentProject.activeCounterId, {
      currentRow: 1,
      completed: false
    });

    // Reload project to get updated data
    await reloadProject();
  };

  // Handle timer toggle
  const handleToggleTimer = async () => {
    if (!currentProject) return;
    
    await toggleTimer(currentProject.id);
    await reloadProject();
  };

  // Handle timer reset
  const handleResetTimer = async () => {
    if (!currentProject) return;
    
    await resetTimer(currentProject.id);
    await reloadProject();
  };

  // Handle going back to project detail
  const handleBackToProject = () => {
    setCurrentView(VIEWS.PROJECT_DETAIL);
  };

  // Handle going back to project list
  const handleBackToProjectList = () => {
    setCurrentProject(null);
    setCurrentView(VIEWS.PROJECT_LIST);
  };

  // Handle canceling create project
  const handleCancelCreateProject = () => {
    setCurrentView(VIEWS.PROJECT_LIST);
  };

  // Handle canceling create counter
  const handleCancelCreateCounter = () => {
    setCurrentView(VIEWS.PROJECT_DETAIL);
  };

  // Show loading state
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        fontFamily: 'var(--font-sans)',
        color: 'var(--color-text)'
      }}>
        Loading...
      </div>
    );
  }

  // Render appropriate view
  if (currentView === VIEWS.AUTH) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  if (currentView === VIEWS.PROJECT_LIST) {
    return (
      <ProjectListScreen 
        user={user}
        onSelectProject={handleSelectProject}
        onCreateNew={handleCreateNewProject}
        onLogout={handleLogout}
      />
    );
  }

  if (currentView === VIEWS.CREATE_PROJECT) {
    return (
      <CreateProjectScreen
        userId={user.uid}
        onComplete={handleProjectCreated}
        onCancel={handleCancelCreateProject}
      />
    );
  }

  if (currentView === VIEWS.PROJECT_DETAIL && currentProject) {
    return (
      <ProjectDetailScreen 
        project={currentProject}
        onAddCounter={handleAddCounter}
        onSelectCounter={handleSelectCounter}
        onBack={handleBackToProjectList}
        onProjectUpdated={reloadProject}
        onToggleTimer={handleToggleTimer}
        onResetTimer={handleResetTimer}
      />
    );
  }

  if (currentView === VIEWS.CREATE_COUNTER) {
    return (
      <CreateCounterScreen
        onComplete={handleCounterCreated}
        onCancel={handleCancelCreateCounter}
      />
    );
  }

  if (currentView === VIEWS.COUNTER && currentProject && currentProject.activeCounterId) {
    const activeCounter = currentProject.counters.find(
      c => c.id === currentProject.activeCounterId
    );
    
    if (activeCounter) {
      return (
        <CounterScreenNew
          project={currentProject}
          counter={activeCounter}
          onAdvanceRow={handleAdvanceRow}
          onMarkComplete={handleMarkComplete}
          onResetCounter={handleResetCounter}
          onBackToProject={handleBackToProject}
          onToggleTimer={handleToggleTimer}
          onResetTimer={handleResetTimer}
        />
      );
    }
  }

  return null;
}



