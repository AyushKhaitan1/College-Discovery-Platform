import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import styles from './ForumThread.module.css';
import toast from 'react-hot-toast';

const ForumThread = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  // Edit states for question
  const [editingQuestion, setEditingQuestion] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  // Edit states for answers
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editAnswerContent, setEditAnswerContent] = useState('');

  const fetchThread = async () => {
    try {
      const res = await api.get(`/forum/${id}`);
      setQuestion(res.data);
    } catch (err) {
      toast.error('Failed to load thread');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchThread();
  }, [id]);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('You must be logged in to reply');
    setIsReplying(true);
    try {
      await api.post(`/forum/${id}/answers`, { content: reply });
      setReply('');
      toast.success('Reply posted!');
      fetchThread();
    } catch (err) {
      toast.error('Failed to post reply');
    }
    setIsReplying(false);
  };

  const handleDeleteQuestion = async () => {
    if (!window.confirm('Are you sure you want to delete this discussion?')) return;
    try {
      await api.delete(`/forum/${id}`);
      toast.success('Deleted successfully');
      navigate('/forum');
    } catch (e) {
      toast.error('Failed to delete');
    }
  };

  const handleUpdateQuestion = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/forum/${id}`, { title: editTitle, content: editContent });
      setEditingQuestion(false);
      toast.success('Updated successfully');
      fetchThread();
    } catch (e) {
      toast.error('Failed to update');
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    if (!window.confirm('Are you sure you want to delete this reply?')) return;
    try {
      await api.delete(`/forum/${id}/answers/${answerId}`);
      toast.success('Deleted successfully');
      fetchThread();
    } catch (e) {
      toast.error('Failed to delete reply');
    }
  };

  const handleUpdateAnswer = async (e, answerId) => {
    e.preventDefault();
    try {
      await api.put(`/forum/${id}/answers/${answerId}`, { content: editAnswerContent });
      setEditingAnswerId(null);
      toast.success('Reply updated successfully');
      fetchThread();
    } catch (e) {
      toast.error('Failed to update reply');
    }
  };

  if (loading) return <div className="container" style={{padding: '4rem', textAlign: 'center'}}>Loading thread...</div>;
  if (!question) return <div className="container" style={{padding: '4rem', textAlign: 'center'}}>Thread not found</div>;

  const isQuestionOwner = user && user.id === question.user.id;

  return (
    <div className={styles.container}>
      <Link to="/forum" className={styles.backLink}>← Back to Forum</Link>
      
      <div className={styles.questionSection}>
        {editingQuestion ? (
          <form onSubmit={handleUpdateQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input 
              type="text" 
              value={editTitle} 
              onChange={e => setEditTitle(e.target.value)} 
              className={styles.textarea} 
              style={{ fontSize: '1.5rem', fontWeight: 'bold' }}
              required 
            />
            <textarea 
              value={editContent} 
              onChange={e => setEditContent(e.target.value)} 
              className={styles.textarea} 
              rows={5} 
              required 
            />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-primary">Save Changes</button>
              <button type="button" className="btn btn-outline" onClick={() => setEditingQuestion(false)}>Cancel</button>
            </div>
          </form>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h1 className={styles.title}>{question.title}</h1>
              {isQuestionOwner && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => { setEditTitle(question.title); setEditContent(question.content); setEditingQuestion(true); }} className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.85rem' }}>Edit</button>
                  <button onClick={handleDeleteQuestion} className="btn" style={{ padding: '0.25rem 0.75rem', fontSize: '0.85rem', backgroundColor: '#ef4444', color: 'white' }}>Delete</button>
                </div>
              )}
            </div>
            <div className={styles.meta}>
              Asked by <span style={{fontWeight: 700}}>{question.user.name}</span> on {new Date(question.createdAt).toLocaleString()}
            </div>
            <div className={styles.content}>{question.content}</div>
          </>
        )}
      </div>

      <div className={styles.answersSection}>
        <h2>{question.answers.length} {question.answers.length === 1 ? 'Reply' : 'Replies'}</h2>
        
        <div className={styles.answersList}>
          {question.answers.map(ans => {
            const isAnswerOwner = user && user.id === ans.user.id;
            return (
              <div key={ans.id} className={styles.answerCard}>
                <div className={styles.answerMeta} style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div className={styles.avatar}>{ans.user.name.charAt(0).toUpperCase()}</div>
                    <div>
                      <strong>{ans.user.name}</strong> 
                      <span className={styles.date}>{new Date(ans.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                  {isAnswerOwner && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => { setEditAnswerContent(ans.content); setEditingAnswerId(ans.id); }} className="btn btn-outline" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', border: 'none' }}>Edit</button>
                      <button onClick={() => handleDeleteAnswer(ans.id)} className="btn" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', color: '#ef4444', background: 'none' }}>Delete</button>
                    </div>
                  )}
                </div>
                
                {editingAnswerId === ans.id ? (
                  <form onSubmit={(e) => handleUpdateAnswer(e, ans.id)} style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <textarea 
                      value={editAnswerContent} 
                      onChange={e => setEditAnswerContent(e.target.value)} 
                      className={styles.textarea} 
                      rows={3} 
                      required 
                    />
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Save</button>
                      <button type="button" className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }} onClick={() => setEditingAnswerId(null)}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  <div className={styles.answerContent}>{ans.content}</div>
                )}
              </div>
            );
          })}
        </div>

        <div className={styles.replyBox}>
          <h3>Your Reply</h3>
          {user ? (
            <form onSubmit={handleReply}>
              <textarea 
                placeholder="Write your answer..." 
                value={reply} 
                onChange={e => setReply(e.target.value)} 
                required 
                className={styles.textarea}
                rows={4}
              />
              <button type="submit" className="btn btn-primary" disabled={isReplying}>
                {isReplying ? 'Posting...' : 'Post Reply'}
              </button>
            </form>
          ) : (
            <div className={styles.loginPrompt}>
              <p>Please log in to participate in this discussion.</p>
              <Link to="/login" className="btn btn-outline">Log In</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ForumThread;
