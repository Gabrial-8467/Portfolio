import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const roles = [
  "Full Stack Web Developer",
];

const TYPING_SPEED = 80;
const PAUSE = 3000;

const Hero = () => {
  const [displayed, setDisplayed] = useState(roles[0]);
  const [roleIdx, setRoleIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let timeout;
    const currentRole = roles[roleIdx];
    if (!deleting && charIdx < currentRole.length) {
      timeout = setTimeout(() => setCharIdx(charIdx + 1), TYPING_SPEED);
      setDisplayed(currentRole.slice(0, charIdx + 1));
    } else if (!deleting && charIdx === currentRole.length) {
      timeout = setTimeout(() => setDeleting(true), PAUSE);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx(charIdx - 1), TYPING_SPEED / 2);
      setDisplayed(currentRole.slice(0, charIdx - 1));
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setRoleIdx((roleIdx + 1) % roles.length);
    }
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, roleIdx]);

  return (
    <section id="home" className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-200 via-white to-blue-100 pt-20 sm:pt-24 md:pt-32 pb-8 sm:pb-12 md:pb-16 px-4 sm:px-6">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-blue-800 mb-3 sm:mb-4 text-center drop-shadow-sm tracking-tight px-2"
      >
        Hi, I'm <span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">Gabrial Deora</span>
      </motion.h1>
      <motion.h2
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-700 mb-4 sm:mb-6 text-center min-h-[2rem] sm:min-h-[2.5rem] px-2"
      >
        {displayed}
        <span className="inline-block w-1.5 sm:w-2 h-4 sm:h-6 bg-blue-700 align-middle animate-pulse ml-1" style={{ verticalAlign: 'middle' }} />
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="max-w-sm sm:max-w-md md:max-w-xl text-center text-gray-600 text-base sm:text-lg mb-6 sm:mb-8 px-4"
      >
        I build beautiful, responsive websites and web apps with a focus on user experience and performance.
      </motion.p>
      <a
        href="#projects"
        className="inline-block px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold rounded-full shadow-lg hover:scale-105 hover:from-blue-700 hover:to-blue-500 transition transform duration-200 text-sm sm:text-base"
      >
        View My Work
      </a>
    </section>
  );
};

export default Hero; 