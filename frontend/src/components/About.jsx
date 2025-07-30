import { motion } from "framer-motion";
import Counters from "./Counters";
import { FaReact, FaNodeJs, FaCss3Alt, FaHtml5, FaGitAlt, FaFigma, FaGithub, FaUserSecret } from "react-icons/fa";
import { SiJavascript, SiLinux, SiSqlite, SiExpress, SiMongodb, SiPython } from "react-icons/si";
import profile from "../assets/profile.jpg";

const skills = [
  { name: "HTML5", level: 70, icon: <FaHtml5 className="text-orange-500 text-2xl" /> },
  { name: "Tailwind CSS", level: 65, icon: <FaCss3Alt className="text-blue-600 text-2xl" /> },
  { name: "JavaScript", level: 70, icon: <SiJavascript className="text-yellow-400 text-2xl" /> },
  { name: "ReactJS", level: 50, icon: <FaReact className="text-blue-500 text-2xl" /> },
  { name: "ExpressJS", level: 65, icon: <SiExpress className="text-blue-400 text-2xl" /> },
  { name: "Node.js", level: 75, icon: <FaNodeJs className="text-green-600 text-2xl" /> },
  { name: "MongoDB", level: 50, icon: <SiMongodb className="text-pink-500 text-2xl" /> },
  { name: "Github", level: 85, icon: <FaGithub className="text-red-500 text-2xl" /> },
  { name: "Python", level: 40, icon: <SiPython className="text-pink-500 text-2xl" /> },
  { name: "Linux", level: 75, icon: <SiLinux className="text-blue-400 text-2xl" /> },
  { name: "SQL", level: 50, icon: <SiSqlite className="text-blue-400 text-2xl" /> },
  { name: "Ethical Hacking", level: 30, icon: <FaUserSecret className="text-blue-400 text-2xl" /> },
];

const About = () => {
  return (
    <section id="about" className="py-40 flex flex-col items-center px-4 md:px-0 bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-3xl font-bold text-blue-800 mb-16"
      >
        About Me
      </motion.h2>
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="w-full max-w-4xl flex flex-col md:flex-row items-center gap-24 mt-16"
      >
        <img
          src={profile}
          alt="Gabrial Deora"
          className="w-55 h-55 md:w-80 md:h-80 rounded-full object-cover border-4 border-blue-200 shadow-lg mb-14 md:mb-0"
        />
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-8 text-blue-800">My Journey</h3>
          <p className="text-gray-600 mb-8">
            I am a passionate Full Stack Web Developer and Computer Science student at CT University. I love learning new technologies, taking on challenges, and building modern web applications. My skills include HTML, CSS, JavaScript, React, Node.js, MongoDB, Express.js, and more. My goal is to become a top-tier developer. In my free time, I enjoy playing badminton and online games like Clash of Clans.
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-12 space-y-4">
            <li>Participated in Hackathon held at CT University in 2023</li>
            <li>Participated in Hackathon held at CT University in 2025</li>
            <li>Participated in Hackathon (SIH) held at LPU in 2025</li>
          </ul>
          <a
            href="/resume.pdf"
            download
            className="inline-block mt-8 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold rounded-full shadow hover:scale-105 hover:from-blue-700 hover:to-blue-500 transition transform duration-200"
          >
            Download CV
          </a>
        </div>
      </motion.div>
      <div className="my-24" />
      <Counters />
      <div className="w-full max-w-xl space-y-14 mt-20">
        {skills.map((skill, idx) => (
          <div key={skill.name}>
            <div className="flex justify-between mb-5 items-center">
              <span className="flex items-center gap-2 font-medium text-blue-700">{skill.icon}{skill.name}</span>
              <span className="text-sm text-gray-500">{skill.level}%</span>
            </div>
            <div className="w-full bg-blue-100 rounded-full h-3">
              
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default About; 