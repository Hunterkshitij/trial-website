import { useState } from 'react';

export default function IntakeForm() {
  const [formData, setFormData] = useState({ name: '', email: '', courseInterest: 'English', message: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // This URL MUST match your backend port (5000)
      const response = await fetch('http://localhost:5001/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setStatus('✅ Thanks for reaching out! We will be in touch shortly.');
        setFormData({ name: '', email: '', courseInterest: 'English', message: '' });
      } else {
        setStatus('❌ Error submitting form. Please try again.');
      }
    } catch (error) {
      setStatus('❌ Server not responding. Is your backend running in the other terminal?');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center' }}>Request Course Information</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        <input 
          type="text" placeholder="Name" required 
          value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} 
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        
        <input 
          type="email" placeholder="Email" required 
          value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} 
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        
        <select 
          value={formData.courseInterest} onChange={(e) => setFormData({...formData, courseInterest: e.target.value})}
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="English">English Classes</option>
          <option value="Computer">Computer Classes</option>
          <option value="Other">Other</option>
        </select>
        
        <textarea 
          placeholder="How can we help you?" rows="4" 
          value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} 
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        
        <button type="submit" style={{ padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Submit Inquiry
        </button>
      </form>
      
      {status && <p style={{ marginTop: '20px', textAlign: 'center', fontWeight: 'bold' }}>{status}</p>}
    </div>
  );
}