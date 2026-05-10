'use client';
// components/landing/FAQ.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import ScrollReveal, { StaggerContainer, StaggerItem } from '@/components/ui/ScrollReveal';
import { cn } from '@/lib/utils';

const faqs = [
  {
    question: 'What is CardioGuard?',
    answer: 'CardioGuard is an AI-powered health companion designed to assess your cardiovascular disease risk using machine learning models trained on extensive clinical datasets. It provides a risk probability and actionable insights.',
  },
  {
    question: 'Is my medical data secure?',
    answer: 'Absolutely. We prioritize your privacy above all else. All your personal and health data is encrypted both in transit and at rest using industry-standard security protocols via Supabase.',
  },
  {
    question: 'Does this replace my doctor?',
    answer: 'No. CardioGuard is an informational and supportive tool meant to help you track your health and understand potential risks. It is not a substitute for professional medical advice, diagnosis, or treatment.',
  },
  {
    question: 'How accurate are the predictions?',
    answer: 'Our machine learning models have been trained on over 70,000 medical records and achieve high accuracy in risk prediction. However, it relies entirely on the accuracy of the data you provide.',
  },
  {
    question: 'Is there a mobile app available?',
    answer: 'Yes! CardioGuard is built as a complete ecosystem. We have a companion mobile application built with Flutter, allowing you to seamlessly sync and check your heart health on the go.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-surface dark:bg-dark-surface/50" id="faq">
      <div className="section-wrapper max-w-3xl">
        <div className="text-center mb-16">
          <ScrollReveal>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
              Answers
            </span>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className="font-jakarta text-4xl md:text-5xl font-bold text-on-surface dark:text-white mb-4">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
          </ScrollReveal>
        </div>

        <StaggerContainer className="space-y-4" staggerDelay={0.1}>
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <StaggerItem key={index}>
                <motion.div
                  className={cn(
                    'bg-white dark:bg-dark-surface rounded-2xl overflow-hidden shadow-sm border transition-all duration-300',
                    isOpen ? 'border-primary/50 dark:border-primary/50 shadow-md' : 'border-outline-variant/20 dark:border-dark-border hover:border-primary/30'
                  )}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                  >
                    <span className="font-semibold text-on-surface dark:text-white text-lg">
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className={cn(
                        'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors',
                        isOpen ? 'bg-primary text-white' : 'bg-surface-container dark:bg-white/5 text-on-surface-variant'
                      )}
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.div>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <div className="px-6 pb-6 pt-2 text-on-surface-variant dark:text-white/70 leading-relaxed border-t border-outline-variant/10 dark:border-dark-border mx-6">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
