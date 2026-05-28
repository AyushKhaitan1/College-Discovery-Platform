import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CollegeDetails from './pages/CollegeDetails';
import Compare from './pages/Compare';
import Profile from './pages/Profile';
import Predictor from './pages/Predictor';
import Forum from './pages/Forum';
import ForumThread from './pages/ForumThread';

function App() {
  return (
    <Router>
      <Navbar />
      <main className="container" style={{ padding: '2rem 1rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/college/:id" element={<CollegeDetails />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/predictor" element={<Predictor />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/forum/:id" element={<ForumThread />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
