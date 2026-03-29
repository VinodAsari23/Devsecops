/**
 * Add Paper page component for the Research Paper Annotation Tool.
 * Provides a form for submitting new research papers to the system.
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './AddPaper.css';

/**
 * AddPaper component rendering a form to create a new research paper entry.
 * Fields include title, authors, abstract, publication URL, and year.
 * @returns {JSX.Element} The rendered add paper page.
 */
const AddPaper = () => {
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [abstract, setAbstract] = useState('');
  const [publicationUrl, setPublicationUrl] = useState('');
  const [publicationYear, setPublicationYear] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /**
   * Handle form submission to create a new paper.
   * @param {Event} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/api/papers', {
        title,
        authors,
        abstract: abstract,
        publicationUrl,
        publicationYear: parseInt(publicationYear, 10),
      });
      navigate(`/papers/${response.data.id}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add paper. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Add Research Paper</h1>

      <div className="add-paper-card">
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="add-paper-form">
          <div className="add-paper-field">
            <label htmlFor="title" className="add-paper-label">Paper Title</label>
            <input
              id="title"
              type="text"
              className="add-paper-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter the paper title"
              required
            />
          </div>

          <div className="add-paper-field">
            <label htmlFor="authors" className="add-paper-label">Authors</label>
            <input
              id="authors"
              type="text"
              className="add-paper-input"
              value={authors}
              onChange={(e) => setAuthors(e.target.value)}
              placeholder="e.g., Smith, J., Johnson, A."
              required
            />
          </div>

          <div className="add-paper-field">
            <label htmlFor="abstract" className="add-paper-label">Abstract</label>
            <textarea
              id="abstract"
              className="add-paper-textarea"
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              placeholder="Enter the paper abstract"
              rows={6}
              required
            />
          </div>

          <div className="add-paper-row">
            <div className="add-paper-field">
              <label htmlFor="publicationUrl" className="add-paper-label">Publication URL</label>
              <input
                id="publicationUrl"
                type="url"
                className="add-paper-input"
                value={publicationUrl}
                onChange={(e) => setPublicationUrl(e.target.value)}
                placeholder="https://doi.org/..."
              />
            </div>

            <div className="add-paper-field add-paper-field-year">
              <label htmlFor="publicationYear" className="add-paper-label">Publication Year</label>
              <input
                id="publicationYear"
                type="number"
                className="add-paper-input"
                value={publicationYear}
                onChange={(e) => setPublicationYear(e.target.value)}
                placeholder="2024"
                min="1900"
                max="2100"
                required
              />
            </div>
          </div>

          <div className="add-paper-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate('/dashboard')}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Adding Paper...' : 'Add Paper'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPaper;
