import React from "react";
import { Typography } from "antd";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Updated to use useNavigate from react-router-dom

const titleVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 1 } },
  hover: { scale: 1.1, transition: { yoyo: Infinity, duration: 0.5 } },
  click: { scale: 1.2, transition: { duration: 0.2 } }, // Pop animation on click
};

const AnimatedTitle = () => {
  const navigate = useNavigate(); // Updated to use useNavigate

  const handleClick = () => {
    // Redirect to home page
    navigate("/");
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="click" // Trigger pop animation on click
      variants={titleVariants}
      onClick={handleClick}
      style={{ cursor: "pointer" }} // Add cursor pointer to indicate clickable
    >
      <Typography.Title level={3} style={{ color: "white", flex: 1, margin: 0 }}>
        AIMS 2.0
      </Typography.Title>
    </motion.div>
  );
};

export default AnimatedTitle;
