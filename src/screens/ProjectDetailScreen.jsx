import React, { useState } from 'react';
import { Layout } from '../ui/Layout.jsx';
import { Card } from '../ui/Card.jsx';
import { Button } from '../ui/Button.jsx';
import { updateProject } from '../firebase/projectServiceNew';

export function ProjectDetailScreen({ project, onAddCounter, onSelectCounter, onBack, onProjectUpdated }) {
  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [editedProject, setEditedProject] = useState({
    name: project.name,
    yarn: project.yarn || '',
    patternLink: project.patternLink || ''
  });
  const [notes, setNotes] = useState(project.notes || '');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const activeCounter = project.counters?.find(c => c.id === project.activeCounterId);
  const hasCounters = project.counters && project.counters.length > 0;

  // Save project settings
  const handleSaveSettings = async () => {
    const result = await updateProject(project.id, {
      name: editedProject.name,
      yarn: editedProject.yarn,
      patternLink: editedProject.patternLink
    });
    
    if (result.success) {
      setIsEditingSettings(false);
      if (onProjectUpdated) {
        onProjectUpdated();
      }
    } else {
      alert('Failed to update project: ' + result.error);
    }
  };

  // Cancel editing settings
  const handleCancelSettings = () => {
    setEditedProject({
      name: project.name,
      yarn: project.yarn || '',
      patternLink: project.patternLink || ''
    });
    setIsEditingSettings(false);
  };

  // Save notes (auto-save on blur)
  const handleSaveNotes = async () => {
    if (notes === project.notes) return; // No changes
    
    setIsSavingNotes(true);
    const result = await updateProject(project.id, { notes });
    setIsSavingNotes(false);
    
    if (result.success) {
      if (onProjectUpdated) {
        onProjectUpdated();
      }
    } else {
      alert('Failed to save notes: ' + result.error);
    }
  };

  return (
    <Layout>
      <div className="project-detail-screen">
        <div className="project-detail-screen__header">
          <div style={{ flex: 1 }}>
            {!isEditingSettings ? (
              <>
                <h1 className="project-detail-screen__title">{project.name}</h1>
                {project.yarn && (
                  <p className="project-detail-screen__yarn">🧶 {project.yarn}</p>
                )}
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={editedProject.name}
                  onChange={(e) => setEditedProject({ ...editedProject, name: e.target.value })}
                  placeholder="Project name"
                  className="form-input"
                  style={{ fontSize: '1.5rem', fontWeight: 'bold' }}
                />
                <input
                  type="text"
                  value={editedProject.yarn}
                  onChange={(e) => setEditedProject({ ...editedProject, yarn: e.target.value })}
                  placeholder="🧶 Yarn type (optional)"
                  className="form-input"
                />
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {!isEditingSettings ? (
              <>
                <Button 
                  variant="secondary" 
                  size="small"
                  onClick={() => setIsEditingSettings(true)}
                >
                  ✏️ Edit
                </Button>
                <Button 
                  variant="secondary" 
                  size="small"
                  onClick={onBack}
                >
                  ← Projects
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="primary" 
                  size="small"
                  onClick={handleSaveSettings}
                >
                  ✓ Save
                </Button>
                <Button 
                  variant="secondary" 
                  size="small"
                  onClick={handleCancelSettings}
                >
                  ✕ Cancel
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Project Info */}
        <Card className="project-info">
          {/* Notes - Always Editable */}
          <div className="project-info__section">
            <h3 className="project-info__label">Notes {isSavingNotes && '(saving...)'}</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={handleSaveNotes}
              placeholder="Add your project notes here..."
              className="form-input form-textarea"
              style={{ 
                minHeight: '100px', 
                width: '100%', 
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Pattern Link - Editable in edit mode */}
          {(isEditingSettings || project.patternLink) && (
            <div className="project-info__section">
              <h3 className="project-info__label">Pattern Link</h3>
              {isEditingSettings ? (
                <input
                  type="url"
                  value={editedProject.patternLink}
                  onChange={(e) => setEditedProject({ ...editedProject, patternLink: e.target.value })}
                  placeholder="https://..."
                  className="form-input"
                />
              ) : project.patternLink ? (
                <a 
                  href={project.patternLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="project-info__link"
                >
                  🔗 {project.patternLink}
                </a>
              ) : null}
            </div>
          )}

          {/* Pattern File */}
          {project.patternFile && (
            <div className="project-info__section">
              <h3 className="project-info__label">Pattern PDF</h3>
              <a 
                href={project.patternFile.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="project-info__link"
              >
                📄 {project.patternFile.fileName}
              </a>
            </div>
          )}
        </Card>

        {/* Counters List */}
        <div className="counters-section">
          <h2 className="counters-section__title">Counters / Phases</h2>
          
          {!hasCounters ? (
            <Card>
              <p className="counters-section__empty">No counters yet. Add your first phase!</p>
            </Card>
          ) : (
            <div className="counters-list">
              {project.counters.map((counter, index) => (
                <Card 
                  key={counter.id} 
                  className={`counter-card ${counter.id === project.activeCounterId ? 'counter-card--active' : ''} ${counter.completed ? 'counter-card--completed' : ''}`}
                >
                  <div className="counter-card__header">
                    <div>
                      <h3 className="counter-card__name">
                        {index + 1}. {counter.name}
                      </h3>
                      <div className="counter-card__mode">
                        {counter.mode === 'increase' && '↗️ Increasing'}
                        {counter.mode === 'decrease' && '↘️ Decreasing'}
                        {counter.mode === 'constant' && '→ Constant'}
                      </div>
                    </div>
                    {counter.completed && (
                      <span className="counter-card__badge">✓ Done</span>
                    )}
                  </div>
                  
                  <div className="counter-card__details">
                    {(() => {
                      const hasEndTarget = counter.mode === 'constant' 
                        ? counter.totalRows 
                        : counter.endStitches && counter.endStitches !== counter.startStitches;
                      const totalRows = hasEndTarget
                        ? (counter.mode === 'constant' ? counter.totalRows : Math.abs(counter.endStitches - counter.startStitches) * counter.freq)
                        : null;
                      return (
                        <>
                          <div>Row {counter.currentRow}{totalRows ? ` / ${totalRows}` : ' (open)'}</div>
                          {hasEndTarget ? (
                            <div>{counter.startStitches} → {counter.endStitches} stitches</div>
                          ) : (
                            <div>{counter.startStitches} stitches</div>
                          )}
                        </>
                      );
                    })()}
                  </div>

                  {!counter.completed && (
                    <Button 
                      onClick={() => onSelectCounter(counter)}
                      size="medium"
                      className="counter-card__button"
                    >
                      {counter.id === project.activeCounterId ? 'Continue' : 'Switch to this'}
                    </Button>
                  )}
                </Card>
              ))}
            </div>
          )}

          <Button 
            size="large" 
            onClick={onAddCounter}
            className="counters-section__add"
          >
            + Add Counter / Phase
          </Button>
        </div>
      </div>
    </Layout>
  );
}



