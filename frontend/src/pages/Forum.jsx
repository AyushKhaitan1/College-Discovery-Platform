import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import styles from './Forum.module.css';
import toast from 'react-hot-toast';

const Forum = () => {
  const { user } = useContext(AuthContext);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await api.get('/forum');
      setQuestions(res.data);
    } catch (err) {
      toast.error('Failed to load discussions');
    }
    setLoading(false);
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('You must be logged in to post');
    setIsPosting(true);
    try {
      await api.post('/forum', { title: newTitle, content: newContent });
      setNewTitle('');
      setNewContent('');
      toast.success('Question posted successfully');
      fetchQuestions();
    } catch (err) {
      toast.error('Failed to post question');
    }
    setIsPosting(false);
  };

  if (loading) return <div className="container" style={{padding: '4rem', textAlign: 'center'}}>Loading discussions...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header} style={{ backgroundImage: 'url(/hub_banner.png)' }}>
        <div className={styles.headerOverlay}></div>
        <div className={styles.headerContent}>
          <h1 className="animate-fade-in">Community Hub</h1>
          <p className="animate-fade-in" style={{animationDelay: '0.1s'}}>Ask questions, share advice, and discuss colleges with the community.</p>
        </div>
      </header>

      <div className={styles.layout}>
        <section className={styles.feed}>
          {questions.length === 0 ? (
             <div className={styles.empty}>No discussions yet. Be the first to ask!</div>
          ) : (
            questions.map(q => (
              <Link to={`/forum/${q.id}`} key={q.id} className={styles.questionCard}>
                <h3 className={styles.qTitle}>{q.title}</h3>
                <p className={styles.qPreview}>{q.content.substring(0, 150)}{q.content.length > 150 ? '...' : ''}</p>
                <div className={styles.qFooter}>
                  <span>Asked by <span style={{fontWeight: 600}}>{q.user.name}</span></span>
                  <span className={styles.repliesCount}>{q._count.answers} replies</span>
                  <span>{new Date(q.createdAt).toLocaleDateString()}</span>
                </div>
              </Link>
            ))
          )}
        </section>

        <aside className={styles.sidebar}>
          <div className={styles.postBox}>
            <h3>Ask a Question</h3>
            {user ? (
              <form onSubmit={handlePost}>
                <input 
                  type="text" 
                  placeholder="Question Title" 
                  value={newTitle} 
                  onChange={e => setNewTitle(e.target.value)} 
                  required 
                  className={styles.input}
                />
                <textarea 
                  placeholder="Explain your question in detail..." 
                  value={newContent} 
                  onChange={e => setNewContent(e.target.value)} 
                  required 
                  className={styles.textarea}
                  rows={5}
                />
                <button type="submit" className="btn btn-primary" style={{width: '100%'}} disabled={isPosting}>
                  {isPosting ? 'Posting...' : 'Post Question'}
                </button>
              </form>
            ) : (
              <div style={{textAlign: 'center', padding: '1rem 0'}}>
                <p style={{marginBottom: '1rem', color: 'var(--text-secondary)'}}>Login to join the discussion.</p>
                <Link to="/login" className="btn btn-outline" style={{width: '100%'}}>Log In</Link>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};
export default Forum;
