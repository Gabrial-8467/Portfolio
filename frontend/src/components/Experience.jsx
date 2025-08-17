import { motion } from "framer-motion";
import { FaBriefcase } from "react-icons/fa";

const experience = [
  {
    year: "Aug 2023 -Sep 2023",
    title: "Intern Trainee",
    org: "All Soft Solutions",
    description: "In this internship I have learned about the basics of Linux, Ethical Hacking and Cyber Security.",
  },
  {
    year: "Jun 2024 - Aug 2024",
    title: "Intern Trainee",
    org: "Sensation Software Solutions",
    description: "Gained hands on experience with MongoDB, ExpressJS, ReactJS, NodeJS, and TailwindCSS.",
  },
  {
    year: "Jun 2025 - Jul 2025",
    title: "Intern Trainee",
    org: "Techlive Solutions",
    description: "Gained hands on experience with MongoDB, ExpressJS, ReactJS, NodeJS, and Bootstrap.",
  },
  {
    year: "Jul 2025 - Currently Pursuing",
    title: "Internship",
    org: "Brainwave Matrix Solutions",
    description: "In this internship I made 2 projects Expenditure Tracker and an E-Commerce Website using MERN STACK.",
  },
];

const Experience = () => (
  <section id="experience" className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center px-4 sm:px-6 md:px-0">
    <motion.h2
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="text-2xl sm:text-3xl font-bold text-blue-800 mb-6 sm:mb-8 bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text text-center"
    >
      <span className="inline-flex items-center gap-2"><FaBriefcase className="text-blue-500 text-xl sm:text-2xl" /> Experience</span>
    </motion.h2>
    <div className="relative w-full max-w-3xl px-4 sm:px-0">
      <div className="absolute left-3 sm:left-6 top-0 bottom-0 w-0.5 sm:w-1 bg-gradient-to-b from-blue-300 to-blue-500 rounded-full"></div>
      {experience.map((item, idx) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: idx * 0.1 }}
          className="relative mb-8 sm:mb-10 pl-8 sm:pl-16"
        >
          <div className="absolute left-1 sm:left-2 top-2 w-6 h-6 sm:w-8 sm:h-8 bg-white border-3 sm:border-4 border-blue-400 rounded-full flex items-center justify-center shadow">
            <FaBriefcase className="text-blue-500 text-sm sm:text-lg" />
          </div>
          <div className="ml-4 sm:ml-8 bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:scale-[1.02] sm:hover:scale-[1.03] transition-transform">
            <div className="text-xs sm:text-sm text-blue-600 font-semibold mb-1">{item.year}</div>
            <div className="text-lg sm:text-xl font-bold text-gray-800 mb-1 leading-tight">{item.title}</div>
            <div className="text-gray-600 mb-2 text-sm sm:text-base">{item.org}</div>
            <div className="text-gray-700 text-sm sm:text-base leading-relaxed">{item.description}</div>
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

export default Experience; 
