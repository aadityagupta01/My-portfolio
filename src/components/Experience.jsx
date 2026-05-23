import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import portfolioData from '../data/portfolio.json';
import '../styles/Experience.css';

gsap.registerPlugin(ScrollTrigger);

const Experience = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const accentLineRef = useRef(null);
  const timelineLineRef = useRef(null);
  const cardsRef = useRef([]);
  const dotsRef = useRef([]);
  const bulletGroupsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Section heading fade-in ──
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // ── Accent line draws left → right ──
      gsap.fromTo(
        accentLineRef.current,
        { scaleX: 0, transformOrigin: 'left center' },
        {
          scaleX: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // ── Vertical timeline line draws top → bottom with scrub ──
      if (timelineLineRef.current) {
        gsap.fromTo(
          timelineLineRef.current,
          { scaleY: 0, transformOrigin: 'top center' },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: timelineLineRef.current,
              start: 'top 75%',
              end: 'bottom 50%',
              scrub: 1,
            },
          }
        );
      }

      // ── Cards slide in from alternating sides ──
      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        const fromLeft = index % 2 === 0;

        gsap.fromTo(
          card,
          {
            opacity: 0,
            x: fromLeft ? -120 : 120,
            rotateY: fromLeft ? 8 : -8,
          },
          {
            opacity: 1,
            x: 0,
            rotateY: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      // ── Dots pulse when card comes into view ──
      dotsRef.current.forEach((dot) => {
        if (!dot) return;

        gsap.fromTo(
          dot,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            ease: 'back.out(2)',
            scrollTrigger: {
              trigger: dot,
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
          }
        );

        // Continuous pulse after appearing
        gsap.to(dot.querySelector('.exp-dot-ring'), {
          scale: 1.8,
          opacity: 0,
          duration: 1.5,
          ease: 'power1.out',
          repeat: -1,
          delay: 0.6,
          scrollTrigger: {
            trigger: dot,
            start: 'top 82%',
            toggleActions: 'play pause resume pause',
          },
        });
      });

      // ── Staggered fade-in of bullet points ──
      bulletGroupsRef.current.forEach((group) => {
        if (!group) return;
        const bullets = group.querySelectorAll('.exp-bullet');

        gsap.fromTo(
          bullets,
          { opacity: 0, x: -30, filter: 'blur(4px)' },
          {
            opacity: 1,
            x: 0,
            filter: 'blur(0px)',
            duration: 0.5,
            ease: 'power2.out',
            stagger: 0.12,
            scrollTrigger: {
              trigger: group,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const { experience } = portfolioData;

  return (
    <section className="experience" id="experience" ref={sectionRef}>
      {/* ── Section Header ── */}
      <div className="exp-header" ref={headingRef}>
        <span className="exp-label">Experience</span>
        <div className="exp-accent-line" ref={accentLineRef} />
        <p className="exp-subtitle">Where I've contributed and grown as an engineer</p>
      </div>

      {/* ── Timeline ── */}
      <div className="exp-timeline">
        {/* Vertical connecting line */}
        <div className="exp-timeline-line" ref={timelineLineRef}>
          <div className="exp-timeline-line-glow" />
        </div>

        {experience.map((exp, index) => (
          <div
            className={`exp-entry ${index % 2 === 0 ? 'exp-entry--left' : 'exp-entry--right'}`}
            key={index}
          >
            {/* Timeline dot */}
            <div
              className="exp-dot-wrapper"
              ref={(el) => (dotsRef.current[index] = el)}
            >
              <div className="exp-dot-ring" />
              <div className="exp-dot-core" />
            </div>

            {/* Experience card */}
            <div
              className="exp-card"
              ref={(el) => (cardsRef.current[index] = el)}
            >
              <div className="exp-card-inner">
                {/* Card accent border */}
                <div className="exp-card-border" />

                {/* Card content */}
                <div className="exp-card-content">
                  <div className="exp-card-top">
                    <span className="exp-period">{exp.period}</span>
                    <div className="exp-card-badge">
                      {index === 0 ? '● Recent' : '● Past'}
                    </div>
                  </div>

                  <h3 className="exp-role">{exp.role}</h3>
                  <h4 className="exp-company">{exp.company}</h4>

                  <div
                    className="exp-bullets"
                    ref={(el) => (bulletGroupsRef.current[index] = el)}
                  >
                    {exp.highlights.map((highlight, hIdx) => (
                      <div className="exp-bullet" key={hIdx}>
                        <span className="exp-bullet-icon">▹</span>
                        <span className="exp-bullet-text">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experience;
