import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50">
    <motion.h1
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7 }}
      className="text-7xl font-extrabold text-blue-600 mb-4"
    >
      404
    </motion.h1>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="text-2xl text-gray-700 mb-8"
    >
      Oops! Page not found.
    </motion.p>
    <Link
      to="/"
      className="px-6 py-3 bg-blue-600 text-white font-semibold rounded shadow hover:bg-blue-700 transition"
    >
      Go Home
    </Link>
  </div>
);

export default NotFound; 