import React, { useState, useEffect } from 'react';
import { Layout } from '../ui/Layout.jsx';
import { Button } from '../ui/Button.jsx';
import { getUserProjects, deleteProject } from '../firebase/projectServiceNew';
import { logOut } from '../firebase/authService';

/**
 * Format milliseconds to compact time string
 */
function formatTime(ms) {
  if (!ms || ms < 0) return '0:00';
  
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function ProjectListScreen({ user, onSelectProject, onCreateNew, onLogout }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProjects();
  }, [user]);

  const loadProjects = async () => {
    setLoading(true);
    const result = await getUserProjects(user.uid);
    setLoading(false);

    if (result.success) {
      setProjects(result.projects);
    } else {
      setError(result.error);
    }
  };

  const handleDelete = async (e, projectId, projectName) => {
    e.stopPropagation(); // Don't trigger row click
    if (!window.confirm(`Delete "${projectName}"?`)) {
      return;
    }

    const result = await deleteProject(projectId);
    if (result.success) {
      setProjects(projects.filter(p => p.id !== projectId));
    } else {
      setError(result.error);
    }
  };

  const handleLogout = async () => {
    const result = await logOut();
    if (result.success) {
      onLogout();
    }
  };

  return (
    <Layout>
      <div className="project-list-screen">
        <div className="project-list-screen__header">
          <h1 className="project-list-screen__title">Projects</h1>
          <Button 
            variant="secondary" 
            size="small"
            onClick={handleLogout}
          >
            ↪
          </Button>
        </div>

        {error && (
          <div className="form-error">{error}</div>
        )}

        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--color-text-light)', padding: '1rem' }}>Loading...</p>
        ) : projects.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--color-text-light)', padding: '1rem' }}>No projects yet</p>
        ) : (
          <div className="project-list-compact">
            {projects.map((project) => {
              const counterCount = project.counters?.length || 0;
              const isTimerRunning = !!project.timerStartedAt;
              const totalTime = project.totalTimeMs || 0;
              
              return (
                <div 
                  key={project.id} 
                  className={`project-row ${isTimerRunning ? 'project-row--active' : ''}`}
                  onClick={() => onSelectProject(project)}
                >
                  <div className="project-row__main">
                    <span className="project-row__name">{project.name}</span>
                    <span className="project-row__meta">
                      {counterCount > 0 && `${counterCount} counter${counterCount !== 1 ? 's' : ''}`}
                      {project.yarn && ` · 🧶`}
                    </span>
                  </div>
                  <div className="project-row__right">
                    <span className={`project-row__time ${isTimerRunning ? 'project-row__time--running' : ''}`}>
                      {isTimerRunning ? '⏸' : '⏱'} {formatTime(totalTime)}
                    </span>
                    <button 
                      className="project-row__delete"
                      onClick={(e) => handleDelete(e, project.id, project.name)}
                      title="Delete"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Button 
          size="medium" 
          onClick={onCreateNew}
          style={{ width: '100%', marginTop: '0.5rem' }}
        >
          + New Project
        </Button>
      </div>
    </Layout>
  );
}


