/**
 * Paper Detail page component for the Research Paper Annotation Tool.
 * Displays full paper metadata, a list of annotations with category badges,
 * and a form to add new annotations. Includes edit and delete paper controls.
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import './PaperDetail.css';

/**
 * Category color mapping for annotation badges.
 */
const CATEGORY_COLORS = {
  KEY_FINDING: '#4caf50',
  METHODOLOGY: '#2196f3',
  QUESTION: '#7c4dff',
  CRITIQUE: '#f44336',
  REFERENCE: '#009688',
  OTHER: '#9e9e9e',
};

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
 * PaperDetail component displaying a single paper and its annotations.
 * @returns {JSX.Element} The rendered paper detail page.
 */
const PaperDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paper, setPaper] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [highlightedText, setHighlightedText] = useState('');
  const [annotationNote, setAnnotationNote] = useState('');
  const [category, setCategory] = useState('KEY_FINDING');
  const [pageNumber, setPageNumber] = useState('');
  const [addError, setAddError] = useState('');
  const [addLoading, setAddLoading] = useState(false);

  /**
   * Fetch paper details and annotations on mount or when the ID changes.
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [paperRes, annRes] = await Promise.all([
          api.get(`/api/papers/${id}`),
          api.get(`/api/papers/${id}/annotations`),
        ]);
        setPaper(paperRes.data);
        setAnnotations(annRes.data);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load paper details.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  /**
   * Handle deletion of the current paper.
   * Confirms with the user before proceeding.
   */
  const handleDeletePaper = async () => {
    if (!window.confirm('Are you sure you want to delete this paper and all its annotations?')) {
      return;
    }
    try {
      await api.delete(`/api/papers/${id}`);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete paper.');
    }
  };

  /**
   * Handle submission of a new annotation.
   * @param {Event} e - The form submission event.
   */
  const handleAddAnnotation = async (e) => {
    e.preventDefault();
    setAddError('');
    setAddLoading(true);
    try {
      const response = await api.post(`/api/papers/${id}/annotations`, {
        highlightedText,
        annotationNote,
        category,
        pageNumber: pageNumber ? parseInt(pageNumber, 10) : null,
      });
      setAnnotations([...annotations, response.data]);
      setHighlightedText('');
      setAnnotationNote('');
      setCategory('KEY_FINDING');
      setPageNumber('');
    } catch (err) {
      setAddError(err.response?.data?.detail || 'Failed to add annotation.');
    } finally {
      setAddLoading(false);
    }
  };

  /**
   * Handle deletion of a specific annotation.
   * @param {number} annId - The annotation ID to delete.
   */
  const handleDeleteAnnotation = async (annId) => {
    if (!window.confirm('Are you sure you want to delete this annotation?')) {
      return;
    }
    try {
      await api.delete(`/api/papers/${id}/annotations/${annId}`);
      setAnnotations(annotations.filter((a) => a.id !== annId));
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete annotation.');
    }
  };

  if (loading) {
    return <div className="loading-spinner">Loading paper details...</div>;
  }

  if (!paper) {
    return <div className="page-container"><div className="error-message">Paper not found.</div></div>;
  }

  return (
    <div className="page-container">
      {error && <div className="error-message">{error}</div>}

      <div className="paper-detail-card">
        <div className="paper-detail-header">
          <h1 className="paper-detail-title">{paper.title}</h1>
          <div className="paper-detail-actions">
            <Link to={`/papers/${id}/edit`} className="btn-secondary">Edit Paper</Link>
            <button onClick={handleDeletePaper} className="btn-danger">Delete Paper</button>
          </div>
        </div>

        <div className="paper-detail-meta">
          <div className="paper-detail-meta-item">
            <span className="paper-detail-meta-label">Authors</span>
            <span className="paper-detail-meta-value">{paper.authors}</span>
          </div>
          <div className="paper-detail-meta-item">
            <span className="paper-detail-meta-label">Publication Year</span>
            <span className="paper-detail-meta-value">{paper.publicationYear}</span>
          </div>
          {paper.publicationUrl && (
            <div className="paper-detail-meta-item">
              <span className="paper-detail-meta-label">Publication URL</span>
              <a
                href={paper.publicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="paper-detail-link"
              >
                {paper.publicationUrl}
              </a>
            </div>
          )}
          {paper.createdAt && (
            <div className="paper-detail-meta-item">
              <span className="paper-detail-meta-label">Added</span>
              <span className="paper-detail-meta-value">
                {new Date(paper.createdAt).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {paper.abstract && (
          <div className="paper-detail-abstract">
            <h3 className="paper-detail-section-title">Abstract</h3>
            <p>{paper.abstract}</p>
          </div>
        )}
      </div>

      <div className="paper-detail-annotations-section">
        <h2 className="paper-detail-section-heading">
          Annotations ({annotations.length})
        </h2>

        {annotations.length === 0 ? (
          <div className="paper-detail-no-annotations">
            No annotations yet. Add the first one below.
          </div>
        ) : (
          <div className="paper-detail-annotations-list">
            {annotations.map((ann) => (
              <div key={ann.id} className="annotation-card">
                <div className="annotation-header">
                  <span
                    className="annotation-badge"
                    style={{ background: CATEGORY_COLORS[ann.category] || '#9e9e9e' }}
                  >
                    {CATEGORY_LABELS[ann.category] || ann.category}
                  </span>
                  {ann.pageNumber && (
                    <span className="annotation-page">Page {ann.pageNumber}</span>
                  )}
                  <div className="annotation-actions">
                    <Link
                      to={`/papers/${id}/annotations/${ann.id}/edit`}
                      className="annotation-edit-btn"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteAnnotation(ann.id)}
                      className="annotation-delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {ann.highlightedText && (
                  <blockquote className="annotation-highlight">
                    {ann.highlightedText}
                  </blockquote>
                )}
                <p className="annotation-note">{ann.annotationNote}</p>
                {ann.createdAt && (
                  <span className="annotation-date">
                    {new Date(ann.createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="add-annotation-card">
          <h3 className="add-annotation-title">Add New Annotation</h3>

          {addError && <div className="error-message">{addError}</div>}

          <form onSubmit={handleAddAnnotation} className="add-annotation-form">
            <div className="add-annotation-field">
              <label htmlFor="highlightedText" className="add-annotation-label">
                Highlighted Text
              </label>
              <textarea
                id="highlightedText"
                className="add-annotation-textarea"
                value={highlightedText}
                onChange={(e) => setHighlightedText(e.target.value)}
                placeholder="Paste or type the text excerpt from the paper"
                rows={3}
                required
              />
            </div>

            <div className="add-annotation-field">
              <label htmlFor="annotationNote" className="add-annotation-label">
                Annotation Note
              </label>
              <textarea
                id="annotationNote"
                className="add-annotation-textarea"
                value={annotationNote}
                onChange={(e) => setAnnotationNote(e.target.value)}
                placeholder="Your notes or commentary on this section"
                rows={3}
                required
              />
            </div>

            <div className="add-annotation-row">
              <div className="add-annotation-field">
                <label htmlFor="category" className="add-annotation-label">Category</label>
                <select
                  id="category"
                  className="add-annotation-select"
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

              <div className="add-annotation-field">
                <label htmlFor="pageNumber" className="add-annotation-label">
                  Page Number (optional)
                </label>
                <input
                  id="pageNumber"
                  type="number"
                  className="add-annotation-input"
                  value={pageNumber}
                  onChange={(e) => setPageNumber(e.target.value)}
                  placeholder="e.g., 5"
                  min="1"
                />
              </div>
            </div>

            <div className="add-annotation-actions">
              <button type="submit" className="btn-primary" disabled={addLoading}>
                {addLoading ? 'Adding...' : 'Add Annotation'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaperDetail;
