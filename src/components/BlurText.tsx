import { motion } from "motion/react";
import React from "react";

interface BlurTextProps {
  text: string;
  delay?: number;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom" | "left" | "right";
  className?: string;
}

export default function BlurText({
  text,
  delay = 0,
  animateBy = "words",
  direction = "top",
  className = "",
}: BlurTextProps) {
  const elements = animateBy === "words" ? text.split(" ") : text.split("");

  const getInitialTransform = () => {
    switch (direction) {
      case "top":
        return { y: -20 };
      case "bottom":
        return { y: 20 };
      case "left":
        return { x: -20 };
      case "right":
        return { x: 20 };
      default:
        return { y: -20 };
    }
  };

  return (
    <span className={`inline-block ${className}`}>
      {elements.map((el, i) => {
        const initialTransform = getInitialTransform();
        return (
          <motion.span
            key={i}
            initial={{ opacity: 0, filter: "blur(10px)", ...initialTransform }}
            animate={{ opacity: 1, filter: "blur(0px)", x: 0, y: 0 }}
            transition={{
              duration: 0.8,
              delay: delay / 1000 + i * 0.1,
              ease: "easeOut",
            }}
            className="inline-block whitespace-pre"
          >
            {el}{animateBy === "words" && i < elements.length - 1 ? " " : ""}
          </motion.span>
        );
      })}
    </span>
  );
}
