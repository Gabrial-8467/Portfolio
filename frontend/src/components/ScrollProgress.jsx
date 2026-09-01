import { useScrollProgress } from '../hooks/useScrollProgress';

export default function ScrollProgress() {
  const { progress } = useScrollProgress();

  return (
    <div className="scroll-progress-bar" aria-hidden="true">
      <div
        className="scroll-progress-fill"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
