import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import portfolioData from "../data/portfolio.json";
import "../styles/Hero.css";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const sectionRef = useRef(null);
  const photoContainerRef = useRef(null);
  const photoRef = useRef(null);
  const glowRef = useRef(null);
  const titleLeftRef = useRef(null);
  const bioRightRef = useRef(null);
  const lastNameRef = useRef(null);
  const firstNameRef = useRef(null);
  const techRowRef = useRef(null);
  const subtitleRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  const { personal, techStack } = portfolioData;

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── INITIAL STATES ──
      gsap.set(titleLeftRef.current, { opacity: 0, x: -80 });
      gsap.set(bioRightRef.current, { opacity: 0, x: 80 });
      gsap.set(photoContainerRef.current, { opacity: 0, scale: 0.7 });
      gsap.set(subtitleRef.current, { opacity: 0, y: 20 });
      gsap.set(lastNameRef.current, { opacity: 0, y: 60 });
      gsap.set(firstNameRef.current, {
        opacity: 0,
        y: 80,
        clipPath: "inset(100% 0 0 0)",
      });

      const techPills = techRowRef.current?.querySelectorAll(".hero-tech-pill");
      if (techPills) {
        gsap.set(techPills, { opacity: 0, y: 30, scale: 0.8 });
      }

      if (scrollIndicatorRef.current) {
        gsap.set(scrollIndicatorRef.current, { opacity: 0 });
      }

      // ── MASTER TIMELINE ──
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.3,
      });

      // Photo entrance
      tl.to(photoContainerRef.current, {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: "elastic.out(1, 0.75)",
      });

      // Title slides in from left
      tl.to(titleLeftRef.current, { opacity: 1, x: 0, duration: 0.9 }, "-=0.7");

      // Bio slides in from right
      tl.to(bioRightRef.current, { opacity: 1, x: 0, duration: 0.9 }, "-=0.7");

      // Subtitle
      tl.to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4");

      // Last name (small text above)
      tl.to(lastNameRef.current, { opacity: 1, y: 0, duration: 0.7 }, "-=0.3");

      // First name reveal (clip-path wipe)
      tl.to(
        firstNameRef.current,
        {
          opacity: 1,
          y: 0,
          clipPath: "inset(0% 0 0 0)",
          duration: 1,
          ease: "power4.out",
        },
        "-=0.4",
      );

      // Tech pills stagger
      if (techPills) {
        tl.to(
          techPills,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.06,
            ease: "back.out(1.7)",
          },
          "-=0.5",
        );
      }

      // Scroll indicator fade in at end
      if (scrollIndicatorRef.current) {
        tl.to(
          scrollIndicatorRef.current,
          { opacity: 1, duration: 0.8 },
          "-=0.3",
        );
      }

      // ── PULSATING GREEN GLOW ──
      gsap.to(glowRef.current, {
        scale: 1.15,
        opacity: 0.6,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // ── SCROLL PARALLAX ON PHOTO ONLY ──
      gsap.to(photoContainerRef.current, {
        y: -60,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      // ── Fade out scroll indicator on scroll ──
      if (scrollIndicatorRef.current) {
        gsap.to(scrollIndicatorRef.current, {
          opacity: 0,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "5% top",
            end: "15% top",
            scrub: true,
          },
        });
      }

      // ── MOUSE PARALLAX TILT ON PHOTO ──
      const section = sectionRef.current;
      const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const xPercent = (clientX / innerWidth - 0.5) * 2; // -1 to 1
        const yPercent = (clientY / innerHeight - 0.5) * 2;

        gsap.to(photoRef.current, {
          rotateY: xPercent * 12,
          rotateX: -yPercent * 12,
          duration: 0.8,
          ease: "power2.out",
        });

        // Subtle parallax shift on glow
        gsap.to(glowRef.current, {
          x: xPercent * 15,
          y: yPercent * 15,
          duration: 1,
          ease: "power2.out",
        });
      };

      section?.addEventListener("mousemove", handleMouseMove);

      // Reset on mouse leave
      const handleMouseLeave = () => {
        gsap.to(photoRef.current, {
          rotateY: 0,
          rotateX: 0,
          duration: 0.6,
          ease: "power2.out",
        });
        gsap.to(glowRef.current, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        });
      };

      section?.addEventListener("mouseleave", handleMouseLeave);

      // Store cleanup refs
      section._handleMouseMove = handleMouseMove;
      section._handleMouseLeave = handleMouseLeave;
    }, sectionRef);

    return () => {
      ctx.revert();
      const section = sectionRef.current;
      if (section) {
        section.removeEventListener("mousemove", section._handleMouseMove);
        section.removeEventListener("mouseleave", section._handleMouseLeave);
      }
    };
  }, []);

  // Split title into two lines
  const titleParts = personal.title.split("&");

  return (
    <section className="hero" ref={sectionRef} id="hero">
      {/* Background gradient orbs */}
      <div className="hero-bg-orb hero-bg-orb--1" />
      <div className="hero-bg-orb hero-bg-orb--2" />
      <div className="hero-bg-grid" />

      <div className="hero-content">
        {/* ─── THREE COLUMN LAYOUT ─── */}
        <div className="hero-columns">
          {/* LEFT — Title */}
          <div className="hero-col-left" ref={titleLeftRef}>
            <p className="hero-label">// Intro</p>
            <h2 className="hero-title-line">{titleParts[0]?.trim()}</h2>
            <h2 className="hero-title-line hero-title-line--accent">
              &amp; {titleParts[1]?.trim()}
            </h2>
            <div className="hero-title-decoration" />
          </div>

          {/* CENTER — Photo */}
          <div className="hero-col-center" ref={photoContainerRef}>
            <div
              className="hero-photo-wrapper"
              style={{ perspective: "800px" }}
            >
              <div className="hero-glow" ref={glowRef} />
              <div className="hero-glow-ring" />

              {/* Rotating Circular Text */}
              <svg className="hero-circular-text" viewBox="0 0 340 340">
                <defs>
                  <path
                    id="heroCirclePath"
                    d="M 170, 170 m -150, 0 a 150,150 0 1,1 300,0 a 150,150 0 1,1 -300,0"
                  />
                </defs>
                <text>
                  <textPath
                    href="#heroCirclePath"
                    startOffset="0%"
                    textLength="940"
                    lengthAdjust="spacing"
                  >
                    {" WEB DEVELOPER ✦ NiT ✦ AWS UG KOLKATA VOLUNTEER ✦"}
                  </textPath>
                </text>
              </svg>

              <img
                ref={photoRef}
                src={personal.photo}
                alt={`${personal.name} ${personal.lastName}`}
                className="hero-photo"
              />
              <div className="hero-photo-border" />
            </div>
            <p className="hero-subtitle" ref={subtitleRef}>
              {personal.subtitle}
            </p>
          </div>

          {/* RIGHT — Bio / Slogan */}
          <div className="hero-col-right" ref={bioRightRef}>
            {/* Three-line slogan (Think / Code / Deploy) styled like the name */}
            <div className="hero-slogan" aria-label="Think Code Deploy">
              <span className="hero-slogan-line">Think</span>
              <span className="hero-slogan-line">Code</span>
              <span className="hero-slogan-line">Deploy</span>
            </div>

            <div className="hero-bio-stats">
              <div className="hero-stat">
                <span className="hero-stat-number">2x</span>
                <span className="hero-stat-label">Hackathon Finalist</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-number">2.6K</span>
                <span className="hero-stat-label">Followers</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── NAME + TECH + SCROLL in normal document flow ─── */}
        <div className="hero-name-tech-block">
          {/* ─── MASSIVE NAME ─── */}
          <div className="hero-name-block">
            <span className="hero-lastname" ref={lastNameRef}>
              {personal.lastName?.toUpperCase()}
            </span>
            <h1 className="hero-firstname" ref={firstNameRef}>
              {personal.name?.toUpperCase()}
            </h1>
          </div>

          {/* ─── TECH ROW ─── */}
          <div className="hero-tech-row" ref={techRowRef}>
            {techStack.map((tech, i) => (
              <span className="hero-tech-pill" key={i}>
                {tech}
              </span>
            ))}
          </div>

          {/* Scroll indicator — in normal flow, not absolute */}
          <div className="hero-scroll-indicator" ref={scrollIndicatorRef}>
            <div className="hero-scroll-line" />
            <span>Scroll</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
