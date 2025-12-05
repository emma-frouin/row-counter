import React, { useState } from 'react';
import { Layout } from '../ui/Layout.jsx';
import { Card } from '../ui/Card.jsx';
import { Button } from '../ui/Button.jsx';
import { Timer } from '../ui/Timer.jsx';
import { updateProject } from '../firebase/projectServiceNew';

export function ProjectDetailScreen({ project, onAddCounter, onSelectCounter, onBack, onProjectUpdated, onToggleTimer, onResetTimer }) {
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
        {/* Compact Header */}
        <div className="project-detail-screen__header">
          <div style={{ flex: 1 }}>
            {!isEditingSettings ? (
              <h1 className="project-detail-screen__title">{project.name}</h1>
            ) : (
              <input
                type="text"
                value={editedProject.name}
                onChange={(e) => setEditedProject({ ...editedProject, name: e.target.value })}
                placeholder="Project name"
                className="form-input"
                style={{ fontSize: '1.25rem', fontWeight: 'bold' }}
              />
            )}
          </div>
          <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
            <Timer 
              totalTimeMs={project.totalTimeMs || 0}
              timerStartedAt={project.timerStartedAt}
              onToggle={onToggleTimer}
              onReset={onResetTimer}
              compact
            />
            {!isEditingSettings ? (
              <>
                <Button variant="secondary" size="small" onClick={() => setIsEditingSettings(true)}>✏️</Button>
                <Button variant="secondary" size="small" onClick={onBack}>←</Button>
              </>
            ) : (
              <>
                <Button variant="primary" size="small" onClick={handleSaveSettings}>✓</Button>
                <Button variant="secondary" size="small" onClick={handleCancelSettings}>✕</Button>
              </>
            )}
          </div>
        </div>

        {/* Compact Notes */}
        <div className="project-notes-compact">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={handleSaveNotes}
            placeholder="Notes..."
            className="form-input form-textarea"
            style={{ 
              minHeight: '60px', 
              width: '100%', 
              fontFamily: 'inherit',
              fontSize: '0.875rem'
            }}
          />
          {isSavingNotes && <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>Saving...</span>}
        </div>

        {/* Links - only show if they exist or editing */}
        {(isEditingSettings || project.patternLink || project.patternFile || project.yarn) && (
          <div className="project-links-compact">
            {isEditingSettings && (
              <>
                <input
                  type="text"
                  value={editedProject.yarn}
                  onChange={(e) => setEditedProject({ ...editedProject, yarn: e.target.value })}
                  placeholder="🧶 Yarn (optional)"
                  className="form-input"
                  style={{ fontSize: '0.875rem' }}
                />
                <input
                  type="url"
                  value={editedProject.patternLink}
                  onChange={(e) => setEditedProject({ ...editedProject, patternLink: e.target.value })}
                  placeholder="🔗 Pattern link (optional)"
                  className="form-input"
                  style={{ fontSize: '0.875rem' }}
                />
              </>
            )}
            {!isEditingSettings && (
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.875rem' }}>
                {project.yarn && <span>🧶 {project.yarn}</span>}
                {project.patternLink && (
                  <a href={project.patternLink} target="_blank" rel="noopener noreferrer" className="project-info__link">
                    🔗 Pattern
                  </a>
                )}
                {project.patternFile && (
                  <a href={project.patternFile.url} target="_blank" rel="noopener noreferrer" className="project-info__link">
                    📄 PDF
                  </a>
                )}
              </div>
            )}
          </div>
        )}

        {/* Counters - Compact List */}
        <div className="counters-section-compact">
          {!hasCounters ? (
            <p style={{ textAlign: 'center', color: 'var(--color-text-light)', padding: '1rem 0' }}>
              No counters yet
            </p>
          ) : (
            <div className="counters-list-compact">
              {project.counters.map((counter, index) => {
                const hasEndTarget = counter.mode === 'constant' 
                  ? counter.totalRows 
                  : counter.endStitches && counter.endStitches !== counter.startStitches;
                const totalRows = hasEndTarget
                  ? (counter.mode === 'constant' ? counter.totalRows : Math.abs(counter.endStitches - counter.startStitches) * counter.freq)
                  : null;
                const modeIcon = counter.mode === 'increase' ? '↗' : counter.mode === 'decrease' ? '↘' : '→';
                
                return (
                  <div 
                    key={counter.id} 
                    className={`counter-row ${counter.id === project.activeCounterId ? 'counter-row--active' : ''} ${counter.completed ? 'counter-row--completed' : ''}`}
                    onClick={() => !counter.completed && onSelectCounter(counter)}
                    style={{ cursor: counter.completed ? 'default' : 'pointer' }}
                  >
                    <span className="counter-row__icon">{modeIcon}</span>
                    <span className="counter-row__info">
                      Row {counter.currentRow}{totalRows ? `/${totalRows}` : ''}
                      {' · '}
                      {hasEndTarget ? `${counter.startStitches}→${counter.endStitches}` : `${counter.startStitches} st`}
                    </span>
                    {counter.completed ? (
                      <span className="counter-row__badge">✓</span>
                    ) : (
                      <span className="counter-row__action">▶</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <Button 
            size="medium" 
            onClick={onAddCounter}
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            + Add Counter
          </Button>
        </div>
      </div>
    </Layout>
  );
}



