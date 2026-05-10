'use client';
// components/landing/TechStack.tsx
import { motion } from 'framer-motion';
import ScrollReveal from '@/components/ui/ScrollReveal';

const techItems = [
  { name: 'Next.js', color: 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' },
  { name: 'Flutter', color: 'bg-[#02569B]/10 text-[#02569B] dark:text-[#45D1FD] border-[#02569B]/20 dark:border-[#45D1FD]/20' },
  { name: 'Supabase', color: 'bg-[#3ECF8E]/10 text-[#3ECF8E] border-[#3ECF8E]/20' },
  { name: 'FastAPI', color: 'bg-[#009688]/10 text-[#009688] dark:text-[#00BFA5] border-[#009688]/20' },
  { name: 'Python', color: 'bg-[#3776AB]/10 text-[#3776AB] dark:text-[#FFD43B] border-[#3776AB]/20 dark:border-[#FFD43B]/20' },
  { name: 'Tailwind CSS', color: 'bg-[#38B2AC]/10 text-[#38B2AC] border-[#38B2AC]/20' },
];

export default function TechStack() {
  return (
    <section className="py-16 bg-white dark:bg-dark-surface border-y border-outline-variant/10 dark:border-dark-border" id="tech-stack">
      <div className="section-wrapper">
        <ScrollReveal>
          <div className="text-center mb-10">
            <p className="text-on-surface-variant text-sm font-semibold uppercase tracking-wider">
              Powered by Modern Technologies
            </p>
          </div>
        </ScrollReveal>

        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
          {techItems.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.5, y: 40 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              animate={{ 
                y: [0, -10, 0],
              }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ 
                opacity: { duration: 0.5, delay: index * 0.1 },
                scale: { duration: 0.5, delay: index * 0.1, type: "spring", bounce: 0.4 },
                y: {
                  duration: 3 + (index % 3) * 0.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                  delay: index * 0.2
                }
              }}
              whileHover={{ 
                scale: 1.15, 
                rotate: index % 2 === 0 ? 3 : -3,
                boxShadow: "0px 10px 30px rgba(0,0,0,0.1)",
                transition: { duration: 0.2, type: 'spring', stiffness: 400 }
              }}
              className={`px-8 py-4 rounded-full border-2 flex items-center justify-center font-bold text-base md:text-lg cursor-pointer ${tech.color}`}
            >
              {tech.name}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
