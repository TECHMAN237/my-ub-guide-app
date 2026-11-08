import React from "react";
import { motion, useReducedMotion } from "motion/react";

/** Only wrap secondary, below-fold content; primary actions never wait for motion. */
export const Reveal: React.FC<
  React.PropsWithChildren<{ className?: string }>
> = ({ children, className }) => {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};
