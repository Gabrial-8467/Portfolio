import { FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = ({ name = "Gabrial Deora" }) => {
  return (
    <footer className="w-full py-6 bg-gray-900 flex flex-col items-center mt-12">
      <div className="flex space-x-6 mb-2">
        <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-2xl transition">
          <FaGithub />
        </a>
        <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-white text-2xl transition">
          <FaLinkedin />
        </a>
      </div>
      <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} {name}. All rights reserved.</p>
    </footer>
  );
};

export default Footer; 