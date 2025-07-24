import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import ProjectImage from "./ProjectImage";
import image from "../assets/image.png";
import karan from "../assets/karanhomeopharmacy.png"
import karan2 from "../assets/karan2.png"
import pizza from "../assets/pizza.png"
import pizza2 from "../assets/pizza2.png"
import intelli from "../assets/intelli.png"

const projects = [
  {
    title: "Portfolio Website",
    description: "A personal portfolio website to showcase my work and skills.",
    details: "Built with React, Tailwind CSS, and Framer Motion. Features responsive design and animated sections.",
    images: [
      image,
    ],
    link: "https://portfolio-peach-rho-97.vercel.app/",
    source: "https://github.com/Gabrial-8467/Portfolio",
    tech: ["React", "Tailwind CSS", "Framer Motion"],
  },
  {
    title: "KARAN HOMEO PHARMACY",
    description: "A e-commerce application with React and Tailwind CSS to sell Homeopathic medicines.",
    details: "Includes product listings, cart, and checkout. Built with React, Tailwind CSS, and Razorpay integration.",
    images: [
      karan, 
      karan2,
    ],
    link: "https://karan-homeo-pharmacy.vercel.app/",
    tech: ["React", "Tailwind CSS","NodeJS","MongoDB", "ExpressJS", "Razorpay"],
  },
  {
    title: "Pizza Delivery Website",
    description: "A full-featured website to order pizza online.",
    details: "Includes product listings, cart, and checkout. Built with React, Bootstrap CSS. ",
    images: [
      pizza,
      pizza2,
    ],
    source: "https://github.com/Gabrial-8467/pizzadelivery_web_app",
    tech: ["React", "Node.js", "MongoDB","ExpressJS","Bootstrap"],
  },
  {
    title: "IntelliQuiz",
    description: "A quiz application to test your knowledge.",
    details: "A modern quiz application built with React.js frontend and MongoDB backend, designed to deliver interactive quiz experiences with real-time analytics.",
    images: [
      intelli,
    ],
    source: "https://github.com/Gabrial-8467/intelliquiz",
    tech: ["React", "Node.js", "MongoDB","ExpressJS","CSS","Gemini API"],
  },
  {
    title: "Deskassitant-Prototype",
    description: "Its voice assistant prototype built with python. It can perform tasks like opening applications, searching the internet, and more.",
    details: "Libraries used in this projects are pyttsx3, speech_recognition, datetime, time, playsound, os, webbrowser, keyboard, pywhatkit, wikipedia, pywikihow.",
    source: "https://github.com/Gabrial-8467/deskassitant-prototype",
    tech: ["Python"],
  },
  {
    title: "Virtual Mouse",
    description: "Its a virtual mouse built with python. It can perform tasks like moving the mouse, clicking by showing the hand gesture.",
    details: "Libraries used in this projects are OpenCV, mediapipe and pyautogui.",
    source: "https://github.com/Gabrial-8467/virtual_mouse_by_GabrialDeora",
    tech: ["Python"],
  },
];

const Projects = () => {
  const [selected, setSelected] = useState(null);

  return (
    <section id="projects" className="py-24 bg-blue-50 flex flex-col items-center px-4 md:px-0">
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-3xl font-bold text-gray-900 mb-8"
      >
        Projects
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        <AnimatePresence>
          {projects.map((project, idx) => (
            <motion.button
              key={project.title}
              onClick={() => setSelected(project)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="block bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition border border-gray-100 text-left cursor-pointer w-full"
            >
              <h3 className="text-xl font-semibold text-blue-700 mb-2">{project.title}</h3>
              <p className="text-gray-600 mb-2">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {project.tech.map((t) => (
                  <span key={t} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    {t}
                  </span>
                ))}
              </div>
              <span className="text-blue-500 text-sm font-medium">View Details →</span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full relative flex flex-col"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
                onClick={() => setSelected(null)}
                aria-label="Close"
              >
                &times;
              </button>
              <div className="flex flex-col md:flex-row gap-6 mb-4">
                <div className="flex-1 flex flex-col gap-2">
                  {selected.images.map((img, i) => (
                    <ProjectImage key={i} src={img} alt={selected.title + ' screenshot ' + (i+1)} />
                  ))}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-blue-700 mb-2">{selected.title}</h3>
                  <p className="text-gray-700 mb-2">{selected.details}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selected.tech.map((t) => (
                      <span key={t} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <a
                      href={selected.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition"
                    >
                      Live Demo
                    </a>
                    <a
                      href={selected.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded font-medium hover:bg-gray-300 transition"
                    >
                      Source Code
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects; 