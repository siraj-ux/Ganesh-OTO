import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  BadgeIndianRupee,
  CheckCircle2,
  ArrowRight,
  User,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ✅ Pabbly webhook (send only if checkbox ticked)
const PABBLY_OTO_WEBHOOK_URL =
  "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjcwNTZjMDYzNzA0M2M1MjZjNTUzNjUxMzAi_pc";

// ✅ Razorpay payment link (₹99)
const PAYMENT_LINK_99 = "https://pages.razorpay.com/pl_Ry77FbJBRdJVDu/view";

// ✅ Thank you page route
const THANKYOU_URL = "/ty";

// ✅ Page name (required)
const PAGE_NAME = "A1_Eng_ADX_OTO_GA";

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

/**
 * ✅ BEST RELIABLE FRONTEND SENDER (no preflight + survives redirect)
 * 1) Try sendBeacon (best for redirects, no CORS read)
 * 2) Fallback to fetch with no-cors + x-www-form-urlencoded (no preflight)
 *
 * NOTE: You still may see a console warning sometimes. That’s normal for no-cors.
 */
function sendToPabblyBestEffort(payload: Record<string, any>) {
  try {
    // Always send as form-url-encoded to avoid preflight.
    const body = new URLSearchParams();
    Object.entries(payload).forEach(([k, v]) =>
      body.append(k, v == null ? "" : String(v))
    );

    // 1) sendBeacon first (most reliable before redirect)
    try {
      const blob = new Blob([body.toString()], {
        type: "application/x-www-form-urlencoded;charset=UTF-8",
      });
      const ok = navigator.sendBeacon?.(PABBLY_OTO_WEBHOOK_URL, blob);
      if (ok) return;
    } catch {
      // ignore
    }

    // 2) fallback fetch no-cors (fire-and-forget)
    fetch(PABBLY_OTO_WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // ignore
  }
}

const OtoPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    profession: "",
    objective: "",
  });

  const [otoChecked, setOtoChecked] = useState(true);

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
    city: false,
  });

  const utms = useMemo(() => getUtmsFromUrl(), []);

  useEffect(() => {
    const lead = getLeadFromUrlOrStorage();
    setForm(lead);
  }, []);

  const errors = useMemo(() => {
    const name = form.name.trim().length < 2 ? "Please enter your full name." : "";
    const email = !EMAIL_RE.test(form.email.trim()) ? "Please enter a valid email." : "";
    const phoneDigits = form.phone.replace(/\D/g, "");
    const phone =
      phoneDigits.length < 10 || phoneDigits.length > 13
        ? "Please enter a valid phone number (10–13 digits)."
        : "";
    const city = form.city.trim().length < 2 ? "Please enter your city." : "";
    return { name, email, phone, city };
  }, [form]);

  const isValid = useMemo(
    () => !errors.name && !errors.email && !errors.phone && !errors.city,
    [errors]
  );

  const showError = (k: keyof typeof errors) => touched[k] && !!errors[k];

  const setField = (k: keyof typeof form, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ name: true, email: true, phone: true, city: true });
    if (!isValid) return;

    // ✅ store backup
    try {
      localStorage.setItem("lead_data", JSON.stringify(form));
      localStorage.setItem("lead_utms", JSON.stringify(utms));
    } catch {}

    const weburl = window.location.href;

    // ✅ build query params to pass to Razorpay / TY
    const params = new URLSearchParams({
      first_name: form.name,
      email: form.email,
      whatsapp_number: form.phone,
      city: form.city,
      profession: form.profession,
      objective: form.objective,
      page_name: PAGE_NAME,
      weburl,
      ...utms,
      oto: otoChecked ? "yes" : "no",
      oto_product: "AI Stock & IPO Prompt Codex",
      oto_price: "99",
    }).toString();

    // ✅ send to Pabbly ONLY if checkbox ticked
    if (otoChecked) {
      const payload = {
        first_name: form.name,
        email: form.email,
        whatsapp_number: form.phone,
        city: form.city,
        profession: form.profession,
        objective: form.objective,

        // tracking
        ...utms,

        // required extras
        page_name: PAGE_NAME,
        weburl,

        // offer fields
        oto: "yes",
        oto_product: "AI Stock & IPO Prompt Codex",
        oto_price: "99",
      };

      // ✅ best-effort (beacon -> fetch no-cors)
      sendToPabblyBestEffort(payload);

      // ✅ small delay helps some browsers flush request before redirect (non-blocking UX)
      // Keep it tiny to avoid user feel.
      await new Promise((r) => setTimeout(r, 120));
    }

    // ✅ redirect
    if (otoChecked) {
      window.location.href = `${PAYMENT_LINK_99}?${params}`;
      return;
    }

    window.location.href = `${THANKYOU_URL}?${params}`;
  }

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

          {/* ===================== FORM ===================== */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="mt-6 lg:mt-0 lg:col-start-2 lg:row-start-1 lg:row-span-2 rounded-2xl border border-[#2E4C8C]/15 bg-white/70 shadow-xl overflow-hidden"
          >
            <div className="p-5">
              <div className="text-center mb-4">
                <p className="text-xs font-semibold text-[#2E4C8C]">Confirm Your Details</p>
                <h3 className="text-lg font-extrabold text-[#2E4C8C] mt-1">Grab the ₹99 Offer</h3>
                <p className="text-xs text-[#3B3F4A] mt-1">Tick the checkbox & continue.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#2E4C8C]">Full Name</label>
                  <div
                    className={`flex items-center gap-2 rounded-xl border bg-white/80 px-3 py-2.5 ${
                      showError("name") ? "border-[#FA2D1A]/60" : "border-[#2E4C8C]/15"
                    }`}
                  >
                    <User className="w-4 h-4 text-[#2E4C8C]" />
                    <input
                      value={form.name}
                      onChange={(e) => setField("name", e.target.value)}
                      onBlur={() => setTouched((p) => ({ ...p, name: true }))}
                      className="w-full bg-transparent outline-none text-sm text-[#1A1F2B]"
                      placeholder="Enter your name"
                      autoComplete="name"
                    />
                  </div>
                  {showError("name") ? <p className="text-[11px] text-[#FA2D1A]">{errors.name}</p> : null}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#2E4C8C]">Email</label>
                  <div
                    className={`flex items-center gap-2 rounded-xl border bg-white/80 px-3 py-2.5 ${
                      showError("email") ? "border-[#FA2D1A]/60" : "border-[#2E4C8C]/15"
                    }`}
                  >
                    <Mail className="w-4 h-4 text-[#2E4C8C]" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setField("email", e.target.value)}
                      onBlur={() => setTouched((p) => ({ ...p, email: true }))}
                      className="w-full bg-transparent outline-none text-sm text-[#1A1F2B]"
                      placeholder="Enter your email"
                      autoComplete="email"
                    />
                  </div>
                  {showError("email") ? <p className="text-[11px] text-[#FA2D1A]">{errors.email}</p> : null}
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#2E4C8C]">WhatsApp Number</label>
                  <div
                    className={`flex items-center gap-2 rounded-xl border bg-white/80 px-3 py-2.5 ${
                      showError("phone") ? "border-[#FA2D1A]/60" : "border-[#2E4C8C]/15"
                    }`}
                  >
                    <Phone className="w-4 h-4 text-[#2E4C8C]" />
                    <input
                      inputMode="tel"
                      value={form.phone}
                      onChange={(e) => setField("phone", e.target.value.replace(/[^\d+\-\s()]/g, ""))}
                      onBlur={() => setTouched((p) => ({ ...p, phone: true }))}
                      className="w-full bg-transparent outline-none text-sm text-[#1A1F2B]"
                      placeholder="Enter WhatsApp number"
                      autoComplete="tel"
                    />
                  </div>
                  {showError("phone") ? <p className="text-[11px] text-[#FA2D1A]">{errors.phone}</p> : null}
                </div>

                {/* City */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#2E4C8C]">City</label>
                  <div
                    className={`flex items-center gap-2 rounded-xl border bg-white/80 px-3 py-2.5 ${
                      showError("city") ? "border-[#FA2D1A]/60" : "border-[#2E4C8C]/15"
                    }`}
                  >
                    <MapPin className="w-4 h-4 text-[#2E4C8C]" />
                    <input
                      value={form.city}
                      onChange={(e) => setField("city", e.target.value)}
                      onBlur={() => setTouched((p) => ({ ...p, city: true }))}
                      className="w-full bg-transparent outline-none text-sm text-[#1A1F2B]"
                      placeholder="Enter your city"
                      autoComplete="address-level2"
                    />
                  </div>
                  {showError("city") ? <p className="text-[11px] text-[#FA2D1A]">{errors.city}</p> : null}
                </div>

                {/* Checkbox */}
                <label className="flex items-start gap-3 rounded-xl border border-[#2E4C8C]/15 bg-white/70 p-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={otoChecked}
                    onChange={(e) => setOtoChecked(e.target.checked)}
                    className="mt-1"
                  />
                  <span className="text-sm text-[#1A1F2B]">
                    <span className="font-bold">
                      Yes, I Want to add the AI Stock & IPO Prompt Codex for ₹99 (One Time Offer)
                    </span>
                  </span>
                </label>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 font-semibold text-white shadow-md hover:shadow-lg transition active:scale-[0.99]"
                  style={{ backgroundColor: "#FA2D1A" }}
                >
                  Confirm & Continue
                  <ArrowRight className="w-5 h-5" />
                </button>

                <p className="text-[11px] text-center text-[#3B3F4A]">
                  You’ll continue after confirming the offer.
                </p>
              </form>
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
