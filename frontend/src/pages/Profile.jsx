import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import CollegeCard from '../components/CollegeCard';
import styles from './Profile.module.css';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [savedColleges, setSavedColleges] = useState([]);
  const [savedComparisons, setSavedComparisons] = useState([]);
  const [allColleges, setAllColleges] = useState({});
  const [loading, setLoading] = useState(true);

  // Edit Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const fetchData = async () => {
      try {
        const [savedRes, collegesRes] = await Promise.all([
          api.get('/users/saved'),
          api.get('/colleges?limit=100')
        ]);
        
        setSavedColleges(savedRes.data.savedColleges);
        setSavedComparisons(savedRes.data.savedComparisons);
        
        const collegeMap = {};
        collegesRes.data.data.forEach(c => collegeMap[c.id] = c);
        setAllColleges(collegeMap);
      } catch (err) {
        toast.error("Failed to load profile data");
      }
      setLoading(false);
    };
    fetchData();
  }, [user, navigate]);

  const handleUnsave = async (id) => {
    try {
      await api.delete(`/users/saved/colleges/${id}`);
      setSavedColleges(prev => prev.filter(c => c.id !== id));
      toast.success("Removed from saved list");
    } catch (err) {
      toast.error("Error removing college");
    }
  };

  const handleDeleteComparison = async (id) => {
    try {
      await api.delete(`/users/saved/comparisons/${id}`);
      setSavedComparisons(prev => prev.filter(c => c.id !== id));
      toast.success("Comparison removed");
    } catch (err) {
      toast.error("Error removing comparison");
    }
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    if (!editName) return;
    setIsSaving(true);
    try {
      const res = await api.put('/users/profile', { name: editName });
      updateUser({ name: res.data.name });
      setIsEditing(false);
      toast.success(res.data.message);
    } catch (err) {
      toast.error('Failed to update profile');
    }
    setIsSaving(false);
  };

  if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading profile...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>{user?.name?.charAt(0).toUpperCase()}</div>
          <div>
            <h1 className={styles.name}>{user?.name}</h1>
            <p className={styles.email}>{user?.email}</p>
          </div>
        </div>
        <button 
          className="btn btn-outline" 
          onClick={() => { setEditName(user?.name); setIsEditing(true); }}
        >
          Edit Profile
        </button>
      </header>

      {isEditing && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Edit Profile</h3>
            <form onSubmit={handleEditProfile}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Display Name</label>
                <input 
                  type="text" 
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsEditing(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <section className={styles.section}>
        <h2>Saved Colleges</h2>
        {savedColleges.length === 0 ? (
          <p className={styles.empty}>You haven't saved any colleges yet.</p>
        ) : (
          <div className={styles.grid}>
            {savedColleges.map(college => (
              <CollegeCard 
                key={college.id} 
                college={college} 
                onSave={handleUnsave}
                isSaved={true}
              />
            ))}
          </div>
        )}
      </section>

      <section className={styles.section}>
        <h2>Saved Comparisons</h2>
        {savedComparisons.length === 0 ? (
          <p className={styles.empty}>You haven't saved any comparisons yet.</p>
        ) : (
          <div className={styles.comparisonList}>
            {savedComparisons.map(comp => (
              <div key={comp.id} className={styles.comparisonCard}>
                <div className={styles.compHeader}>
                  <span className={styles.date}>Saved on {new Date(comp.createdAt).toLocaleDateString()}</span>
                  <button className="btn btn-outline" onClick={() => handleDeleteComparison(comp.id)} style={{padding: '0.25rem 0.75rem', fontSize: '0.8rem'}}>Remove</button>
                </div>
                <div className={styles.compColleges}>
                  {comp.collegeIds.map((cId, i) => (
                    <React.Fragment key={cId}>
                      <span className={styles.compName}>{allColleges[cId]?.name || 'Unknown'}</span>
                      {i < comp.collegeIds.length - 1 && <span className={styles.vs}>VS</span>}
                    </React.Fragment>
                  ))}
                </div>
                <Link to="/compare" className="btn btn-primary" style={{marginTop: '1rem', width: '100%'}}>Go to Compare Tool</Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
export default Profile;
