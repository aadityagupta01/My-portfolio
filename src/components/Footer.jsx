import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/Footer.css';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        footerRef.current.querySelectorAll('.footer-line'),
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 95%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer className="footer" ref={footerRef}>
      <div className="footer-divider" />

      <div className="footer-content">
        <p className="footer-line footer-credit">
          Designed &amp; Built by{' '}
          <span className="footer-name">Shyamal Joshi</span>
        </p>

        <p className="footer-line footer-year">&copy; 2025</p>

        <p className="footer-line footer-tech">
          Made with <span className="footer-heart">♥</span> using React &amp; GSAP
        </p>
      </div>
    </footer>
  );
};

export default Footer;
