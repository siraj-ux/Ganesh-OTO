import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const learningPoints = [
  {
    title: "Identify High-Potential Stocks:",
    description:
      "No more guessing. You'll know how to pick stocks that are most likely to grow.wn boss and finally take control of your financial future.",
  },
  {
    title: "Achieve Consistency:",
    description:
      "Build a reliable strategy that helps you avoid over-trading and emotional decision-making.",
  },
  {
    title: "A Roadmap for Growth:",
    description:
      "You'll get a step-by-step guide tailored to your goals, helping you work toward steady long-term returns.",
  },
];

const LearnSection = () => {
  return (
    <section className="relative" style={{ backgroundColor: "#FFF3E1" }}>
      {/* subtle separator line */}
      <div className="absolute top-0 left-0 right-0 flex justify-center">
        <div className="mt-0 h-[2px] w-72 rounded-full bg-[#2E4C8C]/30" />
      </div>

      <div className="container-main py-10 md:py-12 lg:py-14">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-6 text-center"
        >
          <span
            className="inline-flex items-center rounded-full border border-[#2E4C8C]/15 bg-white/70 px-3 py-1 text-xs font-semibold mb-3"
            style={{ color: "#2E4C8C" }}
          >
            What You'll Learn
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold" style={{ color: "#2E4C8C" }}>
            Here's what you'll learn in our Webinar
          </h2>
        </motion.div>

        {/* Learning Points */}
        <div className="max-w-3xl mx-auto space-y-4 mb-6">
          {learningPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="flex items-start gap-3 p-4 rounded-2xl border border-[#2E4C8C]/12 bg-white/50 hover:bg-white/70 transition-colors"
            >
              <CheckCircle2 className="w-5 h-5 text-[#FA2D1A] flex-shrink-0 mt-0.5" />
              <p className="text-sm md:text-base leading-relaxed" style={{ color: "#1A1F2B" }}>
                <span className="font-bold" style={{ color: "#2E4C8C" }}>
                  {point.title}
                </span>{" "}
                {point.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Closing Statement (no emoji) */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="max-w-3xl mx-auto p-4 md:p-5 rounded-2xl border border-[#2E4C8C]/12 bg-white/60"
        >
          <p className="text-base md:text-lg font-bold" style={{ color: "#1A1F2B" }}>
            You don't need to be an expert to see results. You just need the right plan.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default LearnSection;
