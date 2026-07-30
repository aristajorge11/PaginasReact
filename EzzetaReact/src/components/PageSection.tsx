import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

type PageSectionProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  id?: string;
};

export const PageSection = ({ children, className = '', delay = 0, id }: PageSectionProps) => {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.35, delay }}
      className={className}
    >
      {children}
    </motion.section>
  );
};
