import { motion } from "framer-motion";
import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";

const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-white flex flex-col items-center px-4 md:px-0">
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-3xl font-bold text-gray-900 mb-4"
      >
        Contact
      </motion.h2>
      <motion.form
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="w-full max-w-md bg-blue-50 rounded-xl shadow-md p-8 flex flex-col gap-4 mb-8"
      >
        <input
          type="text"
          placeholder="Your Name"
          className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <input
          type="email"
          placeholder="Your Email"
          className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <textarea
          placeholder="Your Message"
          rows="4"
          className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
        >
          Send Message
        </button>
      </motion.form>
      <div className="flex gap-6 mt-2">
        <a href="mailto:your@email.com" className="text-blue-600 text-2xl hover:text-blue-800 transition" aria-label="Email">
          <FaEnvelope />
        </a>
        <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-gray-700 text-2xl hover:text-gray-900 transition" aria-label="GitHub">
          <FaGithub />
        </a>
        <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" className="text-blue-700 text-2xl hover:text-blue-900 transition" aria-label="LinkedIn">
          <FaLinkedin />
        </a>
      </div>
    </section>
  );
};

export default Contact; 