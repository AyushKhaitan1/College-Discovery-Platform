import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import styles from './Compare.module.css';
import toast from 'react-hot-toast';

const Compare = () => {
  const { user } = useContext(AuthContext);
  const [collegeOptions, setCollegeOptions] = useState([]);
  const [selectedIds, setSelectedIds] = useState(['', '', '']);
  const [collegeDetails, setCollegeDetails] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch all basic colleges for dropdown
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const res = await api.get('/colleges?limit=100'); 
        setCollegeOptions(res.data.data);
      } catch (err) {
        toast.error("Failed to load colleges");
      }
      setLoading(false);
    };
    fetchColleges();
  }, []);

  // Fetch detailed data when a selection changes
  useEffect(() => {
    selectedIds.forEach(id => {
      if (id && !collegeDetails[id]) {
        api.get(`/colleges/${id}`).then(res => {
          setCollegeDetails(prev => ({...prev, [id]: res.data}));
        }).catch(err => console.error(err));
      }
    });
  }, [selectedIds, collegeDetails]);

  const handleSelect = (index, value) => {
    const newSelected = [...selectedIds];
    newSelected[index] = value;
    setSelectedIds(newSelected);
  };

  const handleSaveComparison = async () => {
    if (!user) return toast.error("Please login to save comparison");
    const validIds = selectedIds.filter(id => id);
    if (validIds.length < 2) return toast.error("Select at least 2 colleges");
    
    try {
      await api.post('/users/saved/comparisons', { collegeIds: validIds });
      toast.success("Comparison saved to profile!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Error saving comparison");
    }
  };

  if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading options...</div>;
  const validSelections = selectedIds.filter(id => id);

  return (
    <div className={styles.container}>
      <header className={styles.header} style={{ backgroundImage: 'url(/compare_banner.png)' }}>
        <div className={styles.headerOverlay}></div>
        <div className={styles.headerContent}>
          <h1 className="animate-fade-in">Compare Colleges</h1>
          <p className="animate-fade-in" style={{animationDelay: '0.1s'}}>Select two colleges to evaluate their fees, placements, and ratings side-by-side.</p>
          {validSelections.length >= 2 && (
            <button className="btn btn-primary animate-fade-in" onClick={handleSaveComparison} style={{ marginTop: '1.5rem', animationDelay:'0.2s' }}>
              Save Comparison
            </button>
          )}
        </div>
      </header>

      <div className={styles.compareWrapper}>
        <div className={styles.compareGrid}>
          {/* Features Column */}
          <div className={styles.featureColumn}>
            <div className={styles.cellHeader}>Features</div>
            <div className={styles.cellLabel}>Location</div>
            <div className={styles.cellLabel}>Overall Rating</div>
            <div className={styles.cellLabel}>Average Fees</div>
            <div className={styles.cellLabel} style={{background: 'var(--primary-light)'}}>Highest Package</div>
            <div className={styles.cellLabel} style={{background: 'var(--primary-light)'}}>Average Package</div>
          </div>

          {/* Dynamic Columns */}
          {selectedIds.map((selectedId, index) => {
            const detail = collegeDetails[selectedId];
            const placement = detail?.placements?.[0]; // Usually highest/latest

            return (
              <div key={index} className={styles.collegeColumn}>
                <div className={styles.cellHeader}>
                  <select 
                    value={selectedId} 
                    onChange={(e) => handleSelect(index, e.target.value)}
                    className={styles.select}
                  >
                    <option value="">Select College {index + 1}</option>
                    {collegeOptions.map(c => (
                      <option key={c.id} value={c.id} disabled={selectedIds.includes(c.id)}>{c.name}</option>
                    ))}
                  </select>
                </div>
                
                {detail ? (
                  <>
                    <div className={styles.cellValue}>{detail.location}</div>
                    <div className={styles.cellValue} style={{fontWeight: 700}}>⭐ {detail.rating}</div>
                    <div className={styles.cellValue}>₹{detail.averageFees.toLocaleString()}/yr</div>
                    <div className={styles.cellValue} style={{color: 'var(--success)', fontWeight: 700}}>
                      {placement ? `₹${(placement.highestPackage/100000).toFixed(1)} LPA` : 'N/A'}
                    </div>
                    <div className={styles.cellValue} style={{fontWeight: 600}}>
                      {placement ? `₹${(placement.averagePackage/100000).toFixed(1)} LPA` : 'N/A'}
                    </div>
                  </>
                ) : (
                  <>
                    <div className={styles.cellValueEmpty}>-</div>
                    <div className={styles.cellValueEmpty}>-</div>
                    <div className={styles.cellValueEmpty}>-</div>
                    <div className={styles.cellValueEmpty}>-</div>
                    <div className={styles.cellValueEmpty}>-</div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default Compare;
