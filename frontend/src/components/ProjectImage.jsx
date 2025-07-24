import { motion } from "framer-motion";

const ProjectImage = ({ src, alt }) => (
  <motion.img
    src={src}
    alt={alt}
    loading="lazy"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ duration: 0.7 }}
    className="rounded mb-4 w-full h-48 object-cover"
  />
);

export default ProjectImage; 