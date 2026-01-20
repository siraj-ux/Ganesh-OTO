import { motion } from "framer-motion";
import { HelpCircle, Mail, ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "When does the Class start?",
    answer: "Please go to the Top of the page, all the details are written over there.",
  },
  {
    question: "Is this a live workshop or a pre-recorded workshop?",
    answer: "It will be a live session.",
  },
  {
    question: "Is this workshop meant for beginners?",
    answer:
      "This workshop is meant for beginners as well as finance individuals. My approach to content is quite different, and I can assure you, that you will learn something new even if you don't have prior knowledge of finance.",
  },
  {
    question: "I have a full-time job, not sure if I can make it. Will you be sharing recordings?",
    answer:
      "I've designed this class specifically keeping \"YOU\" the busy man's life in perspective. *Please note, that masterclass starts after working hours and there will be no recording of the live session.",
  },
  {
    question: "Will I get lifetime access to the videos?",
    answer:
      "Remember, this is a workshop, not an online course. So, no, you don't get lifetime access to the videos.",
  }
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="section-default bg-primary">
      <div className="container-narrow">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <HelpCircle className="w-5 h-5 text-white" />
            <span className="text-white font-medium">FAQ</span>
          </div>
          <h2 className="heading-lg text-white mb-4">
            Have Questions? We Have Answers.
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto">
            I've tried my best to answer all questions. For further queries, please email me at{" "}
            <span className="font-bold text-white inline-flex items-center gap-1">
              <Mail className="w-4 h-4" /> connect@ganeshkomma.com
            </span>{" "}
            My amazing support team will reply within 6 hours.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full bg-white/10 backdrop-blur-sm rounded-xl p-5 text-left hover:bg-white/15 transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
                  <ChevronDown 
                    className={`w-5 h-5 text-white/70 transition-transform flex-shrink-0 ${
                      openIndex === index ? "rotate-180" : ""
                    }`} 
                  />
                </div>
                {openIndex === index && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-white/80 mt-4 leading-relaxed"
                  >
                    {faq.answer}
                  </motion.p>
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;