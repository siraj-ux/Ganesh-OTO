import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  BadgeIndianRupee,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PABBLY_OTO_WEBHOOK_URL =
  "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjcwNTZjMDYzNzA0MzE1MjY4NTUzNTUxMzUi_pc";

const PAYMENT_LINK_99 =
  "https://pages.razorpay.com/pl_Ry77FbJBRdJVDu/view";

const THANKYOU_URL = "/ty";
const PAGE_NAME = "A1_Eng_ADX_OTO_GA";

/* ---------------- helpers ---------------- */

function getUtmsFromUrl() {
  const p = new URLSearchParams(window.location.search);
  const keys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "fbclid",
    "gclid",
  ];
  const utms: Record<string, string> = {};
  keys.forEach((k) => (utms[k] = p.get(k) || ""));
  return utms;
}

function getLeadFromUrlOrStorage() {
  const p = new URLSearchParams(window.location.search);

  const leadFromUrl = {
    name: p.get("name") || p.get("first_name") || "",
    email: p.get("email") || "",
    phone: p.get("phone") || p.get("whatsapp_number") || "",
    city: p.get("city") || "",
    profession: p.get("profession") || "",
    objective: p.get("objective") || "",
  };

  try {
    const stored = localStorage.getItem("lead_data");
    if (stored) {
      const j = JSON.parse(stored);
      return {
        name: leadFromUrl.name || j?.name || "",
        email: leadFromUrl.email || j?.email || "",
        phone: leadFromUrl.phone || j?.phone || "",
        city: leadFromUrl.city || j?.city || "",
        profession: leadFromUrl.profession || j?.profession || "",
        objective: leadFromUrl.objective || j?.objective || "",
      };
    }
  } catch {}

  return leadFromUrl;
}

function sendToPabblyBestEffort(payload: Record<string, any>) {
  try {
    const body = new URLSearchParams();
    Object.entries(payload).forEach(([k, v]) =>
      body.append(k, v == null ? "" : String(v))
    );

    try {
      const blob = new Blob([body.toString()], {
        type: "application/x-www-form-urlencoded;charset=UTF-8",
      });
      if (navigator.sendBeacon?.(PABBLY_OTO_WEBHOOK_URL, blob)) return;
    } catch {}

    fetch(PABBLY_OTO_WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {}
}

/* ---------------- PAGE ---------------- */

const OtoPage = () => {
  const [lead, setLead] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    profession: "",
    objective: "",
  });

  // ✅ NOTHING selected initially
  const [choice, setChoice] = useState<"yes" | "no" | "">("");
  const [submittedOnce, setSubmittedOnce] = useState(false);

  const utms = useMemo(() => getUtmsFromUrl(), []);

  useEffect(() => {
    setLead(getLeadFromUrlOrStorage());
  }, []);

  const leadErrors = useMemo(() => {
    const name = lead.name.trim().length < 2;
    const email = !EMAIL_RE.test(lead.email.trim());
    const phone =
      lead.phone.replace(/\D/g, "").length < 10 ||
      lead.phone.replace(/\D/g, "").length > 13;
    const city = lead.city.trim().length < 2;
    return { name, email, phone, city };
  }, [lead]);

  const leadIsValid =
    !leadErrors.name &&
    !leadErrors.email &&
    !leadErrors.phone &&
    !leadErrors.city;

  const choiceIsValid = choice === "yes" || choice === "no";
  const canContinue = leadIsValid && choiceIsValid;

  async function handleContinue() {
    setSubmittedOnce(true);
    if (!canContinue) return;

    localStorage.setItem("lead_data", JSON.stringify(lead));
    localStorage.setItem("lead_utms", JSON.stringify(utms));

    const params = new URLSearchParams({
      first_name: lead.name,
      email: lead.email,
      whatsapp_number: lead.phone,
      city: lead.city,
      profession: lead.profession,
      objective: lead.objective,
      page_name: PAGE_NAME,
      oto: choice,
      oto_product: "AI Stock & IPO Prompt Codex",
      oto_price: "99",
      ...utms,
    }).toString();

    if (choice === "yes") {
      sendToPabblyBestEffort({
        ...lead,
        ...utms,
        page_name: PAGE_NAME,
        weburl: window.location.href,
        oto: "yes",
        oto_product: "AI Stock & IPO Prompt Codex",
        oto_price: "99",
      });

      await new Promise((r) => setTimeout(r, 120));
      window.location.href = `${PAYMENT_LINK_99}?${params}`;
      return;
    }

    window.location.href = `${THANKYOU_URL}?${params}`;
  }

  const buttonText = choice === "no" ? "Confirm To Join Whatsapp Group" : "Confirm & Continue";

  return (
     <section className="relative overflow-hidden bg-[#FFF3E1]">
      {/* soft blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#2E4C8C]/10 blur-3xl" />
      <div className="pointer-events-none absolute top-24 right-0 h-72 w-72 rounded-full bg-[#FA2D1A]/10 blur-3xl" />

      <div className="container-main relative z-10 py-10 md:py-12">
        <div className="lg:grid lg:grid-cols-[1.2fr_.8fr] lg:gap-8 lg:items-start">
          {/* ===================== HEADER ===================== */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="lg:col-start-1 lg:row-start-1 space-y-5"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[#2E4C8C]/15 bg-white/70 px-3 py-1 text-xs font-semibold text-[#2E4C8C]">
              <Sparkles className="w-4 h-4" />
              One Time Offer (Shown Only Once)
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-[#2E4C8C] leading-tight">
              AI Stock & IPO Prompt Codex –{" "}
              <span className="text-[#FA2D1A]">One-Time ₹99 Offer</span>
            </h1>

            <p className="text-[#1A1F2B]">
              A ready-to-use AI toolkit that helps you analyze{" "}
              <span className="font-semibold">any stock or IPO in minutes</span>{" "}
              — without spreadsheets, complex ratios, or guesswork.
            </p>

            <p className="text-[#1A1F2B] font-semibold">
              Use it with ChatGPT or any AI tool — no coding needed!
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-[#2E4C8C]/15 px-4 py-2">
                <BadgeIndianRupee className="w-4 h-4 text-[#2E4C8C]" />
                <span className="text-sm text-[#3B3F4A] line-through">₹1,499</span>
                <span className="text-sm font-extrabold text-[#FA2D1A]">Today Only ₹99</span>
                <span className="text-xs text-[#3B3F4A]">(94% OFF)</span>
              </div>

              <div className="text-xs text-[#3B3F4A]">
                ⚠️ Note: This VVIP offer may expire when you leave the page.
              </div>
            </div>
          </motion.div>

          {/* ===================== CHOICE BOX (REPLACES FORM) ===================== */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="mt-6 lg:mt-0 lg:col-start-2 lg:row-start-1 lg:row-span-2 rounded-2xl border border-[#2E4C8C]/15 bg-white/70 shadow-xl overflow-hidden"
          >
            <div className="p-5">
              <div className="text-center mb-4">
                <p className="text-xs font-semibold text-[#2E4C8C]">One last step</p>
                <h3 className="text-lg font-extrabold text-[#2E4C8C] mt-1">
                  Choose Yes / No
                </h3>
                <p className="text-xs text-[#3B3F4A] mt-1">
                  If you select <b>Yes</b>, you’ll go to payment (₹99). If <b>No</b>, you’ll skip.
                </p>
              </div>

              {/* YES */}
              <label className="flex items-start gap-3 rounded-xl border border-[#2E4C8C] bg-white/70 p-3 cursor-pointer">
                <input
                  type="radio"
                  name="oto_choice"
                  checked={choice === "yes"}
                  onChange={() => setChoice("yes")}
                  className="mt-1"
                />
                <span className="text-sm text-[#1A1F2B]">
                  <span className="font-bold">
                    Yes, add the AI Stock & IPO Prompt Codex for ₹99 (One Time Offer)
                  </span>
                  {choice === "yes" ? (
                    <div className="mt-1 text-[11px] text-[#3B3F4A]">
                      You’ll be redirected to Razorpay to complete the ₹99 payment.
                    </div>
                  ) : null}
                </span>
              </label>

              {/* NO */}
              <label className="mt-3 flex items-start gap-3 rounded-xl border border-[#2E4C8C]/15 bg-white/70 p-3 cursor-pointer">
                <input
                  type="radio"
                  name="oto_choice"
                  checked={choice === "no"}
                  onChange={() => setChoice("no")}
                  className="mt-1"
                />
                <span className="text-sm text-[#1A1F2B]">
                  <span className="font-bold">No, thanks. I’ll skip this offer.</span>
                  {choice === "no" ? (
                    <div className="mt-1 text-[11px] text-[#3B3F4A]">
                      ➜ You’ll continue without this add-on.
                    </div>
                  ) : null}
                </span>
              </label>

              {/* Validation messages */}
              {!leadIsValid && submittedOnce ? (
                <div className="mt-3 rounded-xl border border-[#FA2D1A]/25 bg-[#FA2D1A]/10 p-3 text-[11px] text-[#1A1F2B]">
                  <div className="font-extrabold text-[#FA2D1A] mb-1">
                    We couldn’t verify your details.
                  </div>
                  <div className="text-[#3B3F4A]">
                    Please go back and submit the main form again (name, email, phone, city are required).
                  </div>
                </div>
              ) : null}

              {!choiceIsValid && submittedOnce ? (
                <p className="mt-3 text-[11px] text-[#FA2D1A]">
                  Please select Yes or No to continue.
                </p>
              ) : null}

              <button
                type="button"
                onClick={handleContinue}
                disabled={!canContinue}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 font-semibold text-white shadow-md hover:shadow-lg transition active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#FA2D1A" }}
              >
                {buttonText}
                <ArrowRight className="w-5 h-5" />
              </button>

              <p className="text-[11px] text-center text-[#3B3F4A] mt-3">
                This is a one-time offer. If you skip now, it may not show again.
              </p>
            </div>
          </motion.div>

          {/* ===================== BENEFITS ===================== */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="mt-6 lg:mt-0 lg:col-start-1 lg:row-start-2"
          >
            <div className="rounded-2xl border border-[#2E4C8C]/12 bg-white/70 p-5 space-y-5">
              <div>
                <h2 className="text-xl md:text-2xl font-extrabold text-[#2E4C8C]">
                  What You&apos;ll Get Inside
                </h2>
                <p className="text-sm text-[#3B3F4A] mt-1">
                  Your AI Stock & IPO Prompt Codex — Benefits at a Glance
                </p>
              </div>

              <div className="rounded-2xl border border-[#2E4C8C]/12 bg-white/80 p-4">
                <h3 className="font-extrabold text-[#1A1F2B] flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#FA2D1A]" />
                  1) Equity Analysis Prompts
                </h3>
                <p className="text-sm text-[#3B3F4A] mt-1">
                  Business model • Financial statements • Cash flow health • Valuation clarity
                </p>
              </div>

              <div className="rounded-2xl border border-[#2E4C8C]/12 bg-white/80 p-4">
                <h3 className="font-extrabold text-[#1A1F2B] flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#FA2D1A]" />
                  2) IPO Deep Dive Prompts
                </h3>
                <p className="text-sm text-[#3B3F4A] mt-1">
                  DRHP reading • Revenue breakdown • Red flags • Fair valuation • Listing expectation
                </p>
              </div>

              <div className="rounded-2xl border border-[#2E4C8C]/12 bg-white/80 p-4">
                <h3 className="font-extrabold text-[#1A1F2B] flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#FA2D1A]" />
                  3) Technical & Sentiment Prompts
                </h3>
                <p className="text-sm text-[#3B3F4A] mt-1">
                  Trend direction • Volume confirmation • Candlesticks • Market mood • Entry/exit clarity
                </p>
              </div>

              <div className="rounded-2xl border border-[#FA2D1A]/20 bg-[#FA2D1A]/10 p-4">
                <p className="font-extrabold text-[#1A1F2B]">🎁 BONUS PACK (Worth ₹1,499)</p>
                <p className="text-sm text-[#3B3F4A] mt-1">
                  Templates + AI report script + market research guide
                </p>
              </div>

              <div className="text-xs text-[#3B3F4A]">
                🔥 This is a <span className="font-bold text-[#FA2D1A]">one-time offer</span>. If you skip it now, it may not show again.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default OtoPage;
