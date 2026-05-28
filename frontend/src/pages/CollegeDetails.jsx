import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import styles from './CollegeDetails.module.css';

const CollegeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedColleges, setSavedColleges] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [collegeRes, savedRes] = await Promise.all([
          api.get(`/colleges/${id}`),
          user ? api.get('/users/saved') : Promise.resolve({ data: { savedColleges: [] } })
        ]);
        setCollege(collegeRes.data);
        if (user) {
          setSavedColleges(new Set(savedRes.data.savedColleges.map(c => c.id)));
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchData();
  }, [id, user]);

  const handleSave = async () => {
    if (!user) return navigate('/login');
    try {
      if (savedColleges.has(id)) {
        await api.delete(`/users/saved/colleges/${id}`);
        setSavedColleges(prev => { const n = new Set(prev); n.delete(id); return n; });
      } else {
        await api.post('/users/saved/colleges', { collegeId: id });
        setSavedColleges(prev => { const n = new Set(prev); n.add(id); return n; });
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading...</div>;
  if (!college) return <div className="container">College not found</div>;

  return (
    <div className={styles.container}>
      <div className={styles.hero} style={{ backgroundImage: `url(${college.imageUrl || '/campus_1.png'})` }}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>{college.name}</h1>
          <p className={styles.location}>📍 {college.location}</p>
          <div className={styles.rating}>⭐ {college.rating} / 5.0</div>
          <button 
            className={`btn ${savedColleges.has(college.id) ? 'btn-primary' : 'btn-outline'}`}
            onClick={handleSave}
            style={{ marginTop: '1rem' }}
          >
            {savedColleges.has(college.id) ? 'Saved to Profile' : 'Save College'}
          </button>
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.mainContent}>
          <section className={styles.section}>
            <h2>Overview</h2>
            <p className={styles.text}>{college.overview}</p>
          </section>

          <section className={styles.section}>
            <h2>Courses & Fees</h2>
            <div className={styles.cardList}>
              {college.courses.map(course => (
                <div key={course.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h3>{course.name}</h3>
                    <span className={styles.duration}>{course.duration}</span>
                  </div>
                  <div className={styles.fee}>₹{course.fees.toLocaleString()} / year</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className={styles.sideContent}>
          <section className={styles.section}>
            <h2>Placements</h2>
            <div className={styles.statsGrid}>
              {college.placements.map(placement => (
                <div key={placement.id} className={styles.statBox}>
                  <div className={styles.statYear}>Class of {placement.year}</div>
                  <div className={styles.statRow}>
                    <span>Highest Package</span>
                    <strong className={styles.statHighlight}>₹{(placement.highestPackage / 100000).toFixed(1)} LPA</strong>
                  </div>
                  <div className={styles.statRow}>
                    <span>Average Package</span>
                    <strong>₹{(placement.averagePackage / 100000).toFixed(1)} LPA</strong>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CollegeDetails;
