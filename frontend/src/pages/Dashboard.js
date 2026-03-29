/**
 * Dashboard page component for the Research Paper Annotation Tool.
 * Displays summary statistics (total papers, annotations, category breakdown)
 * and a grid of paper cards for quick navigation.
 */
import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import PaperCard from '../components/PaperCard';
import './Dashboard.css';

/**
 * Dashboard component serving as the main landing page after authentication.
 * Fetches all papers and computes aggregate statistics for display.
 * @returns {JSX.Element} The rendered dashboard page.
 */
const Dashboard = () => {
  const [papers, setPapers] = useState([]);
  const [annotations, setAnnotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /**
   * Fetch all papers and their annotations on component mount.
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const papersRes = await api.get('/api/papers');
        const papersData = papersRes.data;
        setPapers(papersData);

        const allAnnotations = [];
        for (const paper of papersData) {
          try {
            const annRes = await api.get(`/api/papers/${paper.id}/annotations`);
            allAnnotations.push(...annRes.data);
          } catch (annErr) {
            /* Silently skip papers where annotations fail to load */
          }
        }
        setAnnotations(allAnnotations);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  /**
   * Compute the count of annotations per category.
   * @returns {Object} A map of category names to their counts.
   */
  const getCategoryBreakdown = () => {
    const categories = {
      KEY_FINDING: 0,
      METHODOLOGY: 0,
      QUESTION: 0,
      CRITIQUE: 0,
      REFERENCE: 0,
      OTHER: 0,
    };
    annotations.forEach((ann) => {
      if (categories.hasOwnProperty(ann.category)) {
        categories[ann.category]++;
      }
    });
    return categories;
  };

  /**
   * Map category names to their display colors.
   */
  const categoryColors = {
    KEY_FINDING: '#4caf50',
    METHODOLOGY: '#2196f3',
    QUESTION: '#7c4dff',
    CRITIQUE: '#f44336',
    REFERENCE: '#009688',
    OTHER: '#9e9e9e',
  };

  /**
   * Map category names to human-readable labels.
   */
  const categoryLabels = {
    KEY_FINDING: 'Key Finding',
    METHODOLOGY: 'Methodology',
    QUESTION: 'Question',
    CRITIQUE: 'Critique',
    REFERENCE: 'Reference',
    OTHER: 'Other',
  };

  if (loading) {
    return <div className="loading-spinner">Loading dashboard...</div>;
  }

  const breakdown = getCategoryBreakdown();

  return (
    <div className="page-container">
      <h1 className="page-title">Research Dashboard</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-stats-bar">
        <div className="dashboard-stat-card">
          <span className="dashboard-stat-number">{papers.length}</span>
          <span className="dashboard-stat-label">Total Papers</span>
        </div>
        <div className="dashboard-stat-card">
          <span className="dashboard-stat-number">{annotations.length}</span>
          <span className="dashboard-stat-label">Total Annotations</span>
        </div>
        {Object.entries(breakdown).map(([category, count]) => (
          <div className="dashboard-stat-card dashboard-stat-category" key={category}>
            <span
              className="dashboard-stat-number"
              style={{ color: categoryColors[category] }}
            >
              {count}
            </span>
            <span className="dashboard-stat-label">{categoryLabels[category]}</span>
          </div>
        ))}
      </div>

      {papers.length === 0 ? (
        <div className="dashboard-empty">
          <h2>No papers yet</h2>
          <p>Add your first research paper to get started with annotations.</p>
        </div>
      ) : (
        <div className="dashboard-grid">
          {papers.map((paper) => (
            <PaperCard key={paper.id} paper={paper} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
