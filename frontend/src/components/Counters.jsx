import { useEffect, useState } from "react";
import { animate } from "framer-motion";

const counters = [
  { label: "Months Experience", value: 3 },
  { label: "Projects Completed", value: 6 },
  { label: "Happy Clients", value: 1 },
  { label: "Total Clients", value: 1 },
];

const Counter = ({ value }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return controls.stop;
  }, [value]);

  return <span>{display}</span>;
};

const Counters = () => (
  <div className="w-full max-w-2xl mx-auto flex flex-wrap justify-center gap-8 py-12">
    {counters.map((c) => (
      <div key={c.label} className="flex flex-col items-center">
        <span className="text-4xl font-extrabold text-blue-600">
          <Counter value={c.value} />
        </span>
        <span className="text-gray-700 text-lg font-medium mt-2">{c.label}</span>
      </div>
    ))}
  </div>
);

export default Counters; 