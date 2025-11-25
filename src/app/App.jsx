import React, { useState, useEffect } from 'react';
import { AuthScreen } from '../screens/AuthScreen.jsx';
import { ProjectListScreen } from '../screens/ProjectListScreen.jsx';
import { SetupScreen } from '../screens/SetupScreen.jsx';
import { CounterScreen } from '../screens/CounterScreen.jsx';
import { onAuthChange } from '../firebase/authService';
import { createProject, updateProject } from '../firebase/projectService';
import { advanceRow } from '../state/counterState';

const VIEWS = {
  AUTH: 'auth',
  PROJECT_LIST: 'project_list',
  SETUP: 'setup',
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
    setCurrentView(VIEWS.SETUP);
  };

  // Handle setup completion (creating project in Firebase)
  const handleSetupComplete = async (projectData) => {
    const result = await createProject(user.uid, projectData);
    
    if (result.success) {
      // Fetch the created project and open it
      const newProject = {
        id: result.projectId,
        ...projectData,
        row: 1
      };
      setCurrentProject(newProject);
      setCurrentView(VIEWS.COUNTER);
    } else {
      alert('Failed to create project: ' + result.error);
    }
  };

  // Handle selecting an existing project
  const handleSelectProject = (project) => {
    setCurrentProject(project);
    setCurrentView(VIEWS.COUNTER);
  };

  // Handle advancing a row in the counter
  const handleAdvanceRow = async () => {
    if (!currentProject) return;

    // Calculate new state
    const newState = advanceRow(currentProject);
    
    // Update in Firebase
    await updateProject(currentProject.id, {
      row: newState.row,
      stitches: newState.stitches
    });

    // Update local state
    setCurrentProject({
      ...currentProject,
      row: newState.row,
      stitches: newState.stitches
    });
  };

  // Handle going back to project list
  const handleBackToProjects = () => {
    setCurrentProject(null);
    setCurrentView(VIEWS.PROJECT_LIST);
  };

  // Handle canceling setup
  const handleCancelSetup = () => {
    setCurrentView(VIEWS.PROJECT_LIST);
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

  if (currentView === VIEWS.SETUP) {
    return (
      <SetupScreen 
        onComplete={handleSetupComplete}
        onCancel={handleCancelSetup}
      />
    );
  }

  if (currentView === VIEWS.COUNTER && currentProject) {
    return (
      <CounterScreen 
        project={currentProject}
        onAdvanceRow={handleAdvanceRow}
        onBackToProjects={handleBackToProjects}
      />
    );
  }

  return null;
}
