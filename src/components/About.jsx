import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import portfolioData from '../data/portfolio.json';
import '../styles/About.css';

gsap.registerPlugin(ScrollTrigger);

const MARQUEE_LOGOS = [
  'React', 'Docker', 'Kubernetes', 'AWS', 'Azure',
  'Jenkins', 'Python', 'TensorFlow', 'Prometheus',
  'Grafana', 'Node.js', 'Git'
];

const About = () => {
  const sectionRef = useRef(null);
  const dividerRef = useRef(null);
  const taglineRef = useRef(null);
  const descriptionRef = useRef(null);
  const marqueeTrackRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Divider line draws left → right ──
      gsap.fromTo(
        dividerRef.current,
        { scaleX: 0, transformOrigin: 'left center' },
        {
          scaleX: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      // ── Word-by-word tagline reveal ──
      const words = taglineRef.current.querySelectorAll('.about-word');
      gsap.set(words, { opacity: 0, y: 40, filter: 'blur(6px)' });

      gsap.to(words, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.06,
        scrollTrigger: {
          trigger: taglineRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });

      // ── Description fade-in ──
      gsap.fromTo(
        descriptionRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: descriptionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      // ── Infinite marquee scroll ──
      const track = marqueeTrackRef.current;
      if (track) {
        const totalWidth = track.scrollWidth / 2; // we duplicate the items
        gsap.to(track, {
          x: -totalWidth,
          duration: 30,
          ease: 'none',
          repeat: -1,
          modifiers: {
            x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth),
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Split tagline into word spans
  const taglineWords = portfolioData.personal.tagline.split(' ');

  return (
    <section className="about" id="about" ref={sectionRef}>
      {/* Accent divider */}
      <div className="about-divider" ref={dividerRef} />

      <div className="about-content">
        {/* Tagline */}
        <h2 className="about-tagline" ref={taglineRef}>
          {taglineWords.map((word, i) => (
            <span className="about-word" key={i}>
              {word}&nbsp;
            </span>
          ))}
        </h2>

        {/* Description */}
        <p className="about-description" ref={descriptionRef}>
          {portfolioData.personal.description}
        </p>
      </div>

      {/* Marquee */}
      <div className="about-marquee">
        {/* Fade masks on left + right */}
        <div className="about-marquee-mask about-marquee-mask--left" />
        <div className="about-marquee-mask about-marquee-mask--right" />

        <div className="about-marquee-track" ref={marqueeTrackRef}>
          {/* Render list twice for seamless loop */}
          {[...MARQUEE_LOGOS, ...MARQUEE_LOGOS].map((name, i) => (
            <div className="about-marquee-item" key={i}>
              <span className="about-marquee-icon">{'</>'}</span>
              <span className="about-marquee-name">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
