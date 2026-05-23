import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import portfolioData from '../data/portfolio.json';
import '../styles/Footer.css';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade/slide in footer section on scroll
      gsap.fromTo(
        footerRef.current.querySelectorAll('.footer-bottom'),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer className="footer" ref={footerRef}>
      {/* Footnotes Row */}
      <div className="footer-bottom">
        <div className="footer-bottom-item footer-bottom-item--logo">
          <div className="footer-monogram" data-cursor="pointer">
            <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="var(--text-primary)" />
              <text 
                x="50%" 
                y="55%" 
                dominantBaseline="central" 
                textAnchor="middle" 
                fontFamily="var(--font-heading)" 
                fontWeight="900" 
                fontSize="15" 
                fill="var(--accent)"
              >
                SJ
              </text>
            </svg>
          </div>
        </div>
        <div className="footer-bottom-item footer-bottom-item--name">
          SHYAMAL JOSHI
        </div>
        <div className="footer-bottom-item footer-bottom-item--rights">
          &copy; 2026 ALL RIGHTS RESERVED
        </div>
      </div>
    </footer>
  );
};

export default Footer;
