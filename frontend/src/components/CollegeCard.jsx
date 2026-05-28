import React from 'react';
import { Link } from 'react-router-dom';
import styles from './CollegeCard.module.css';

const CollegeCard = ({ college, onSave, isSaved }) => {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={college.imageUrl || '/campus_1.png'} alt={college.name} className={styles.cardImage} />
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>{college.name}</h3>
          <span className={styles.rating}>⭐ {college.rating}</span>
        </div>
        <p className={styles.location}>{college.location}</p>
        <div className={styles.details}>
          <div className={styles.detailItem}>
            <span className={styles.label}>Avg Fees</span>
            <span className={styles.value}>₹{college.averageFees.toLocaleString()}</span>
          </div>
        </div>
      </div>
      <div className={styles.footer}>
        <Link to={`/college/${college.id}`} className="btn btn-primary" style={{ flex: 1 }}>View Details</Link>
        {onSave && (
          <button 
            className={`btn ${isSaved ? 'btn-primary' : 'btn-outline'}`} 
            onClick={() => onSave(college.id)}
          >
            {isSaved ? 'Saved' : 'Save'}
          </button>
        )}
      </div>
    </div>
  );
};
export default CollegeCard;
