/**
 * Search Papers page component for the Research Paper Annotation Tool.
 * Provides a search input that queries the API and displays matching papers.
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import './SearchPapers.css';

/**
 * SearchPapers component with a search bar and results list.
 * Queries the /api/papers/search endpoint with user input.
 * @returns {JSX.Element} The rendered search page.
 */
const SearchPapers = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * Handle search form submission.
   * @param {Event} e - The form submission event.
   */
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setError('');
    setLoading(true);
    setSearched(true);
    try {
      const response = await api.get('/api/papers/search', { params: { q: query } });
      setResults(response.data.papers || []);
      setTotalResults(response.data.totalResults || 0);
    } catch (err) {
      setError(err.response?.data?.detail || 'Search failed. Please try again.');
      setResults([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Search Papers</h1>

      <div className="search-bar-card">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, author, or keyword..."
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {error && <div className="error-message">{error}</div>}

      {searched && !loading && (
        <div className="search-results-section">
          <p className="search-results-count">
            {totalResults} result{totalResults !== 1 ? 's' : ''} found for "{query}"
          </p>

          {results.length === 0 ? (
            <div className="search-no-results">
              No papers match your search criteria. Try different keywords.
            </div>
          ) : (
            <div className="search-results-list">
              {results.map((paper) => (
                <Link to={`/papers/${paper.id}`} key={paper.id} className="search-result-card">
                  <div className="search-result-content">
                    <h3 className="search-result-title">{paper.title}</h3>
                    <p className="search-result-authors">{paper.authors}</p>
                    <div className="search-result-meta">
                      <span className="search-result-year">{paper.publicationYear}</span>
                      {paper.annotationCount !== undefined && (
                        <span className="search-result-annotations">
                          {paper.annotationCount} annotations
                        </span>
                      )}
                    </div>
                    {paper.abstract && (
                      <p className="search-result-abstract">
                        {paper.abstract.length > 200
                          ? paper.abstract.substring(0, 200) + '...'
                          : paper.abstract}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPapers;
