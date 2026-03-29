/**
 * Edit Annotation page component for the Research Paper Annotation Tool.
 * Loads existing annotation data into a form and submits updates to the API.
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './EditAnnotation.css';

/**
 * Human-readable labels for annotation categories.
 */
const CATEGORY_LABELS = {
  KEY_FINDING: 'Key Finding',
  METHODOLOGY: 'Methodology',
  QUESTION: 'Question',
  CRITIQUE: 'Critique',
  REFERENCE: 'Reference',
  OTHER: 'Other',
};

/**
 * List of all available annotation categories.
 */
const CATEGORIES = ['KEY_FINDING', 'METHODOLOGY', 'QUESTION', 'CRITIQUE', 'REFERENCE', 'OTHER'];

/**
 * EditAnnotation component for modifying an existing annotation.
 * Fetches annotation data on mount, presents a form, and submits changes via PUT.
 * @returns {JSX.Element} The rendered edit annotation page.
 */
const EditAnnotation = () => {
  const { id, annId } = useParams();
  const navigate = useNavigate();
  const [highlightedText, setHighlightedText] = useState('');
  const [annotationNote, setAnnotationNote] = useState('');
  const [category, setCategory] = useState('KEY_FINDING');
  const [pageNumber, setPageNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  /**
   * Fetch the current annotation data to populate the form.
   */
  useEffect(() => {
    const fetchAnnotation = async () => {
      try {
        const response = await api.get(`/api/papers/${id}/annotations`);
        const annotation = response.data.find((a) => String(a.id) === String(annId));
        if (annotation) {
          setHighlightedText(annotation.highlightedText || '');
          setAnnotationNote(annotation.annotationNote || '');
          setCategory(annotation.category || 'KEY_FINDING');
          setPageNumber(annotation.pageNumber ? String(annotation.pageNumber) : '');
        } else {
          setError('Annotation not found.');
        }
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load annotation data.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnnotation();
  }, [id, annId]);

  /**
   * Handle form submission to update the annotation.
   * @param {Event} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await api.put(`/api/papers/${id}/annotations/${annId}`, {
        highlightedText,
        annotationNote,
        category,
        pageNumber: pageNumber ? parseInt(pageNumber, 10) : null,
      });
      navigate(`/papers/${id}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update annotation.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading-spinner">Loading annotation data...</div>;
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Edit Annotation</h1>

      <div className="edit-annotation-card">
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="edit-annotation-form">
          <div className="edit-annotation-field">
            <label htmlFor="highlightedText" className="edit-annotation-label">
              Highlighted Text
            </label>
            <textarea
              id="highlightedText"
              className="edit-annotation-textarea"
              value={highlightedText}
              onChange={(e) => setHighlightedText(e.target.value)}
              placeholder="Paste or type the text excerpt from the paper"
              rows={3}
              required
            />
          </div>

          <div className="edit-annotation-field">
            <label htmlFor="annotationNote" className="edit-annotation-label">
              Annotation Note
            </label>
            <textarea
              id="annotationNote"
              className="edit-annotation-textarea"
              value={annotationNote}
              onChange={(e) => setAnnotationNote(e.target.value)}
              placeholder="Your notes or commentary on this section"
              rows={3}
              required
            />
          </div>

          <div className="edit-annotation-row">
            <div className="edit-annotation-field">
              <label htmlFor="category" className="edit-annotation-label">Category</label>
              <select
                id="category"
                className="edit-annotation-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {CATEGORY_LABELS[cat]}
                  </option>
                ))}
              </select>
            </div>

            <div className="edit-annotation-field">
              <label htmlFor="pageNumber" className="edit-annotation-label">
                Page Number (optional)
              </label>
              <input
                id="pageNumber"
                type="number"
                className="edit-annotation-input"
                value={pageNumber}
                onChange={(e) => setPageNumber(e.target.value)}
                placeholder="e.g., 5"
                min="1"
              />
            </div>
          </div>

          <div className="edit-annotation-actions">
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

export default EditAnnotation;
