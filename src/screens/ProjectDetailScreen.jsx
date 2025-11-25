import React from 'react';
import { Layout } from '../ui/Layout.jsx';
import { Card } from '../ui/Card.jsx';
import { Button } from '../ui/Button.jsx';

export function ProjectDetailScreen({ project, onAddCounter, onSelectCounter, onBack }) {
  const activeCounter = project.counters?.find(c => c.id === project.activeCounterId);
  const hasCounters = project.counters && project.counters.length > 0;

  return (
    <Layout>
      <div className="project-detail-screen">
        <div className="project-detail-screen__header">
          <div>
            <h1 className="project-detail-screen__title">{project.name}</h1>
            {project.yarn && (
              <p className="project-detail-screen__yarn">🧶 {project.yarn}</p>
            )}
          </div>
          <Button 
            variant="secondary" 
            size="small"
            onClick={onBack}
          >
            ← Projects
          </Button>
        </div>

        {/* Project Info */}
        {(project.notes || project.patternLink || project.patternFile) && (
          <Card className="project-info">
            {project.notes && (
              <div className="project-info__section">
                <h3 className="project-info__label">Notes</h3>
                <p className="project-info__text">{project.notes}</p>
              </div>
            )}
            {project.patternLink && (
              <div className="project-info__section">
                <h3 className="project-info__label">Pattern</h3>
                <a 
                  href={project.patternLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="project-info__link"
                >
                  🔗 {project.patternLink}
                </a>
              </div>
            )}
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
        )}

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
                    <div>Row {counter.currentRow} / {counter.mode === 'constant' ? counter.totalRows : Math.abs(counter.endStitches - counter.startStitches) * counter.freq}</div>
                    <div>{counter.startStitches} → {counter.endStitches} stitches</div>
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


