import { useState, useEffect, useRef } from 'react';

export function useInView(options) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);
  const optionsKey = JSON.stringify(options || null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // eslint-disable-next-line react/set-state-in-effect
      setIsInView(true);
      return undefined;
    }

    const currentOptions = options || { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.unobserve(entry.target);
      }
    }, currentOptions);

    observer.observe(node);

    return () => {
      if (node) observer.unobserve(node);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionsKey]);

  return [ref, isInView];
}
