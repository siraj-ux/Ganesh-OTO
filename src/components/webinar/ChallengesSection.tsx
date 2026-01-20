import { motion } from "framer-motion";
import { TrendingDown, HelpCircle, Target, ArrowRight } from "lucide-react";

const FORM_ID = "webinar-lead-form";

const challenges = [
  {
    icon: TrendingDown,
    text: "There's too much information, and you're not sure where to start.",
    color: "bg-red-100 text-red-600",
  },
  {
    icon: HelpCircle,
    text: "You're tired of seeing inconsistent returns.",
    color: "bg-orange-100 text-orange-600",
  },
  {
    icon: Target,
    text: "You want to invest confidently but don't know how to make the right decisions.",
    color: "bg-blue-100 text-blue-600",
  },
];

function scrollToForm() {
  const el = document.getElementById(FORM_ID);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

const ChallengesSection = () => {
  return (
    <section className="relative bg-[#FFFFF]">
      <div className="container-main py-8 md:py-10 lg:py-12">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="text-center mb-8 md:mb-10"
        >
          <span className="badge-accent mb-3 inline-block">
            Common Struggles
          </span>
          <h2 className="heading-lg mb-2">
            Want to overcome these challenges
          </h2>
          <p className="text-body max-w-xl mx-auto">
            Do you feel lost when it comes to investing?
          </p>
        </motion.div>

        {/* Challenge Cards */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-5 lg:gap-6 mb-8">
          {challenges.map((challenge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="feature-card text-center py-5 px-4"
            >
              <div className={`icon-box ${challenge.color} mx-auto mb-4`}>
                <challenge.icon className="w-5 h-5" strokeWidth={2} />
              </div>
              <p className="text-foreground font-medium text-base leading-relaxed">
                {challenge.text}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom Text + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="text-center"
        >
          <p className="text-body max-w-xl mx-auto mb-5">
            These are common hurdles, but with our Webinar, you'll have a clear path forward.
          </p>

          {/* ✅ CTA → FORM */}
          <button
            onClick={scrollToForm}
            className="btn-accent group"
          >
            Register Now & Get Access
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="mt-3 text-xs text-muted-foreground">
            Receive bonuses by joining the WhatsApp group.{" "}
            <span className="font-bold text-accent">Only 4 Seats Left!</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ChallengesSection;
