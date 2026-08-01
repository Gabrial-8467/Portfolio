import { useScrollReveal, useCountUp } from '../hooks/useScrollReveal';

/**
 * Wrapper that applies scroll-reveal animation to its children.
 * Usage: <Reveal type="up" delay={2}><div>content</div></Reveal>
 */
export function Reveal({ children, type = 'up', delay = 0, className = '', as: Tag = 'div', ...rest }) {
  const [ref, isVisible] = useScrollReveal();
  const animClass = `anim-reveal-${type}`;
  const delayClass = delay ? `anim-delay-${delay}` : '';
  const visibleClass = isVisible ? 'anim-visible' : '';

  return (
    <Tag ref={ref} className={`${animClass} ${delayClass} ${visibleClass} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

/**
 * Animated counter component for stat numbers.
 */
export function AnimatedCounter({ end, className = '' }) {
  const [ref, isVisible] = useScrollReveal({ threshold: 0.3 });
  const { value, suffix } = useCountUp(end, isVisible);

  // For non-numeric values like "MERN", just display them
  const isNumeric = /^\d/.test(String(end));

  return (
    <div ref={ref} className={className}>
      {isNumeric ? `${value}${suffix}` : end}
    </div>
  );
}
