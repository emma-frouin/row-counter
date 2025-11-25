import React, { useState } from 'react';
import { Layout } from '../ui/Layout.jsx';
import { Card } from '../ui/Card.jsx';
import { Button } from '../ui/Button.jsx';
import { uploadPatternPDF } from '../firebase/storageService';

export function CreateProjectScreen({ userId, onComplete, onCancel }) {
  const [name, setName] = useState('');
  const [yarn, setYarn] = useState('');
  const [notes, setNotes] = useState('');
  const [patternLink, setPatternLink] = useState('');
  const [patternFile, setPatternFile] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPatternFile(file);
      setError('');
    } else {
      setError('Please select a PDF file');
      setPatternFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || name.trim() === '') {
      setError('Project name is required');
      return;
    }

    let patternFileData = null;

    // Upload pattern file if provided
    if (patternFile) {
      setUploadingFile(true);
      const uploadResult = await uploadPatternPDF(patternFile, `temp_${Date.now()}`);
      setUploadingFile(false);

      if (uploadResult.success) {
        patternFileData = {
          url: uploadResult.url,
          fileName: uploadResult.fileName
        };
      } else {
        setError('Failed to upload pattern file: ' + uploadResult.error);
        return;
      }
    }

    onComplete({
      name: name.trim(),
      yarn: yarn.trim(),
      notes: notes.trim(),
      patternLink: patternLink.trim(),
      patternFile: patternFileData
    });
  };

  return (
    <Layout>
      <div className="create-project-screen">
        <h1 className="create-project-screen__title">Create New Project</h1>
        
        <Card>
          <form onSubmit={handleSubmit} className="project-form">
            {error && (
              <div className="form-error">{error}</div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="name">
                Project Name *
              </label>
              <input
                id="name"
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Sophie Hood, Baby Blanket"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="yarn">
                Yarn (optional)
              </label>
              <input
                id="yarn"
                type="text"
                className="form-input"
                value={yarn}
                onChange={(e) => setYarn(e.target.value)}
                placeholder="e.g., Merino Wool, 4mm"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="notes">
                Notes (optional)
              </label>
              <textarea
                id="notes"
                className="form-input form-textarea"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any notes about this project..."
                rows="3"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="patternLink">
                Pattern Link (optional)
              </label>
              <input
                id="patternLink"
                type="url"
                className="form-input"
                value={patternLink}
                onChange={(e) => setPatternLink(e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="patternFile">
                Or Upload Pattern PDF (optional)
              </label>
              <input
                id="patternFile"
                type="file"
                accept=".pdf"
                className="form-input-file"
                onChange={handleFileChange}
              />
              {patternFile && (
                <div className="file-preview">
                  📄 {patternFile.name}
                </div>
              )}
            </div>

            <div className="form-actions">
              <Button 
                type="button" 
                variant="secondary"
                size="large"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                size="large"
                disabled={uploadingFile}
              >
                {uploadingFile ? 'Uploading...' : 'Create Project'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
}



