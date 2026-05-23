import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import portfolioData from '../data/portfolio.json';
import '../styles/WhatIDo.css';

gsap.registerPlugin(ScrollTrigger);

/* ---------- icon map (inline SVGs for each service) ---------- */
const iconMap = {
  cloud: (color) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    </svg>
  ),
  pipeline: (color) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h16M4 12h16M4 18h16" />
      <circle cx="8" cy="6" r="1.5" fill={color} />
      <circle cx="16" cy="12" r="1.5" fill={color} />
      <circle cx="12" cy="18" r="1.5" fill={color} />
    </svg>
  ),
  brain: (color) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7Z" />
      <path d="M10 21h4" />
      <path d="M9 9h6" />
      <path d="M12 6v6" />
    </svg>
  ),
  code: (color) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
      <line x1="14" y1="4" x2="10" y2="20" />
    </svg>
  ),
  monitor: (color) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
      <polyline points="7 10 10 7 13 11 17 7" />
    </svg>
  ),
  container: (color) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73L13 2.27a2 2 0 0 0-2 0L4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
};

const WhatIDo = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* heading animation */
      gsap.from(headingRef.current, {
        x: -80,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });

      /* cards stagger animation */
      gsap.from(cardsRef.current, {
        y: 60,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const services = portfolioData.whatIDo;

  return (
    <section className="whatido" id="whatido" ref={sectionRef}>
      <div className="whatido__container">
        {/* ---------- heading ---------- */}
        <div className="whatido__heading" ref={headingRef}>
          <span className="whatido__accent-line" />
          <h2 className="whatido__title">what I do</h2>
        </div>

        {/* ---------- grid ---------- */}
        <div className="whatido__grid">
          {services.map((item, idx) => (
            <div
              className="whatido__card"
              key={idx}
              ref={(el) => (cardsRef.current[idx] = el)}
              style={{
                '--card-accent': item.color,
              }}
            >
              {/* icon area */}
              <div className="whatido__card-icon">
                {iconMap[item.icon]
                  ? iconMap[item.icon](item.color)
                  : null}
              </div>

              {/* text */}
              <div className="whatido__card-content">
                <h3 className="whatido__card-title">{item.title}</h3>
                <p className="whatido__card-desc">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatIDo;
