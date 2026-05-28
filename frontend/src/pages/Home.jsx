import React, { useState, useEffect } from 'react';
import api from '../services/api';
import CollegeCard from '../components/CollegeCard';
import { useInView } from 'react-intersection-observer';
import styles from './Home.module.css';
import toast from 'react-hot-toast';

const Home = () => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  
  // Filters
  const [search, setSearch] = useState('');
  const [minRating, setMinRating] = useState('');
  const [maxFees, setMaxFees] = useState('');

  // Slider State
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    '/campus_1.png',
    '/campus_2.png',
    '/campus_3.png',
    '/campus_4.png'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  const fetchColleges = async (pageNum, isNewSearch = false) => {
    setLoading(true);
    try {
      let url = `/colleges?page=${pageNum}&limit=9&q=${search}`;
      if (minRating) url += `&minRating=${minRating}`;
      if (maxFees) url += `&maxFees=${maxFees}`;

      const res = await api.get(url);
      const newColleges = res.data.data;
      
      setColleges(prev => isNewSearch ? newColleges : [...prev, ...newColleges]);
      setHasMore(pageNum < res.data.meta.totalPages);
    } catch (error) {
      toast.error('Failed to load colleges');
      console.error(error);
    }
    setLoading(false);
  };

  // When filters change, reset page to 1
  useEffect(() => {
    setPage(1);
    fetchColleges(1, true);
    // eslint-disable-next-line
  }, [search, minRating, maxFees]);

  // When inView becomes true, load next page
  useEffect(() => {
    if (inView && hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchColleges(nextPage, false);
    }
    // eslint-disable-next-line
  }, [inView]);

  return (
    <div className={styles.home}>
      <header className={styles.hero}>
        {slides.map((slide, index) => (
          <div 
            key={index} 
            className={`${styles.heroBg} ${index === currentSlide ? styles.activeBg : ''}`}
            style={{ backgroundImage: `url(${slide})` }}
          />
        ))}
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1 className="animate-fade-in">Find Your Dream College</h1>
          <p className="animate-fade-in" style={{animationDelay: '0.1s'}}>Discover and compare top colleges across India.</p>
          <div className={`${styles.searchBar} animate-fade-in`} style={{animationDelay: '0.2s'}}>
            <input 
              type="text" 
              placeholder="Search colleges by name..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </header>

      <div className={styles.layout}>
        <aside className={styles.filters}>
          <h3>Filters</h3>
          <div className={styles.filterGroup}>
            <label>Minimum Rating</label>
            <select value={minRating} onChange={e => setMinRating(e.target.value)}>
              <option value="">All Ratings</option>
              <option value="4.5">4.5 & above</option>
              <option value="4.0">4.0 & above</option>
              <option value="3.5">3.5 & above</option>
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label>Maximum Fees (per year)</label>
            <select value={maxFees} onChange={e => setMaxFees(e.target.value)}>
              <option value="">Any Fees</option>
              <option value="150000">₹1.5 Lakhs</option>
              <option value="250000">₹2.5 Lakhs</option>
              <option value="500000">₹5.0 Lakhs</option>
            </select>
          </div>
        </aside>

        <section className={styles.listing}>
          <div className={styles.grid}>
            {colleges.map((college, index) => (
              <CollegeCard key={`${college.id}-${index}`} college={college} />
            ))}
          </div>
          
          {loading && <div className={styles.loading}>Loading more colleges...</div>}
          {!loading && colleges.length === 0 && <div className={styles.empty}>No colleges found matching your criteria.</div>}
          
          {/* Intersection Observer target */}
          <div ref={ref} style={{ height: '20px', width: '100%', marginTop: '2rem' }}></div>
          
          {!hasMore && colleges.length > 0 && (
            <div className={styles.endMessage}>You've reached the end of the list.</div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
