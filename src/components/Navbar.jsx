import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/Navbar.css';

gsap.registerPlugin(ScrollTrigger);

const navItems = [
  {
    label: 'See my work',
    sectionId: 'hero',
    icon: 'circle',
  },
  {
    label: 'Projects',
    sectionId: 'projects',
    icon: 'briefcase',
  },
  {
    label: 'Contact me',
    sectionId: 'contact',
    icon: 'check',
  },
];

const NavIcon = ({ type }) => {
  switch (type) {
    case 'circle':
      return (
        <span className="nav-icon nav-icon--circle">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6" fill="#10b981" />
          </svg>
        </span>
      );
    case 'briefcase':
      return (
        <span className="nav-icon nav-icon--briefcase">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
            <line x1="2" y1="13" x2="22" y2="13" />
          </svg>
        </span>
      );
    case 'check':
      return (
        <span className="nav-icon nav-icon--check">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#10b981" opacity="0.15" stroke="#10b981" strokeWidth="1.5" />
            <path d="M8 12.5l2.5 2.5 5.5-5.5" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      );
    default:
      return null;
  }
};

const Navbar = () => {
  const navRef = useRef(null);
  const pillRefs = useRef([]);
  const [scrolled, setScrolled] = useState(false);

  const handleNavClick = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    // --- Entrance animation ---
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(
      nav,
      { y: -60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.2 }
    );

    // Stagger pills
    tl.fromTo(
      pillRefs.current,
      { y: -20, opacity: 0, scale: 0.92 },
      { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.12 },
      '-=0.5'
    );

    // --- Scroll-responsive background opacity ---
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // ScrollTrigger for smooth background transition
    ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: '200px top',
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        if (nav) {
          nav.style.setProperty('--nav-bg-opacity', 0.45 + progress * 0.45);
          nav.style.setProperty('--nav-blur', `${12 + progress * 14}px`);
          nav.style.setProperty('--nav-border-opacity', 0.06 + progress * 0.12);
        }
      },
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      ScrollTrigger.getAll().forEach((st) => st.kill());
      tl.kill();
    };
  }, []);

  return (
    <nav
      ref={navRef}
      className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}
      style={{ opacity: 0 }}
    >
      <div className="navbar__inner">
        {navItems.map((item, i) => (
          <button
            key={item.sectionId}
            ref={(el) => (pillRefs.current[i] = el)}
            className="navbar__pill"
            onClick={() => handleNavClick(item.sectionId)}
            type="button"
          >
            <NavIcon type={item.icon} />
            <span className="navbar__pill-label">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
