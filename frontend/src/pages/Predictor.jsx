import React, { useState } from 'react';
import api from '../services/api';
import CollegeCard from '../components/CollegeCard';
import styles from './Predictor.module.css';
import toast from 'react-hot-toast';

const Predictor = () => {
  const [exam, setExam] = useState('');
  const [rank, setRank] = useState('');
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handlePredict = async (e) => {
    e.preventDefault();
    if (!exam || !rank) return toast.error("Please provide both exam and rank");

    setLoading(true);
    setHasSearched(true);
    try {
      const res = await api.get(`/colleges/predict?exam=${exam}&rank=${rank}`);
      setColleges(res.data);
    } catch (err) {
      toast.error("Prediction failed");
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header} style={{ backgroundImage: 'url(/predictor_banner.png)' }}>
        <div className={styles.headerOverlay}></div>
        <div className={styles.headerContent}>
          <h1 className="animate-fade-in">College Predictor</h1>
          <p className="animate-fade-in" style={{animationDelay: '0.1s'}}>Enter your competitive exam rank to see which colleges you might be eligible for!</p>
        </div>
      </header>

      <div className={styles.formContainer}>
        <form onSubmit={handlePredict} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Exam</label>
            <select value={exam} onChange={e => setExam(e.target.value)} required>
              <option value="">Select Exam</option>
              <option value="JEE Advanced">JEE Advanced</option>
              <option value="JEE Main">JEE Main</option>
              <option value="BITSAT">BITSAT (Score instead of rank)</option>
              <option value="VITEEE">VITEEE</option>
              <option value="WBJEE">WBJEE</option>
              <option value="KCET">KCET</option>
              <option value="MHT CET">MHT CET</option>
              <option value="MET">Manipal MET</option>
              <option value="SRMJEEE">SRMJEEE</option>
              <option value="SITEEE">SITEEE</option>
              <option value="LPUNEST">LPUNEST</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Your Score</label>
            <input 
              type="number" 
              value={rank} 
              onChange={e => setRank(e.target.value)} 
              placeholder="e.g. 5000" 
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Predicting...' : 'Predict Colleges'}
          </button>
        </form>
      </div>

      {hasSearched && (
        <section className={styles.results}>
          <h2>{colleges.length > 0 ? 'Recommended Colleges' : 'No matches found'}</h2>
          {colleges.length > 0 && (
            <div className={styles.grid}>
              {colleges.map(college => (
                <CollegeCard key={college.id} college={college} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};
export default Predictor;
