import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import emailjs from "@emailjs/browser";
import portfolioData from "../data/portfolio.json";
import "../styles/Contact.css";

gsap.registerPlugin(ScrollTrigger);

/* ── Inline SVG icons keyed by portfolioData.social[].icon ── */
const SOCIAL_ICONS = {
  github: (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  ),
  linkedin: (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  leetcode: (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
    </svg>
  ),
  instagram: (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  ),
  email: (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  ),
};

/* ── Brand colors per platform ── */
const BRAND_COLORS = {
  github: "var(--brand-github)",
  linkedin: "#0a66c2",
  leetcode: "#ffa116",
  instagram: "#E1306C",
  email: "#ea4335",
};

const Contact = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const iconsRef = useRef([]);
  const composerRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    emailjs.init("KyVFNUFqow024C0FI");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 50, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      );

      gsap.fromTo(
        iconsRef.current,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: "elastic.out(1, 0.6)",
          stagger: 0.08,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        },
      );

      if (composerRef.current) {
        gsap.fromTo(
          composerRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: composerRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const validateEmail = (value) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(value).toLowerCase());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, message } = formData;

    if (!message.trim()) {
      setError("Please type your message.");
      return;
    }
    if (!email.trim() || !validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    setError("");

    emailjs
      .send(
        "service_yl1wntu",
        "template_1n5h3bv",
        {
          from_name: name,
          from_email: email,
          message: message,
        },
        "KyVFNUFqow024C0FI",
      )
      .then(
        () => {
          setSuccess(true);
          setFormData({ name: "", email: "", message: "" });
        },
        (error) => {
          console.error("EmailJS send error:", error);
          setError(
            "Unable to send your message right now. Please try again later.",
          );
        },
      );
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", message: "" });
    setError("");
    setSuccess(false);
  };

  return (
    <section className="contact" id="contact" ref={sectionRef}>
      <div className="contact-glow contact-glow--left" />
      <div className="contact-glow contact-glow--right" />

      <h2 className="contact-heading" ref={headingRef}>
        Contact me
      </h2>

      <div className="contact-socials">
        {portfolioData.social.map((s, i) => (
          <a
            key={s.name}
            href={s.url}
            target={s.icon === "email" ? "_self" : "_blank"}
            rel="noopener noreferrer"
            className={`contact-social-card contact-social--${s.icon}`}
            ref={(el) => (iconsRef.current[i] = el)}
            style={{ "--brand-color": BRAND_COLORS[s.icon] }}
            data-cursor="exclusion"
          >
            <span className="contact-social-icon">{SOCIAL_ICONS[s.icon]}</span>
            {s.followers && (
              <span className="contact-social-badge">{s.followers}</span>
            )}
            <span className="contact-social-label">{s.name}</span>
          </a>
        ))}
      </div>

      <div className="contact-composer-container" ref={composerRef}>
        <div className="contact-composer-label">
          <span>►</span> DROP A MESSAGE IF YOU VIBE
        </div>

        {!success ? (
          <form className="contact-composer-form" onSubmit={handleSubmit}>
            <div className="contact-composer-input-row">
              <input
                type="text"
                name="message"
                placeholder="Type your message"
                value={formData.message}
                onChange={handleChange}
                className="contact-composer-input"
                autoComplete="off"
              />
              <input
                type="email"
                name="email"
                placeholder="Type your email address"
                value={formData.email}
                onChange={handleChange}
                className="contact-composer-input"
                autoComplete="off"
              />
              <input
                type="text"
                name="name"
                placeholder="Type your name"
                value={formData.name}
                onChange={handleChange}
                className="contact-composer-input"
                autoComplete="off"
              />
              <button
                type="submit"
                className="contact-composer-btn"
                data-cursor="pointer"
              >
                Send Message
              </button>
            </div>

            <div className="contact-composer-underline" />
            {error && <div className="contact-composer-error">{error}</div>}
          </form>
        ) : (
          <div className="contact-composer-success">
            <div className="success-icon-wrapper">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h4 className="success-title">Message Sent Successfully!</h4>
            <p className="success-desc">
              Thank you, {formData.name || "there"}. I will get back to you
              soon.
            </p>
            <button
              className="success-reset-btn"
              onClick={resetForm}
              data-cursor="pointer"
            >
              Send another message
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Contact;
