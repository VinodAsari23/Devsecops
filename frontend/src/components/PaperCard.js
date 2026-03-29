/**
 * Paper card component for displaying a summary of a research paper.
 * Shows the paper title, authors, publication year, and annotation count.
 * Used in the Dashboard grid and search results.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import './PaperCard.css';

/**
 * PaperCard component rendering a clickable card for a single paper.
 * @param {Object} props - Component props.
 * @param {Object} props.paper - The paper data object.
 * @param {number} props.paper.id - Unique paper identifier.
 * @param {string} props.paper.title - Title of the research paper.
 * @param {string} props.paper.authors - Authors of the paper.
 * @param {number} props.paper.publicationYear - Year of publication.
 * @param {number} props.paper.annotationCount - Number of annotations.
 * @returns {JSX.Element} The rendered paper card.
 */
const PaperCard = ({ paper }) => {
  return (
    <Link to={`/papers/${paper.id}`} className="paper-card">
      <div className="paper-card-content">
        <h3 className="paper-card-title">{paper.title}</h3>
        <p className="paper-card-authors">{paper.authors}</p>
        <div className="paper-card-footer">
          <span className="paper-card-year">{paper.publicationYear}</span>
          <span className="paper-card-annotations">
            {paper.annotationCount || 0} annotations
          </span>
        </div>
      </div>
    </Link>
  );
};

export default PaperCard;
