import { motion } from "framer-motion";
import { FaGraduationCap } from "react-icons/fa";

const education = [
  {
    year: "2022-2026",
    title: "B.TECH CSE Specialization in Cyber Security and Forensics",
    org: "CT University",
    description: "Graduation Expected to be completed in 2026.",
  },
  {
    year: "March 2022",
    title: "10+2 (Non-Medical)",
    org: "Teja Singh Sutantar Memorial Sr. Sec. School",
  },
];

const Education = () => (
  <section id="education" className="py-24 bg-white flex flex-col items-center px-4 md:px-0">
    <motion.h2
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="text-3xl font-bold text-blue-800 mb-8 bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text"
    >
      <span className="inline-flex items-center gap-2"><FaGraduationCap className="text-blue-500 text-2xl" /> Education</span>
    </motion.h2>
    <div className="relative w-full max-w-3xl">
      <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-300 to-blue-500 rounded-full"></div>
      {education.map((item, idx) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: idx * 0.1 }}
          className="relative mb-10 pl-16"
        >
          <div className="absolute left-2 top-2 w-8 h-8 bg-white border-4 border-blue-400 rounded-full flex items-center justify-center shadow">
            <FaGraduationCap className="text-blue-500 text-lg" />
          </div>
          <div className="ml-8 bg-white rounded-xl shadow-lg p-6 hover:scale-[1.03] transition-transform">
            <div className="text-sm text-blue-600 font-semibold mb-1">{item.year}</div>
            <div className="text-xl font-bold text-gray-800 mb-1">{item.title}</div>
            <div className="text-gray-600 mb-2">{item.org}</div>
            <div className="text-gray-700">{item.description}</div>
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

export default Education; 