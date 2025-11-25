import React, { useState, useEffect } from 'react';
import { Layout } from '../ui/Layout.jsx';
import { Card } from '../ui/Card.jsx';
import { Button } from '../ui/Button.jsx';
import { getUserProjects, deleteProject } from '../firebase/projectServiceNew';
import { logOut } from '../firebase/authService';

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

  const handleDelete = async (projectId, projectName) => {
    if (!window.confirm(`Delete "${projectName}"? This cannot be undone.`)) {
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
          <h1 className="project-list-screen__title">My Projects</h1>
          <Button 
            variant="secondary" 
            size="small"
            onClick={handleLogout}
          >
            Sign Out
          </Button>
        </div>

        {error && (
          <div className="form-error">{error}</div>
        )}

        {loading ? (
          <Card>
            <p className="project-list__loading">Loading projects...</p>
          </Card>
        ) : projects.length === 0 ? (
          <Card>
            <p className="project-list__empty">No projects yet. Create your first one!</p>
          </Card>
        ) : (
          <div className="project-list">
            {projects.map((project) => (
              <Card key={project.id} className="project-card">
                <div className="project-card__content">
                  <h2 className="project-card__name">{project.name}</h2>
                  <div className="project-card__details">
                    {project.yarn && <span>🧶 {project.yarn}</span>}
                    <span>{project.counters?.length || 0} counter{project.counters?.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
                <div className="project-card__actions">
                  <Button 
                    onClick={() => onSelectProject(project)}
                    size="medium"
                  >
                    Open
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="medium"
                    onClick={() => handleDelete(project.id, project.name)}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        <Button 
          size="large" 
          onClick={onCreateNew}
          className="project-list__create"
        >
          + Create New Project
        </Button>
      </div>
    </Layout>
  );
}


