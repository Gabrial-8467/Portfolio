import { useEffect, useState } from 'react';

/**
 * Detects whether the header is currently overlapping a dark section,
 * so the nav text can flip to white. Returns a boolean `isNavDark`.
 */
export function useDarkSections() {
  const [isNavDark, setIsNavDark] = useState(false);

  useEffect(() => {
    const darkSections = document.querySelectorAll('.section-dark, .footer-section');
    const header = document.querySelector('.header');

    const checkNavColor = () => {
      const headerBottom = header ? header.getBoundingClientRect().bottom : 0;
      let onDark = false;
      darkSections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= headerBottom && rect.bottom >= 0) {
          onDark = true;
        }
      });
      setIsNavDark(onDark);
    };

    checkNavColor();
    window.addEventListener('scroll', checkNavColor, { passive: true });
    return () => window.removeEventListener('scroll', checkNavColor);
  }, []);

  return isNavDark;
}
