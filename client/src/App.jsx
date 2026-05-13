import { Routes, Route, Link } from 'react-router-dom';
import IntakeForm from './components/IntakeForm';

function App() {
  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      {/* Navigation Bar */}
      <nav style={{ padding: '20px', backgroundColor: '#333', color: 'white', display: 'flex', gap: '20px' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Home</Link>
        <Link to="/inquiry" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Course Inquiry</Link>
      </nav>

      {/* Page Routes */}
      <Routes>
        <Route path="/" element={<h1 style={{ textAlign: 'center', marginTop: '50px' }}>Welcome to the Coaching Institute</h1>} />
        <Route path="/inquiry" element={<IntakeForm />} />
      </Routes>
    </div>
  );
}

export default App;