import { useRef, useState, useEffect } from 'react';

export default function MagneticButton({
  children,
  className = '',
  strength = 0.35,
  as: Component = 'button',
  ...props
}) {
  const btnRef = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Disable magnetic physics on mobile or reduced motion
    if (window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const node = btnRef.current;
    if (!node) return undefined;

    const handleMouseMove = (e) => {
      const rect = node.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      setOffset({ x: deltaX, y: deltaY });
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      setOffset({ x: 0, y: 0 });
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    node.addEventListener('mousemove', handleMouseMove);
    node.addEventListener('mouseleave', handleMouseLeave);
    node.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      node.removeEventListener('mousemove', handleMouseMove);
      node.removeEventListener('mouseleave', handleMouseLeave);
      node.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [strength]);

  return (
    <Component
      ref={btnRef}
      className={`magnetic-btn-wrap ${className} ${isHovered ? 'magnetic-active' : ''}`}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition: isHovered ? 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1)' : 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
      }}
      {...props}
    >
      {children}
    </Component>
  );
}
