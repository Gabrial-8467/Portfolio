// Reusable Grid Lines Overlay component to match the Figma visual architecture
export default function GridLines() {
  return (
    <div className="grid-lines-bg" aria-hidden="true">
      <div className="grid-col-line" />
      <div className="grid-col-line" />
      <div className="grid-col-line" />
      <div className="grid-col-line" />
    </div>
  );
}
