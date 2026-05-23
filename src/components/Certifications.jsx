import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import portfolioData from '../data/portfolio.json';
import '../styles/Certifications.css';

gsap.registerPlugin(ScrollTrigger);

/* ── SVG Icons ────────────────────────────────────────────────── */
const ShieldIcon = ({ color }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const ACHIEVEMENT_ICONS = {
  'Led Tech Sessions': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  'CodePie 3.0 Organizer': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
      <line x1="12" y1="2" x2="12" y2="22" />
    </svg>
  ),
  'Instagram Creator': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
};

const getAchievementIcon = (title) =>
  ACHIEVEMENT_ICONS[title] || ACHIEVEMENT_ICONS['Led Tech Sessions'];

/* ── Helper: extract a highlight number from the description ──── */
const extractHighlight = (description) => {
  const match = description.match(/([\d,.]+\+?K?\+?)/);
  return match ? match[0] : null;
};

const Certifications = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const certCardsRef = useRef([]);
  const achCardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ── Heading ──────────────────────────────────────────── */
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

      /* ── Certification badges bounce in ─────────────────── */
      const certs = certCardsRef.current.filter(Boolean);
      gsap.set(certs, { opacity: 0, scale: 0.5, y: 40 });

      gsap.to(certs, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.7,
        ease: 'back.out(1.7)',
        stagger: 0.18,
        scrollTrigger: {
          trigger: certs[0],
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });

      /* ── Achievement cards fade up with stagger ─────────── */
      const achs = achCardsRef.current.filter(Boolean);
      gsap.set(achs, { opacity: 0, y: 60, filter: 'blur(4px)' });

      gsap.to(achs, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.75,
        ease: 'power3.out',
        stagger: 0.14,
        scrollTrigger: {
          trigger: achs[0],
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const { certifications, achievements } = portfolioData;

  return (
    <section className="certach" id="certifications" ref={sectionRef}>
      {/* ── Section heading ──────────────────────────────────── */}
      <div className="certach-header" ref={headingRef}>
        <span className="certach-label">Recognition</span>
        <h2 className="certach-title">
          Certifications & <span className="certach-accent">Achievements</span>
        </h2>
        <p className="certach-subtitle">
          Industry credentials and leadership milestones that define my journey.
        </p>
      </div>

      {/* ── Certifications ───────────────────────────────────── */}
      <div className="certach-section">
        <h3 className="certach-section-title">
          <span className="certach-section-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </span>
          Certifications
        </h3>

        <div className="certach-certs-grid">
          {certifications.map((cert, index) => (
            <div
              className="certach-cert-card"
              key={index}
              ref={(el) => (certCardsRef.current[index] = el)}
              style={{ '--cert-color': cert.color }}
            >
              {/* Glow background */}
              <div className="certach-cert-glow" />

              {/* Shield badge */}
              <div className="certach-cert-badge">
                <ShieldIcon color={cert.color} />
              </div>

              {/* Content */}
              <div className="certach-cert-content">
                <h4 className="certach-cert-name">{cert.name}</h4>
                <p className="certach-cert-issuer">{cert.issuer}</p>
              </div>

              {/* Year pill */}
              <span
                className="certach-cert-year"
                style={{ borderColor: `${cert.color}30`, color: cert.color }}
              >
                {cert.year}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Achievements ──────────────────────────────────────── */}
      <div className="certach-section">
        <h3 className="certach-section-title">
          <span className="certach-section-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </span>
          Achievements
        </h3>

        <div className="certach-achs-grid">
          {achievements.map((ach, index) => {
            const highlight = extractHighlight(ach.description);
            return (
              <div
                className="certach-ach-card"
                key={index}
                ref={(el) => (achCardsRef.current[index] = el)}
              >
                {/* Icon */}
                <div className="certach-ach-icon">
                  {getAchievementIcon(ach.title)}
                </div>

                {/* Highlight number */}
                {highlight && (
                  <span className="certach-ach-highlight">{highlight}</span>
                )}

                {/* Text */}
                <h4 className="certach-ach-title">{ach.title}</h4>
                <p className="certach-ach-desc">{ach.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Certifications;
