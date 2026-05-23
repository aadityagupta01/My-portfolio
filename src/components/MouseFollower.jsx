import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import '../styles/MouseFollower.css';

const MouseFollower = () => {
  const cursorRef = useRef(null);
  const pointerRef = useRef(null);
  const [text, setText] = useState('');
  const [isRightArrow, setIsRightArrow] = useState(false);

  useEffect(() => {
    // Only enable on devices that support hover (desktops/laptops)
    const hasHover = window.matchMedia('(hover: hover)').matches;
    if (!hasHover) return;

    const cursor = cursorRef.current;
    const pointer = pointerRef.current;
    if (!cursor || !pointer) return;

    // Position off-screen initially
    gsap.set(cursor, { x: -100, y: -100, opacity: 0 });
    gsap.set(pointer, { x: -100, y: -100, opacity: 0 });

    // GSAP quickTo for ultra-smooth 60fps tracking on the follower
    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3.out' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3.out' });

    let hasMoved = false;

    // Track mouse coordinates
    const handleMouseMove = (e) => {
      if (!hasMoved) {
        hasMoved = true;
        gsap.to(cursor, { opacity: 1, duration: 0.2 });
        gsap.to(pointer, { opacity: 1, duration: 0.2 });
      }
      xTo(e.clientX);
      yTo(e.clientY);
      
      // Update pointer position instantly (zero lag) for maximum responsiveness
      gsap.set(pointer, { x: e.clientX, y: e.clientY });
    };

    // active class (mousedown/mouseup)
    const handleMouseDown = () => {
      cursor.classList.add('-active');
    };

    const handleMouseUp = () => {
      cursor.classList.remove('-active');
    };

    // hide/show on window boundary cross
    const handleMouseLeave = () => {
      gsap.to(cursor, { opacity: 0, duration: 0.25 });
      gsap.to(pointer, { opacity: 0, duration: 0.25 });
    };

    const handleMouseEnter = () => {
      gsap.to(cursor, { opacity: 1, duration: 0.2 });
      gsap.to(pointer, { opacity: 1, duration: 0.2 });
    };

    // Dynamic Hover delegation
    const handleMouseOver = (e) => {
      // First, check for interactive elements/cards
      const interactiveTarget = e.target.closest(
        '[data-cursor], a, button, .navbar__pill, .projects__card, .whatido__card, .contact-social-card'
      );

      // Second, check for plain text elements
      const textTarget = e.target.closest('h1, h2, h3, h4, h5, h6, p, li, span, code');

      // Decide target priority (interactive parents override normal text)
      const target = interactiveTarget || textTarget;
      if (!target) return;

      let cursorClass = '';
      let cursorText = '';
      let cursorColor = '';
      let useRightArrow = false;

      if (interactiveTarget) {
        // Extract interactive details
        const dataCursor = target.getAttribute('data-cursor');
        const dataText = target.getAttribute('data-cursor-text');
        const dataColor = target.getAttribute('data-cursor-color');

        // Determine state class
        if (dataCursor) {
          cursorClass = dataCursor;
        } else if (
          target.tagName === 'A' ||
          target.tagName === 'BUTTON' ||
          target.classList.contains('navbar__pill')
        ) {
          cursorClass = '-pointer';
        }

        if (dataText) {
          cursorClass = '-text';
          cursorText = dataText;
        }

        // Check specific components
        if (target.classList.contains('projects__card')) {
          cursorClass = '-arrow';
          cursorColor = target.style.getPropertyValue('--project-accent') || '#10b981';
        } else if (target.classList.contains('whatido__card')) {
          cursorClass = '-arrow';
          useRightArrow = true;
          cursorColor = target.style.getPropertyValue('--card-accent') || '#10b981';
        } else if (target.classList.contains('contact-social-card')) {
          cursorClass = '-exclusion';
        }

        // Override with custom data attribute color if defined
        if (dataColor) {
          cursorColor = dataColor;
        }
      } else if (textTarget) {
        // Normal body text hover: expand dot into translucent ring to reveal text underneath
        cursorClass = '-pointer';
      }

      // Set class state
      if (cursorClass) {
        cursor.className = `mf-cursor ${cursorClass}`;
      }

      // Hide pointer arrow in -arrow or -text states to keep the look clean
      if (cursorClass === '-arrow' || cursorClass === '-text') {
        gsap.to(pointer, { opacity: 0, duration: 0.15 });
      } else {
        gsap.to(pointer, { opacity: 1, duration: 0.15 });
      }

      // Set text
      if (cursorText) {
        setText(cursorText);
      }

      // Set arrow orientation
      setIsRightArrow(useRightArrow);

      // Set brand color highlights
      if (cursorColor) {
        cursor.style.setProperty('--cursor-accent', cursorColor);
        cursor.style.setProperty('--cursor-accent-glow', `${cursorColor}4d`); // 30% opacity
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target.closest(
        '[data-cursor], a, button, .navbar__pill, .projects__card, .whatido__card, .contact-social-card, h1, h2, h3, h4, h5, h6, p, li, span, code'
      );
      if (!target) return;

      // Revert to normal
      cursor.className = 'mf-cursor';
      setText('');
      setIsRightArrow(false);
      cursor.style.removeProperty('--cursor-accent');
      cursor.style.removeProperty('--cursor-accent-glow');
      
      // Re-show pointer arrow
      gsap.to(pointer, { opacity: 1, duration: 0.15 });
    };

    // Bind event listeners
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      // Clean up
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return (
    <>
      {/* Custom Mouse Pointer (classic black arrow with white outline) */}
      <div className="mf-pointer" ref={pointerRef}>
        <svg className="mf-pointer-arrow" viewBox="0 0 24 24" fill="none">
          <path
            d="M0 0 v14.5 l3.8 -3.8 l4.7 8.8 l2.2 -1.2 l-4.7 -8.8 h5.3 z"
            fill="black"
            stroke="white"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Lagging Glowing Green Follower */}
      <div className="mf-cursor" ref={cursorRef}>
        <div className="mf-cursor-inner">
          {/* Diagonal Arrow (for Projects / General Links) */}
          {!isRightArrow ? (
            <svg className="mf-cursor-arrow-svg" viewBox="0 0 24 24">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          ) : (
            /* Horizontal Arrow (for Skills / Directional buttons) */
            <svg className="mf-cursor-arrow-svg" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          )}
          <span className="mf-cursor-text-span">{text}</span>
        </div>
      </div>
    </>
  );
};

export default MouseFollower;
