import { motion } from "framer-motion";
import { FaTrophy } from "react-icons/fa";

const achievements = [
  {
    year: "2023",
    title: "Participated in Hackathon",
    description: "Participated in Hackathon held at CT University in 2023.",
  },
  {
    year: "2025",
    title: "Participated in Hackathon",
    description: "Participated in Hackathon held at CT University in 2025.",
  },
  {
    year: "2025",
    title: "Participated in Hackathon (SIH)",
    description: "Participated in Hackathon (SIH) held at LPU in 2025.",
  },
];

const Achievements = () => (
  <section id="achievements" className="py-24 bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center px-4 md:px-0">
    <motion.h2
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="text-3xl font-bold text-blue-800 mb-8 bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text"
    >
      <span className="inline-flex items-center gap-2"><FaTrophy className="text-yellow-500 text-2xl" /> Achievements</span>
    </motion.h2>
    <div className="relative w-full max-w-3xl">
      <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-200 to-yellow-400 rounded-full"></div>
      {achievements.map((item, idx) => (
        <motion.div
          key={item.title + item.year}
          initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: idx * 0.1 }}
          className="relative mb-10 pl-16"
        >
          <div className="absolute left-2 top-2 w-8 h-8 bg-white border-4 border-yellow-400 rounded-full flex items-center justify-center shadow">
            <FaTrophy className="text-yellow-500 text-lg" />
          </div>
          <div className="ml-8 bg-white rounded-xl shadow-lg p-6 hover:scale-[1.03] transition-transform">
            <div className="text-sm text-blue-600 font-semibold mb-1">{item.year}</div>
            <div className="text-xl font-bold text-gray-800 mb-1">{item.title}</div>
            <div className="text-gray-700">{item.description}</div>
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

export default Achievements; 