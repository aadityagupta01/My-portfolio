import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import portfolioData from "../data/portfolio.json";
import "../styles/Projects.css";

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const cardsRef = useRef([]);
  const pillsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ---- heading animation ---- */
      gsap.from(headingRef.current, {
        x: -80,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      /* ---- cards: staggered clip-path reveal from bottom ---- */
      cardsRef.current.forEach((card, i) => {
        if (!card) return;

        gsap.fromTo(
          card,
          {
            clipPath: "inset(100% 0% 0% 0%)",
            opacity: 0,
          },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            opacity: 1,
            duration: 0.9,
            delay: i * 0.15,
            ease: "power4.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              toggleActions: "play none none none",
            },
          },
        );
      });

      /* ---- tech pills: stagger in after cards ---- */
      pillsRef.current.forEach((group, i) => {
        if (!group) return;
        const pills = group.querySelectorAll(".projects__pill");
        if (!pills.length) return;

        gsap.from(pills, {
          y: 16,
          opacity: 0,
          scale: 0.85,
          duration: 0.45,
          stagger: 0.06,
          ease: "back.out(1.7)",
          delay: 0.35 + i * 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const projects = portfolioData.projects;

  return (
    <section className="projects" id="projects" ref={sectionRef}>
      <div className="projects__container">
        {/* ---------- heading ---------- */}
        <div className="projects__heading" ref={headingRef}>
          <span className="projects__accent-line" />
          <h2 className="projects__title">Projects</h2>
        </div>

        {/* ---------- grid ---------- */}
        <div className="projects__grid">
          {projects.map((project, idx) => (
            <div
              className="projects__card"
              key={idx}
              ref={(el) => (cardsRef.current[idx] = el)}
              style={{ "--project-accent": project.color }}
            >
              {/* gradient header strip */}
              <div className="projects__card-header">
                <div className="projects__card-header-glow" />
                <span className="projects__card-badge">{project.type}</span>
              </div>

              {/* card body */}
              <div className="projects__card-body">
                <h3 className="projects__card-title">{project.title}</h3>
                <p className="projects__card-desc">{project.description}</p>
              </div>

              {/* tech pills */}
              <div
                className="projects__card-tech"
                ref={(el) => (pillsRef.current[idx] = el)}
              >
                {project.tech.map((t, tIdx) => (
                  <span className="projects__pill" key={tIdx}>
                    {t}
                  </span>
                ))}
              </div>

              {/* footer: github link */}
              <div className="projects__card-footer">
                <a
                  className="projects__github-btn"
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${project.title} on GitHub`}
                >
                  <svg
                    className="projects__github-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                  </svg>
                  <span>View on GitHub</span>
                  <svg
                    className="projects__arrow-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 17L17 7" />
                    <path d="M7 7h10v10" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
