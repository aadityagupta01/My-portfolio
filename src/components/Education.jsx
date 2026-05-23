import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import portfolioData from '../data/portfolio.json';
import '../styles/Education.css';

gsap.registerPlugin(ScrollTrigger);

/* ── Degree icon map ─────────────────────────────────────────── */
const DEGREE_ICONS = {
  'M.Tech': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
    </svg>
  ),
  'B.Tech': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
    </svg>
  ),
  'Class 12': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
      <path d="M8 7h6M8 11h4" />
    </svg>
  ),
  'Class 10': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
      <path d="M8 7h6M8 11h4" />
    </svg>
  ),
};

const getIcon = (degree) => {
  const key = Object.keys(DEGREE_ICONS).find((k) => degree.startsWith(k));
  return key ? DEGREE_ICONS[key] : DEGREE_ICONS['Class 10'];
};

const Education = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const timelineRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ── Heading reveal ─────────────────────────────────────── */
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        }
      );

      /* ── Timeline line draw ─────────────────────────────────── */
      if (timelineRef.current) {
        gsap.fromTo(
          timelineRef.current,
          { scaleY: 0, transformOrigin: 'top center' },
          {
            scaleY: 1,
            duration: 1.4,
            ease: 'power3.inOut',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      /* ── Cards slide in from left with stagger ──────────────── */
      const cards = cardsRef.current.filter(Boolean);
      gsap.set(cards, { opacity: 0, x: -80, filter: 'blur(4px)' });

      gsap.to(cards, {
        opacity: 1,
        x: 0,
        filter: 'blur(0px)',
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const education = portfolioData.education;

  return (
    <section className="education" id="education" ref={sectionRef}>
      {/* Section heading */}
      <div className="education-header" ref={headingRef}>
        <span className="education-label">Education</span>
        <h2 className="education-title">
          Academic <span className="education-accent">Journey</span>
        </h2>
        <p className="education-subtitle">
          A strong foundation in computer science, from school to IIT Jodhpur.
        </p>
      </div>

      {/* Timeline */}
      <div className="education-timeline">
        {/* Vertical line */}
        <div className="education-timeline-line" ref={timelineRef} />

        {education.map((item, index) => (
          <div
            className="education-card-wrapper"
            key={index}
            ref={(el) => (cardsRef.current[index] = el)}
          >
            {/* Timeline dot */}
            <div className="education-dot">
              <div className="education-dot-inner" />
            </div>

            {/* Card */}
            <div className="education-card" data-cursor="-pointer">
              <div className="education-card-icon">
                {getIcon(item.degree)}
              </div>

              <div className="education-card-body">
                <h3 className="education-degree">{item.degree}</h3>
                <p className="education-institution">{item.institution}</p>
              </div>

              <div className="education-card-meta">
                <span className="education-year">{item.year}</span>
                {item.score && item.score !== '—' && (
                  <span className="education-score">{item.score}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Education;
