/**
 * Edit Paper page component for the Research Paper Annotation Tool.
 * Loads existing paper data into a form and submits updates to the API.
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './EditPaper.css';

/**
 * EditPaper component providing a pre-populated form for updating paper details.
 * Fetches current paper data on mount and submits changes via PUT.
 * @returns {JSX.Element} The rendered edit paper page.
 */
const EditPaper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [abstract, setAbstract] = useState('');
  const [publicationUrl, setPublicationUrl] = useState('');
  const [publicationYear, setPublicationYear] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  /**
   * Fetch the current paper data to populate the form fields.
   */
  useEffect(() => {
    const fetchPaper = async () => {
      try {
        const response = await api.get(`/api/papers/${id}`);
        const paper = response.data;
        setTitle(paper.title || '');
        setAuthors(paper.authors || '');
        setAbstract(paper.abstract || '');
        setPublicationUrl(paper.publicationUrl || '');
        setPublicationYear(paper.publicationYear ? String(paper.publicationYear) : '');
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load paper data.');
      } finally {
        setLoading(false);
      }
    };
    fetchPaper();
  }, [id]);

  /**
   * Handle form submission to update the paper.
   * @param {Event} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await api.put(`/api/papers/${id}`, {
        title,
        authors,
        abstract,
        publicationUrl,
        publicationYear: parseInt(publicationYear, 10),
      });
      navigate(`/papers/${id}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update paper.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading-spinner">Loading paper data...</div>;
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Edit Research Paper</h1>

      <div className="edit-paper-card">
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="edit-paper-form">
          <div className="edit-paper-field">
            <label htmlFor="title" className="edit-paper-label">Paper Title</label>
            <input
              id="title"
              type="text"
              className="edit-paper-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter the paper title"
              required
            />
          </div>

          <div className="edit-paper-field">
            <label htmlFor="authors" className="edit-paper-label">Authors</label>
            <input
              id="authors"
              type="text"
              className="edit-paper-input"
              value={authors}
              onChange={(e) => setAuthors(e.target.value)}
              placeholder="e.g., Smith, J., Johnson, A."
              required
            />
          </div>

          <div className="edit-paper-field">
            <label htmlFor="abstract" className="edit-paper-label">Abstract</label>
            <textarea
              id="abstract"
              className="edit-paper-textarea"
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              placeholder="Enter the paper abstract"
              rows={6}
              required
            />
          </div>

          <div className="edit-paper-row">
            <div className="edit-paper-field">
              <label htmlFor="publicationUrl" className="edit-paper-label">Publication URL</label>
              <input
                id="publicationUrl"
                type="url"
                className="edit-paper-input"
                value={publicationUrl}
                onChange={(e) => setPublicationUrl(e.target.value)}
                placeholder="https://doi.org/..."
              />
            </div>

            <div className="edit-paper-field edit-paper-field-year">
              <label htmlFor="publicationYear" className="edit-paper-label">Publication Year</label>
              <input
                id="publicationYear"
                type="number"
                className="edit-paper-input"
                value={publicationYear}
                onChange={(e) => setPublicationYear(e.target.value)}
                placeholder="2024"
                min="1900"
                max="2100"
                required
              />
            </div>
          </div>

          <div className="edit-paper-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate(`/papers/${id}`)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPaper;
