import { useState, useEffect, useRef } from 'react';

export function useInView(options) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);
  const optionsRef = useRef(options);

  optionsRef.current = options;

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // eslint-disable-next-line react/set-state-in-effect
      setIsInView(true);
      return undefined;
    }

    const currentOptions = optionsRef.current;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.unobserve(entry.target);
      }
    }, currentOptions || { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    observer.observe(node);

    return () => {
      if (node) observer.unobserve(node);
    };
  }, []);

  return [ref, isInView];
}
