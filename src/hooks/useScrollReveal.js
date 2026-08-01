import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for Intersection Observer-based scroll reveal animations.
 * Returns a ref to attach to the element and a boolean `isVisible`.
 *
 * @param {Object} options
 * @param {number} options.threshold - Visibility threshold (0-1). Default 0.15
 * @param {string} options.rootMargin - Root margin. Default '0px 0px -60px 0px'
 * @param {boolean} options.triggerOnce - Only trigger once. Default true
 */
export function useScrollReveal({
  threshold = 0.15,
  rootMargin = '0px 0px -60px 0px',
  triggerOnce = true,
} = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) observer.unobserve(element);
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return [ref, isVisible];
}

/**
 * Custom hook for animating a number from 0 to `end` when `shouldStart` is true.
 *
 * @param {number|string} end - Target number (strings like "3+" will extract the numeric part)
 * @param {boolean} shouldStart - Whether to start counting
 * @param {number} duration - Animation duration in ms. Default 1800
 * @returns {{ value: number, suffix: string }} Current count value and any suffix
 */
export function useCountUp(end, shouldStart, duration = 1800) {
  const [value, setValue] = useState(0);

  // Extract numeric part and suffix (e.g. "3+" → 3, "+")
  const endStr = String(end);
  const numericMatch = endStr.match(/^(\d+(?:\.\d+)?)(.*)/);
  const targetNum = numericMatch ? parseFloat(numericMatch[1]) : 0;
  const suffix = numericMatch ? numericMatch[2] : '';

  useEffect(() => {
    if (!shouldStart) return;

    let startTime = null;
    let animFrame;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * targetNum));

      if (progress < 1) {
        animFrame = requestAnimationFrame(step);
      }
    };

    animFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animFrame);
  }, [shouldStart, targetNum, duration]);

  return { value, suffix };
}

/**
 * Custom hook for parallax scroll effect on an element.
 * Applies a translateY based on scroll position.
 *
 * @param {number} speed - Parallax speed factor. Default 0.3
 */
export function useParallax(speed = 0.3) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const scrolled = window.scrollY;
      const offset = (rect.top + scrolled) * speed;
      element.style.transform = `translateY(${scrolled * speed - offset}px)`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return ref;
}
