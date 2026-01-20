import { motion } from "framer-motion";
import { Award, Users, BookOpen, Star } from "lucide-react";

const achievements = [
  { icon: Users, label: "1.2 Lakh+ Students" },
  { icon: Award, label: "Amazon Bestselling Author" },
  { icon: BookOpen, label: "15+ Years Experience" },
];

const MentorSection = () => {
  return (
    <section className="bg-white overflow-hidden">
      <div className="container-main py-10 md:py-12">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="text-center mb-10 md:mb-12"
        >
          <span className="badge-primary mb-3 inline-block">Your Guide</span>
          <h2 className="heading-lg">Meet your Mentor</h2>
        </motion.div>

        {/* Content */}
        <div className="flex flex-col items-center gap-10 max-w-4xl mx-auto">
          {/* Image + Floating Badges */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            {/* Floating badges */}
            {achievements.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`absolute z-20 flex items-center gap-2 rounded-xl bg-white/80 backdrop-blur-sm
                  border border-[#2E4C8C]/15 px-3 py-2 shadow-sm text-xs font-medium text-[#1A1F2B]
                  ${
                    index === 0
                      ? "-top-4 left-1/2 -translate-x-1/2"
                      : index === 1
                      ? "bottom-1 -left-6"
                      : "top-1/2 -right-6"
                  }`}
                style={{
                  animation: "floaty 4.5s ease-in-out infinite",
                  animationDelay: `${index * 0.4}s`,
                }}
              >
                <div className="w-8 h-8 rounded-lg bg-[#2E4C8C]/10 flex items-center justify-center">
                  <item.icon className="w-4 h-4 text-[#2E4C8C]" />
                </div>
                <span>{item.label}</span>
              </motion.div>
            ))}

            {/* Image */}
            <div className="relative w-72 h-72 md:w-80 md:h-80">
              <div className="absolute inset-0 rounded-full bg-[#2E4C8C]/15" />
              <div className="absolute inset-4 rounded-full bg-[#2E4C8C]/20" />
              <div className="absolute inset-8 rounded-full bg-white shadow-2xl overflow-hidden">
                <img
                  src="/coach.png"
                  alt="Ganesh Komma"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="text-center space-y-5"
          >
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-[#1A1F2B]">
                GANESH <span className="text-[#2E4C8C]">KOMMA</span>
              </h3>
              <p className="text-base md:text-lg font-semibold text-[#3B3F4A]">
                Finance & Stock Investment Coach | Amazon Bestselling Author
              </p>

              <div className="flex justify-center gap-0.5 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-[#2E4C8C] fill-[#2E4C8C]"
                  />
                ))}
              </div>
            </div>

            <p className="text-[#1A1F2B] leading-relaxed">
              With over{" "}
              <span className="font-semibold text-[#2E4C8C]">15+ years</span> in
              finance and investment banking, I’ve helped{" "}
              <span className="font-semibold text-[#2E4C8C]">
                more than 1.2 lakh professionals
              </span>{" "}
              simplify stock investing, plan their retirement, and grow
              long-term wealth — confidently and strategically.
            </p>

            <p className="text-[#1A1F2B] leading-relaxed">
              I’m the author of{" "}
              <span className="font-semibold text-[#2E4C8C]">
                two Amazon #1 bestselling books
              </span>{" "}
              on financial planning and wealth creation, and now I’m on a
              mission to help{" "}
              <span className="font-semibold text-[#2E4C8C]">
                10,00,000 working professionals
              </span>{" "}
              become financially free — using smart investing frameworks and
              practical strategies.
            </p>

            <p className="text-[#1A1F2B] leading-relaxed">
              If you believe wealth is built with smart decisions (not luck),
              this is for you.
            </p>

            <p className="text-[#1A1F2B] leading-relaxed">
              Let’s start your journey towards financial freedom — together.
            </p>

            <div className="rounded-2xl p-5 border border-[#2E4C8C]/15 bg-[#2E4C8C]/5">
              <p className="text-lg md:text-xl font-bold italic text-[#2E4C8C]">
                “Learn, Grow & Become Financially Free!”
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes floaty {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </section>
  );
};

export default MentorSection;
