// src/components/AnimatedTitle.js
import React from "react";
import { Typography } from "antd";
import { motion } from "framer-motion";

const titleVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 1 } },
  hover: { scale: 1.1, transition: { yoyo: Infinity, duration: 0.5 } },
};

const AnimatedTitle = () => (
  <motion.div
    initial="hidden"
    animate="visible"
    whileHover="hover"
    variants={titleVariants}
  >
    <Typography.Title level={3} style={{ color: "white", flex: 1, margin: 0 }}>
      AIMS 2.0
    </Typography.Title>
  </motion.div>
);

export default AnimatedTitle;
