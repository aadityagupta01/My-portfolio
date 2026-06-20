import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import portfolioData from "../data/portfolio.json";
import "../styles/About.css";

gsap.registerPlugin(ScrollTrigger);

/* ── Two separate skill rows ── */
const ABOUT_SKILLS = portfolioData.techStack;
const DEVOPS_FULLSTACK = ABOUT_SKILLS.slice(
  0,
  Math.ceil(ABOUT_SKILLS.length / 2),
);
const ML_DL = ABOUT_SKILLS.slice(Math.ceil(ABOUT_SKILLS.length / 2));

const About = () => {
  const sectionRef = useRef(null);
  const dividerRef = useRef(null);
  const taglineRef = useRef(null);
  const descriptionRef = useRef(null);
  const marqueeTrack1Ref = useRef(null);
  const marqueeTrack2Ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Divider line draws left → right ──
      gsap.fromTo(
        dividerRef.current,
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );

      // ── Word-by-word tagline reveal ──
      const words = taglineRef.current.querySelectorAll(".about-word");
      gsap.set(words, { opacity: 0, y: 40, filter: "blur(6px)" });

      gsap.to(words, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.06,
        scrollTrigger: {
          trigger: taglineRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
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
          ease: "power2.out",
          scrollTrigger: {
            trigger: descriptionRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );

      // ── Marquee Row 1: Left → Right (DevOps/Full-stack) ──
      const track1 = marqueeTrack1Ref.current;
      if (track1) {
        const totalWidth1 = track1.scrollWidth / 2;
        gsap.fromTo(
          track1,
          { x: -totalWidth1 },
          {
            x: 0,
            duration: 35,
            ease: "none",
            repeat: -1,
            modifiers: {
              x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth1),
            },
          },
        );
      }

      // ── Marquee Row 2: Right → Left (ML/DL) ──
      const track2 = marqueeTrack2Ref.current;
      if (track2) {
        const totalWidth2 = track2.scrollWidth / 2;
        gsap.to(track2, {
          x: -totalWidth2,
          duration: 30,
          ease: "none",
          repeat: -1,
          modifiers: {
            x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth2),
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Split tagline into word spans
  const taglineWords = portfolioData.personal.tagline.split(" ");
  const aboutDescriptionSegments = portfolioData.personal
    .aboutDescriptionSegments || [{ text: portfolioData.personal.description }];

  return (
    <section className="about" id="about" ref={sectionRef}>
      {/* Accent divider */}
      <div className="about-divider" ref={dividerRef} />

      <div className="about-content">
        <div className="about-header">
          <span className="about-label">// About Me</span>
          <div className="about-accent-line" />
        </div>

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
          {aboutDescriptionSegments.map((segment, i) => (
            <span
              className={segment.highlight ? "about-highlight" : undefined}
              key={i}
            >
              {segment.text}
            </span>
          ))}
        </p>
      </div>

      {/* Marquee area with two rows */}
      <div className="about-marquee-area">
        {/* Fade masks */}
        <div className="about-marquee-mask about-marquee-mask--left" />
        <div className="about-marquee-mask about-marquee-mask--right" />

        {/* Row 1: Full-Stack & DevOps — moves Left → Right */}
        <div className="about-marquee about-marquee--row1">
          <div className="about-marquee-track" ref={marqueeTrack1Ref}>
            {[...DEVOPS_FULLSTACK, ...DEVOPS_FULLSTACK].map((name, i) => (
              <div className="about-marquee-item" key={`fs-${i}`}>
                <span className="about-marquee-icon">⚡</span>
                <span className="about-marquee-name">{name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: ML & DL — moves Right → Left */}
        <div className="about-marquee about-marquee--row2">
          <div className="about-marquee-track" ref={marqueeTrack2Ref}>
            {[...ML_DL, ...ML_DL].map((name, i) => (
              <div
                className="about-marquee-item about-marquee-item--ml"
                key={`ml-${i}`}
              >
                <span className="about-marquee-icon about-marquee-icon--ml">
                  🧠
                </span>
                <span className="about-marquee-name">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
