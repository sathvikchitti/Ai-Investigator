import { motion, useInView } from "motion/react";
import React, { useRef } from "react";

interface BlurTextProps {
  text: string;
  delay?: number;
  className?: string;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
}

const BlurText: React.FC<BlurTextProps> = ({
  text = "",
  delay = 0,
  className = "",
  animateBy = "words",
  direction = "top",
}) => {
  const elements = animateBy === "words" ? text.split(" ") : text.split("");
  const yOffset = direction === "top" ? -20 : 20;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <span ref={ref} className={`inline-flex flex-wrap ${className}`}>
      {elements.map((element, index) => {
        return (
          <React.Fragment key={index}>
            <motion.span
              initial={{ filter: "blur(10px)", opacity: 0, y: yOffset }}
              animate={isInView ? { filter: "blur(0px)", opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.8,
                delay: delay / 1000 + index * 0.1,
                ease: "easeOut",
              }}
              className="inline-block"
            >
              {element}
            </motion.span>
            {animateBy === "words" && index < elements.length - 1 && (
              <span className="inline-block">&nbsp;</span>
            )}
          </React.Fragment>
        );
      })}
    </span>
  );
};

export default BlurText;
