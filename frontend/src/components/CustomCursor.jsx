import { useEffect, useState, useRef } from 'react';
import { useMousePosition } from '../hooks/useMousePosition';

export default function CustomCursor() {
  const { x, y, isHovering, cursorText } = useMousePosition();
  const [followerPos, setFollowerPos] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const followerRef = useRef({ x: -100, y: -100 });
  const requestRef = useRef(null);

  useEffect(() => {
    // Only on desktop non-touch
    if (window.matchMedia('(pointer: coarse)').matches) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    // eslint-disable-next-line react/set-state-in-effect
    setIsVisible(true);

    const animateFollower = () => {
      // Smooth spring / lerp follower movement
      followerRef.current.x += (x - followerRef.current.x) * 0.15;
      followerRef.current.y += (y - followerRef.current.y) * 0.15;
      setFollowerPos({
        x: Math.round(followerRef.current.x * 10) / 10,
        y: Math.round(followerRef.current.y * 10) / 10,
      });
      requestRef.current = requestAnimationFrame(animateFollower);
    };

    requestRef.current = requestAnimationFrame(animateFollower);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [x, y]);

  if (!isVisible || x < 0 || y < 0) return null;

  return (
    <>
      {/* Primary Dot Cursor */}
      <div
        className={`custom-cursor-dot ${isHovering ? 'hovering' : ''}`}
        style={{
          transform: `translate3d(${x}px, ${y}px, 0)`,
        }}
      />

      {/* Outer Follower Circle / Badge */}
      <div
        className={`custom-cursor-follower ${isHovering ? 'hovering' : ''} ${cursorText ? 'has-text' : ''}`}
        style={{
          transform: `translate3d(${followerPos.x}px, ${followerPos.y}px, 0)`,
        }}
      >
        {cursorText && <span className="cursor-text">{cursorText}</span>}
      </div>
    </>
  );
}
