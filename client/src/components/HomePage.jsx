import React, { useState, useRef, useEffect } from 'react';

// --- 1. Falling Petals Animation ---
const FallingPetals = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  const petals = Array.from({ length: 35 }).map((_, i) => {
    const left = Math.random() * 100; 
    const animationDuration = 4 + Math.random() * 4; 
    const animationDelay = Math.random() * 1.5; 
    const size = 12 + Math.random() * 18; 

    return (
      <div
        key={i}
        className="petal bg-gradient-to-br from-purple-300 to-purple-500 opacity-70"
        style={{
          left: `${left}vw`,
          width: `${size}px`,
          height: `${size}px`,
          animationDuration: `${animationDuration}s`,
          animationDelay: `${animationDelay}s`,
          borderRadius: '0 50% 50% 50%',
        }}
      />
    );
  });

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
      <style>{`
        @keyframes petalFall {
          0% { transform: translateY(-10vh) rotate(0deg) scale(0.8); opacity: 0; }
          10% { opacity: 0.8; }
          80% { opacity: 0.8; }
          100% { transform: translateY(110vh) rotate(720deg) scale(1.2); opacity: 0; }
        }
        .petal {
          position: absolute;
          top: -5%;
          animation-name: petalFall;
          animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
          animation-fill-mode: forwards;
          box-shadow: 0 0 15px rgba(168, 85, 247, 0.4);
        }
      `}</style>
      {petals}
    </div>
  );
};

// --- 2. Animated Counter Helper ---
const AnimatedCounter = ({ end, suffix, trigger }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const totalFrames = 60; 
    const increment = end / totalFrames;
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 20);
    return () => clearInterval(timer);
  }, [trigger, end]);

  return <span className="text-5xl font-extrabold text-white">{count}{suffix}</span>;
};

// --- 3. Interactive Floating Clients Component ---
const FloatingClients = ({ clients }) => {
  const sectionRef = useRef(null);
  const wrapperRefs = useRef([]);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          if (!sectionRef.current) {
            ticking.current = false;
            return;
          }
          const rect = sectionRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          
          if (rect.top <= windowHeight && rect.bottom >= 0) {
            const progress = 1 - (rect.bottom / (windowHeight + rect.height));
            
            wrapperRefs.current.forEach((el, index) => {
              if (el) {
                 const pos = positions[index % positions.length];
                 const translateY = (progress - 0.5) * -700 * pos.speed; 
                 el.style.transform = `translateY(${translateY}px)`;
              }
            });
          }
          ticking.current = false;
        });
        ticking.current = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); 
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const positions = [
    { top: '10%', left: '8%', speed: 1.4 },
    { top: '5%', left: '42%', speed: 0.8 },
    { top: '15%', left: '78%', speed: 1.5 },
    { top: '35%', left: '5%', speed: 1.1 },
    { top: '40%', left: '82%', speed: 0.9 },
    { top: '65%', left: '12%', speed: 1.6 },
    { top: '75%', left: '48%', speed: 0.7 },
    { top: '60%', left: '85%', speed: 1.4 },
    { top: '25%', left: '25%', speed: 1.8 },
    { top: '22%', left: '62%', speed: 1.2 },
    { top: '58%', left: '28%', speed: 0.9 },
    { top: '52%', left: '68%', speed: 1.1 },
  ];

  return (
    <section ref={sectionRef} className="relative h-[90vh] bg-gradient-to-b from-white to-gray-50 overflow-hidden flex items-center justify-center border-t border-gray-100">
      <style>{`
        @keyframes gentleFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }
      `}</style>
      <div className="z-10 text-center relative pointer-events-none px-4">
        <h2 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight drop-shadow-2xl">
          Our Clients
        </h2>
        <div className="w-24 h-1 bg-purple-500 mx-auto rounded-full mt-6 shadow-lg"></div>
      </div>
      {clients.map((client, i) => {
        const pos = positions[i % positions.length];
        return (
          <div key={i} ref={(el) => (wrapperRefs.current[i] = el)} className="absolute z-20 will-change-transform" style={{ top: pos.top, left: pos.left }}>
            <div className="w-24 h-24 md:w-32 md:h-28 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] p-4 flex items-center justify-center border border-gray-50 hover:scale-110 hover:shadow-2xl transition-all duration-300 cursor-pointer" style={{ animation: `gentleFloat ${5 + (i % 3)}s ease-in-out infinite`, animationDelay: `${i * 0.4}s` }}>
              <img src={client.img} alt={client.name} className="max-h-full max-w-full object-contain grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition duration-300" />
            </div>
          </div>
        );
      })}
    </section>
  );
};

// --- 4. Reusable Policy Modal Component ---
const PolicyModal = ({ title, isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl relative max-h-[90vh] flex flex-col">
        <button onClick={onClose} className="absolute top-4 right-6 text-4xl text-gray-400 hover:text-gray-800 transition z-50 leading-none cursor-pointer">
          ×
        </button>
        <div className="p-8 md:p-12 overflow-y-auto no-scrollbar">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4 text-center">{title}</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed text-sm md:text-base text-left">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN HOMEPAGE COMPONENT ---
export default function HomePage() {
  const [isHiringFormOpen, setIsHiringFormOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isCookieModalOpen, setIsCookieModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [statsTriggered, setStatsTriggered] = useState(false);
  
  const sliderRef = useRef(null);
  const statsRef = useRef(null);

  // --- FORM STATE MANAGEMENT ---
  const [formData, setFormData] = useState({
    fullName: '', contactNo: '', address: '', education: '', github: '', linkedin: '', experience: ''
  });
  const [formStatus, setFormStatus] = useState(null); 
  
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // UPDATED: Submits to your Port 5001 server
  const handleHiringSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('submitting');

    try {
      // Changed port to 5001 to match your backend!
      const response = await fetch('http://localhost:5001/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setFormStatus('success');
        setTimeout(() => {
          setFormStatus(null);
          setFormData({fullName: '', contactNo: '', address: '', education: '', github: '', linkedin: '', experience: ''});
          setIsHiringFormOpen(false);
        }, 2000);
      } else {
        setFormStatus('error');
      }
    } catch (error) {
      console.error('Submission Error:', error);
      setFormStatus('error');
    }
  };

  // UPDATED: Submits to your Port 5001 server
  const handleSubscribe = async () => {
    if (!subscribeEmail) return;
    try {
      // Changed port to 5001
      const response = await fetch('http://localhost:5001/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: subscribeEmail })
      });
      if (response.ok) {
        setSubscribeStatus('Success!');
        setSubscribeEmail('');
        setTimeout(() => setSubscribeStatus(null), 3000);
      }
    } catch (error) {
      console.error('Subscription Error:', error);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setStatsTriggered(true);
      },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const slideLeft = () => sliderRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  const slideRight = () => sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' });

  const teamMembers = [
    { name: "Aman Raghav", role: "Team Member", img: "/aman.jpg" },
    { name: "Gaurav Kumar", role: "Team Member", img: "/gaurav.JPG" },
    { name: "Princy Gupta", role: "Team Member", img: "/princy.JPG" },
    { name: "Aakash Singh", role: "Team Member", img: "/aakash.JPG" },
    { name: "Manisha", role: "Team Member", img: "/manisha.JPG" },
    { name: "Shrishti Pathak", role: "Team Member", img: "/shrishti.JPG" },
    { name: "Arvind", role: "Team Member", img: "/arvind.JPG" },
    { name: "Adhunika Chhonker", role: "Team Member", img: "/adhunika.JPG" },
    { name: "Divya Bhushan Dahiya", role: "Team Member", img: "/divya.JPG" },
    { name: "Pooja Dahiya", role: "Team Member", img: "/pooja.JPG" }
  ];


  const clients = [
    { name: "JDMH", img: "/jdmh.jpg" },
    { name: "IPB", img: "/ipb.jpg" },
    { name: "JMS", img: "/jms.jpg" },
    { name: "TS", img: "/ts.jpg" },
    { name: "GF", img: "/gf.jpg" },
    { name: "Aureus", img: "/aureus.jpg" },
    { name: "JDMA", img: "/jdma.jpg" },
    { name: "AMF", img: "/amf.jpg" },
    { name: "Tliz", img: "/tliz.jpg" },
    { name: "Sheesham", img: "/sheesham.jpg" },
    { name: "Health", img: "/health.jpg" },
    { name: "Namo", img: "/namo.jpg" }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 scroll-smooth relative">
      
      <FallingPetals />

      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 bg-white pr-4">
            <img src="/anisur.jpg" alt="Anisur Logo" className="h-10 w-10 object-contain rounded-md" />
            <span className="text-purple-800 font-extrabold text-2xl tracking-tight hidden sm:block">
              Anisur International
            </span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-semibold text-gray-700 items-center">
            <a href="#about-intro" className="hover:text-purple-700 transition">About</a>
            <a href="#about" className="hover:text-purple-700 transition">Services</a>
            <button onClick={() => setIsHiringFormOpen(true)} className="hover:text-purple-700 transition font-semibold cursor-pointer">
              Careers
            </button>
            <button onClick={() => setIsContactModalOpen(true)} className="hover:text-purple-700 transition font-semibold cursor-pointer">
              Contact us
            </button>
          </div>
        </div>
      </nav>

      <section id="home" className="relative min-h-[85vh] flex items-center py-20 overflow-hidden bg-[#faf9ff]">
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          <img 
            src="/hero-bg.jpg" 
            alt="Hero Background" 
            className="w-full h-full object-cover object-right-top opacity-100" 
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#faf9ff]/90 via-[#faf9ff]/50 to-transparent z-0"></div>
        <div className="max-w-7xl mx-auto px-4 w-full relative z-10">
          <div className="max-w-2xl text-left mt-8">
            <h1 className="text-7xl md:text-[8rem] font-black text-[#4c1d95] mb-2 tracking-tighter leading-none drop-shadow-sm">
              Anisur
            </h1>
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6 mt-4">
              Digital & Enterprise Transformation
            </h2>
            <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-lg leading-relaxed font-medium">
              Unlock new possibilities with our tailored IT solutions. We streamline processes, optimize performance, and drive growth with advanced digital technologies.
            </p>
            <a href="#about-intro" className="bg-purple-700 text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-purple-800 transition shadow-[0_10px_20px_rgba(107,33,168,0.3)] inline-block hover:-translate-y-1 transform">
              Learn More
            </a>
          </div>
        </div>
      </section>

      <section id="about-intro" className="py-24 bg-gray-50 relative">
        <div className="max-w-4xl mx-auto px-4 relative">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Philosophy</h2>
            <div className="w-24 h-1 bg-purple-500 mx-auto rounded-full"></div>
          </div>

          <div className="relative pb-32">
            <div className="sticky top-32 z-10 w-full mb-[30vh]">
              <div className="bg-purple-600/10 backdrop-blur-xl border border-purple-500/20 shadow-2xl rounded-3xl p-8 md:p-12 transition-all duration-300">
                <div className="flex flex-col md:flex-row items-start gap-8">
                  <div className="flex-shrink-0 w-16 h-16 bg-purple-600/20 rounded-2xl flex items-center justify-center text-purple-700 text-3xl shadow-sm">🌍</div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Empowering Digital Transformation</h3>
                    <p className="text-lg text-gray-800 leading-relaxed">
                      Anisur International is a results-driven IT solutions company committed to enabling organizations to thrive in a rapidly evolving digital landscape. With deep expertise across SAP ecosystems, modern web platforms, and high-performance mobile applications, we help businesses simplify complexity, modernize operations, and unlock sustainable growth through technology.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky top-40 z-20 w-full mb-[30vh]">
              <div className="bg-purple-700/15 backdrop-blur-xl border border-purple-500/30 shadow-2xl rounded-3xl p-8 md:p-12 transition-all duration-300">
                <div className="flex flex-col md:flex-row items-start gap-8">
                  <div className="flex-shrink-0 w-16 h-16 bg-purple-700/20 rounded-2xl flex items-center justify-center text-purple-800 text-3xl shadow-sm">🎯</div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">A Business-First Approach</h3>
                    <p className="text-lg text-gray-800 leading-relaxed">
                      Our approach is built on a simple principle: understand the business first, then apply the right technology. We begin by studying your processes, challenges, and objectives in detail. From initial consultation to final deployment, we ensure every solution is customized to your real operational goals rather than offering generic, one-size-fits-all systems.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky top-48 z-30 w-full mb-12">
              <div className="bg-purple-800/20 backdrop-blur-xl border border-purple-500/40 shadow-2xl rounded-3xl p-8 md:p-12 transition-all duration-300">
                <div className="flex flex-col md:flex-row items-start gap-8">
                  <div className="flex-shrink-0 w-16 h-16 bg-purple-800/20 rounded-2xl flex items-center justify-center text-purple-900 text-3xl shadow-sm">🤝</div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Long-Term Partnerships</h3>
                    <p className="text-lg text-gray-900 leading-relaxed font-medium">
                      Choosing the right technology partner is one of the most important decisions a business can make. Beyond delivering IT services, we commit to building lasting partnerships grounded in trust, accountability, and measurable outcomes. We don't just complete projects—we create digital ecosystems that empower organizations to operate smarter, respond faster, and achieve more.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={statsRef} className="py-20 bg-purple-700 relative z-40 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-purple-500">
            <div className="px-4 py-4 md:py-0">
              <AnimatedCounter end={100} suffix="+" trigger={statsTriggered} />
              <p className="text-purple-200 font-bold mt-2 uppercase tracking-wider text-sm">Projects Delivered</p>
            </div>
            <div className="px-4 py-4 md:py-0">
              <AnimatedCounter end={15} suffix="+" trigger={statsTriggered} />
              <p className="text-purple-200 font-bold mt-2 uppercase tracking-wider text-sm">Enterprise Clients</p>
            </div>
            <div className="px-4 py-4 md:py-0">
              <AnimatedCounter end={10} suffix="k+" trigger={statsTriggered} />
              <p className="text-purple-200 font-bold mt-2 uppercase tracking-wider text-sm">Hours System Uptime</p>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="py-20 bg-white border-t border-gray-100 relative z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Services</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-xl hover:border-purple-200 transition duration-300">
              <div className="bg-purple-700 w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl mb-6">⚙️</div>
              <h3 className="text-xl font-bold mb-2">Anisur Enterprise Solutions</h3>
              <p className="text-gray-600">Implementation, customization, support.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-xl hover:border-purple-200 transition duration-300">
              <div className="bg-purple-700 w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl mb-6">💻</div>
              <h3 className="text-xl font-bold mb-2">Website Development</h3>
              <p className="text-gray-600">Modern, secure, responsive designs.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-xl hover:border-purple-200 transition duration-300">
              <div className="bg-purple-700 w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl mb-6">📱</div>
              <h3 className="text-xl font-bold mb-2">App Development</h3>
              <p className="text-gray-600">Native & cross-platform applications.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="team" className="py-20 bg-gray-50 border-t border-purple-100 relative z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Leadership & Innovators</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">The brilliant minds driving Anisur International forward.</p>
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-12 mb-16">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden text-center max-w-sm w-full mx-auto md:mx-0 border border-gray-100 hover:shadow-2xl transition transform hover:-translate-y-1">
              <img src="/sagar.JPG" alt="CEO" className="w-full h-80 object-cover bg-gray-200" />
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900">Sagar Ranga</h3>
                <p className="text-purple-700 font-bold tracking-wide mt-1">Chief Executive Officer</p>
                <p className="text-gray-500 text-sm mt-3">Visionary leader guiding our global IT strategy and corporate growth.</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden text-center max-w-sm w-full mx-auto md:mx-0 border border-gray-100 hover:shadow-2xl transition transform hover:-translate-y-1">
              <img src="/anita.jpg" alt="Director" className="w-full h-80 object-cover bg-gray-200" />
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900">Anita Rani</h3>
                <p className="text-purple-700 font-bold tracking-wide mt-1">Director of Operations</p>
                <p className="text-gray-500 text-sm mt-3">Ensuring excellence in delivery, operations, and client success.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-md p-8 md:p-12 border border-gray-100 relative group">
            <h3 className="text-2xl font-bold text-center mb-10 text-gray-800">Our Core Team</h3>
            
            <button onClick={slideLeft} className="absolute left-0 md:-left-5 top-[60%] transform -translate-y-1/2 bg-purple-700 text-white w-12 h-12 rounded-full shadow-lg hover:bg-purple-800 z-10 hidden group-hover:flex items-center justify-center text-2xl cursor-pointer transition">
              ←
            </button>
            <button onClick={slideRight} className="absolute right-0 md:-right-5 top-[60%] transform -translate-y-1/2 bg-purple-700 text-white w-12 h-12 rounded-full shadow-lg hover:bg-purple-800 z-10 hidden group-hover:flex items-center justify-center text-2xl cursor-pointer transition">
              →
            </button>

            <div 
              ref={sliderRef}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-8 no-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {teamMembers.map((member, index) => (
                <div key={index} className="min-w-[280px] snap-center bg-white rounded-xl border border-gray-100 hover:bg-purple-50 transition overflow-hidden shadow-sm hover:shadow-md">
                  <img src={member.img} alt={member.name} className="w-full h-56 object-cover bg-gray-200" />
                  <div className="p-6 text-center">
                    <h4 className="font-bold text-gray-900 text-xl">{member.name}</h4>
                    <p className="text-sm text-purple-700 font-semibold mt-1">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div id="clients">
        <FloatingClients clients={clients} />
      </div>

      <footer className="bg-[#1a1e29] text-gray-300 pt-16 pb-6 relative z-40 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="text-white font-bold text-3xl mb-6">Anisur<span className="text-purple-500">Int.</span></div>
            <div className="flex gap-4">
              <span className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center cursor-pointer hover:bg-purple-600 transition">G</span>
              <a 
                href="https://www.linkedin.com/company/anisur-international/" 
                target="_blank" 
                rel="noreferrer" 
                className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center cursor-pointer hover:bg-blue-600 text-white font-medium hover:text-white transition"
              >
                in
              </a>
            </div>
          </div>

          <div className="flex gap-12">
            <div>
              <h4 className="text-white font-bold mb-6">About Us</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#home" className="hover:text-purple-400 transition">Home</a></li>
                <li><a href="#about-intro" className="hover:text-purple-400 transition">About us</a></li>
                <li><a href="#about" className="hover:text-purple-400 transition">Services</a></li>
                <li><button onClick={() => setIsHiringFormOpen(true)} className="hover:text-purple-400 transition cursor-pointer">Career</button></li>
                <li><button onClick={() => setIsContactModalOpen(true)} className="hover:text-purple-400 transition cursor-pointer">Contact us</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6">Find Us on Google</h4>
              <div className="w-full max-w-[200px] h-32 bg-gray-800 rounded-lg overflow-hidden border border-gray-600 shadow-sm hover:shadow-md transition duration-300">
                <iframe
                  title="Anisur International Location"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://maps.google.com/maps?width=100%25&height=100%25&hl=en&q=JDM%20square,%20Gurgaon,%20Haryana&t=&z=14&ie=UTF8&iwloc=B&output=embed"
                ></iframe>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Address</h4>
            <p className="text-sm leading-relaxed mb-4">
              Anisur International<br/>
              3rd floor, JDM square,<br/>
              Gurgaon- 122102(HR)
            </p>
            <p className="text-sm font-semibold text-gray-400">CUSTOMER SUPPORT</p>
            <a href="mailto:Contact@anisurinternational.com" className="text-purple-400 hover:text-purple-300 text-sm border-b border-purple-400 pb-1 transition">
              Contact@anisurinternational.com
            </a>
            <p className="text-xs mt-2 text-gray-500">for all Enquiry</p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-xl">Subscribe us</h4>
            <p className="text-sm mb-4 text-gray-400">Sign up now and get news about our exclusive tech insights & latest launches.</p>
            <div className="flex">
              <input 
                type="email" 
                value={subscribeEmail}
                onChange={(e) => setSubscribeEmail(e.target.value)}
                placeholder="Enter email address" 
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-l outline-none focus:ring-1 focus:ring-purple-500" 
              />
              <button onClick={handleSubscribe} className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-r font-semibold transition cursor-pointer">
                Subscribe
              </button>
            </div>
            {subscribeStatus && <p className="text-green-400 text-xs mt-2">{subscribeStatus}</p>}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <div className="flex gap-4 mb-4 md:mb-0">
            <button onClick={() => setIsPrivacyModalOpen(true)} className="hover:text-purple-400 transition cursor-pointer">Privacy Policy</button>
            <button onClick={() => setIsCookieModalOpen(true)} className="hover:text-purple-400 transition cursor-pointer">Cookie Policy</button>
            <button onClick={() => setIsTermsModalOpen(true)} className="hover:text-purple-400 transition cursor-pointer">Terms and Conditions</button>
          </div>
          <div>
            ❤️ Anisur International © 2026
          </div>
        </div>
      </footer>

      {/* FLOATING SOCIAL POPUPS */}
      <div className="fixed right-6 bottom-6 flex flex-col gap-4 z-50">
        <a 
          href="https://www.linkedin.com/company/anisur-international/" 
          target="_blank" 
          rel="noreferrer" 
          className="bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg hover:scale-110 transition flex items-center justify-center font-bold text-xl"
        >
          in
        </a>
        <a 
          href="https://wa.me/919911309695?text=Hello%20Anisur%20International!" 
          target="_blank" 
          rel="noreferrer" 
          className="bg-green-500 text-white w-14 h-14 rounded-full shadow-lg hover:scale-110 transition flex items-center justify-center text-2xl"
        >
          💬
        </a>
      </div>

      {/* WIRED HIRING MODAL POPUP */}
      {isHiringFormOpen && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsHiringFormOpen(false)} className="absolute top-4 right-6 text-4xl text-gray-400 hover:text-gray-800 transition z-50 leading-none cursor-pointer">
              ×
            </button>
            <div className="p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Join Our Team</h2>
                <p className="text-gray-500">Submit your details below to apply for open IT positions.</p>
              </div>

              {formStatus === 'success' ? (
                <div className="text-center py-10">
                  <div className="text-green-500 text-5xl mb-4">✓</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Application Sent!</h3>
                  <p className="text-gray-600">Thank you for applying. We will review your profile and get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleHiringSubmit} className="space-y-6">
                  {formStatus === 'error' && <p className="text-red-500 text-sm text-center">Something went wrong. Please check your server connection.</p>}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                      <input required type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-600 outline-none transition" placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Contact No.</label>
                      <input required type="tel" name="contactNo" value={formData.contactNo} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-600 outline-none transition" placeholder="+91 98765 43210" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
                    <input required type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-600 outline-none transition" placeholder="City, State" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Last Education</label>
                    <input required type="text" name="education" value={formData.education} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-600 outline-none transition" placeholder="e.g. B.Tech in Computer Science" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">GitHub Profile Link</label>
                      <input type="url" name="github" value={formData.github} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-600 outline-none transition" placeholder="https://github.com/..." />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">LinkedIn Profile Link</label>
                      <input required type="url" name="linkedin" value={formData.linkedin} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-600 outline-none transition" placeholder="https://linkedin.com/in/..." />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Experience (if any)</label>
                    <textarea name="experience" value={formData.experience} onChange={handleInputChange} rows="3" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-600 outline-none transition" placeholder="Briefly describe your past roles and tech stack..."></textarea>
                  </div>
                  <button type="submit" disabled={formStatus === 'submitting'} className="w-full bg-purple-700 text-white font-bold py-4 rounded-lg hover:bg-purple-800 transition shadow-md text-lg cursor-pointer flex justify-center items-center">
                    {formStatus === 'submitting' ? 'Submitting...' : 'Submit Application'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CONTACT US MODAL POPUP */}
      {isContactModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative">
            <button onClick={() => setIsContactModalOpen(false)} className="absolute top-4 right-6 text-4xl text-gray-400 hover:text-gray-800 transition z-50 leading-none cursor-pointer">
              ×
            </button>
            <div className="p-8 md:p-12 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Contact Us</h2>
              <div className="space-y-5 text-lg text-gray-700">
                <div>
                  <p className="font-extrabold text-2xl text-purple-800 tracking-tight">Anisur International</p>
                  <p className="mt-2 text-gray-600">
                    3rd floor, JDM square,<br/>
                    Gurgaon- 122102(HR)
                  </p>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <p className="font-semibold text-gray-500 text-sm uppercase tracking-wider mb-1">Phone</p>
                  <a href="tel:+917082145140" className="text-purple-700 font-bold text-xl hover:text-purple-900 transition">
                    +91-7082145140
                  </a>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <p className="font-semibold text-gray-500 text-sm uppercase tracking-wider mb-2">Email</p>
                  <a href="mailto:Hr@anisurinternational.com" className="block text-purple-700 font-medium hover:text-purple-900 transition mb-1">
                    Hr@anisurinternational.com
                  </a>
                  <a href="mailto:Contact@anisurinternational.com" className="block text-purple-700 font-medium hover:text-purple-900 transition">
                    Contact@anisurinternational.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRIVACY POLICY MODAL */}
      <PolicyModal title="Privacy Policy" isOpen={isPrivacyModalOpen} onClose={() => setIsPrivacyModalOpen(false)}>
        <p><strong>Last Updated:</strong> May 2026</p>
        <p>At <strong>Anisur International</strong>, we prioritize the privacy and security of your data. This Privacy Policy outlines how we collect, use, and protect your personal information when you interact with our website and services.</p>
        <h3 className="text-lg font-bold mt-4 mb-2 text-gray-900">1. Information We Collect</h3>
        <p>We may collect personal information such as your name, email address, phone number, and physical address when you voluntarily submit forms on our website (e.g., career applications or contact forms). We also collect non-identifying data regarding your website usage for analytical purposes.</p>
        <h3 className="text-lg font-bold mt-4 mb-2 text-gray-900">2. How We Use Your Information</h3>
        <p>Your information is used strictly to provide and improve our services, process job applications, respond to inquiries, and send relevant updates if you have opted into our newsletter. We do not sell or rent your personal data to third parties.</p>
        <h3 className="text-lg font-bold mt-4 mb-2 text-gray-900">3. Data Security</h3>
        <p>We implement industry-standard security measures to protect your data against unauthorized access, alteration, or disclosure. However, no internet transmission is entirely secure, and we cannot guarantee absolute data security.</p>
        <h3 className="text-lg font-bold mt-4 mb-2 text-gray-900">4. Your Rights</h3>
        <p>You have the right to access, update, or request the deletion of your personal information stored with us. To exercise these rights, please reach out to us at Contact@anisurinternational.com.</p>
      </PolicyModal>

      {/* COOKIE POLICY MODAL */}
      <PolicyModal title="Cookie Policy" isOpen={isCookieModalOpen} onClose={() => setIsCookieModalOpen(false)}>
        <p><strong>Last Updated:</strong> May 2026</p>
        <p><strong>Anisur International</strong> uses cookies to enhance your browsing experience, analyze site traffic, and serve targeted advertisements. By continuing to use our site, you consent to our use of cookies.</p>
        <h3 className="text-lg font-bold mt-4 mb-2 text-gray-900">1. What Are Cookies?</h3>
        <p>Cookies are small text files placed on your device by websites you visit. They are widely used to make websites work more efficiently and provide valuable business and marketing information to the site owners.</p>
        <h3 className="text-lg font-bold mt-4 mb-2 text-gray-900">2. How We Use Cookies</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Essential Cookies:</strong> Required for the basic functionality of the website.</li>
          <li><strong>Analytical Cookies:</strong> Help us understand how visitors interact with our website by collecting and reporting information anonymously.</li>
          <li><strong>Functional Cookies:</strong> Allow the website to remember choices you make (such as user names or language preferences).</li>
        </ul>
        <h3 className="text-lg font-bold mt-4 mb-2 text-gray-900">3. Managing Cookies</h3>
        <p>You can control and manage cookies in your browser. Please be aware that removing or blocking cookies can impact your user experience and parts of our website may no longer be fully accessible.</p>
      </PolicyModal>

      {/* TERMS AND CONDITIONS MODAL */}
      <PolicyModal title="Terms and Conditions" isOpen={isTermsModalOpen} onClose={() => setIsTermsModalOpen(false)}>
        <p><strong>Last Updated:</strong> May 2026</p>
        <p>Welcome to <strong>Anisur International</strong>. By accessing our website, you agree to comply with and be bound by the following Terms and Conditions of use.</p>
        <h3 className="text-lg font-bold mt-4 mb-2 text-gray-900">1. Intellectual Property Rights</h3>
        <p>Unless otherwise stated, Anisur International and/or its licensors own the intellectual property rights for all material on this website. All intellectual property rights are reserved. You may access this from Anisur International for your own personal use subjected to restrictions set in these terms.</p>
        <h3 className="text-lg font-bold mt-4 mb-2 text-gray-900">2. Restrictions</h3>
        <p>You are specifically restricted from all of the following:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Publishing any website material in any other media without prior consent.</li>
          <li>Selling, sublicensing, or otherwise commercializing any website material.</li>
          <li>Using this website in any way that is or may be damaging to this website.</li>
          <li>Engaging in any data mining, data harvesting, data extracting, or any other similar activity.</li>
        </ul>
        <h3 className="text-lg font-bold mt-4 mb-2 text-gray-900">3. Limitation of Liability</h3>
        <p>In no event shall Anisur International, nor any of its officers, directors, and employees, be held liable for anything arising out of or in any way connected with your use of this website.</p>
        <h3 className="text-lg font-bold mt-4 mb-2 text-gray-900">4. Governing Law & Jurisdiction</h3>
        <p>These Terms will be governed by and interpreted in accordance with the laws of Haryana, India, and you submit to the non-exclusive jurisdiction of the state and federal courts located in India for the resolution of any disputes.</p>
      </PolicyModal>

    </div>
  );
}