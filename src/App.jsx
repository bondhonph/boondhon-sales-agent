import { useState, useEffect, useRef } from "react";

const BRAND = {
  sky: "#29ABE2",
  navy: "#0a1628",
  gold: "#C9A84C",
  chatBg: "#eef2f7",
};

const SYSTEM_PROMPT = `You are the official AI Sales Agent of BOONDHON Printing House, based in Manikganj, Bangladesh. Your name is "Brishti Apa" — a warm, friendly, real Bangladeshi sales executive.

Your main goal is to sell:
💚 Affordable Card
✨ Premium Card

SALES STRATEGY:
- Always start with Affordable & Premium collections only
- Do NOT mention Luxury unless customer specifically asks
- Keep responses short, natural, and human-like — like a real WhatsApp sales conversation
- Never write long paragraphs — use short lines, emojis, natural Bengali phrasing
- Focus on conversion and closing orders
- Talk in Bengali (Bangladeshi colloquial style) mixed with some English words naturally
- Never say "I am AI" — always act like a real person

PRICE GUIDE:
50 pcs → Affordable: ২,৭৫০৳ | Premium: ৩,২৫০৳ | Advance 30%
100 pcs → Affordable: ৪,৫০০৳ | Premium: ৫,৫০০৳ | FREE নিকাহনামা | Advance 30%
200 pcs → Affordable: ৭,০০০৳ | Premium: ৯,০০০৳ | FREE নিকাহনামা

WHEN CUSTOMER ASKS FOR AFFORDABLE CARDS:
- Say you're sending some beautiful designs
- Describe 3-4 different card designs vividly (floral border, soft pastel, traditional motif, modern minimal)
- Ask which type they like after showing designs
- Guide toward quantity discussion

WHEN CUSTOMER ASKS FOR PREMIUM CARDS:
- Express excitement, say premium collection is very exclusive
- Describe 3-4 elegant premium designs (foil finish, box style, royal gold, soft floral luxury)
- Ask their preference and move to closing

ORDER CLOSING — Collect:
১. নাম
২. কত পিস
৩. জেলা
৪. ফোন নম্বর
৫. বিয়ের তারিখ
Advance 30% via bKash/Nagad: 01682588856

IMPORTANT RULES:
- Very short messages — 2-5 lines max usually
- Use 😊 🎉 💚 ✨ 🌸 naturally but not excessively
- Create urgency naturally
- Be warm and sisterly/brotherly in tone`;

const FIRST_MESSAGE = {
  role: "assistant",
  content: `আসসালামু আলাইকুম! 😊
BOONDHON Printing House-এ স্বাগতম! 🌸

আমাদের সবচেয়ে জনপ্রিয় collection:

💚 Affordable Card — সুন্দর ডিজাইন, সাশ্রয়ী দামে
✨ Premium Card — এলিগ্যান্ট ও luxury feel

কোন collection টা দেখতে চান? 👇`,
};

function TypingIndicator() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 14px", background: "white", borderRadius: 18, borderBottomLeftRadius: 4, width: "fit-content", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: BRAND.sky, animation: "bounce 1.2s infinite", animationDelay: `${i * 0.2}s` }} />
      ))}
    </div>
  );
}

function MessageBubble({ msg, isNew }) {
  const isAgent = msg.role === "assistant";
  return (
    <div style={{ display: "flex", justifyContent: isAgent ? "flex-start" : "flex-end", marginBottom: 10, animation: isNew ? "slideIn 0.3s ease" : "none" }}>
      {isAgent && (
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg, ${BRAND.sky}, ${BRAND.navy})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, marginRight: 8, flexShrink: 0, alignSelf: "flex-end" }}>🌸</div>
      )}
      <div style={{ maxWidth: "72%", padding: "10px 14px", borderRadius: 18, borderBottomLeftRadius: isAgent ? 4 : 18, borderBottomRightRadius: isAgent ? 18 : 4, background: isAgent ? "white" : `linear-gradient(135deg, ${BRAND.sky}, #1a8fc0)`, color: isAgent ? BRAND.navy : "white", fontSize: 14.5, lineHeight: 1.6, boxShadow: isAgent ? "0 1px 4px rgba(0,0,0,0.08)" : "0 2px 8px rgba(41,171,226,0.35)", whiteSpace: "pre-wrap", fontFamily: "'Hind Siliguri', sans-serif" }}>
        {msg.content}
      </div>
    </div>
  );
}

function QuickReply({ label, onClick }) {
  return (
    <button onClick={() => onClick(label)} style={{ padding: "8px 16px", borderRadius: 20, border: `1.5px solid ${BRAND.sky}`, background: "white", color: BRAND.sky, fontSize: 13, cursor: "pointer", fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 600, transition: "all 0.2s", whiteSpace: "nowrap" }}
      onMouseEnter={e => { e.target.style.background = BRAND.sky; e.target.style.color = "white"; }}
      onMouseLeave={e => { e.target.style.background = "white"; e.target.style.color = BRAND.sky; }}>
      {label}
    </button>
  );
}

export default function BoondhonSalesAgent() {
  const [messages, setMessages] = useState([FIRST_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [newMsgIndex, setNewMsgIndex] = useState(-1);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const quickReplies = messages.length <= 2 ? ["💚 Affordable Card", "✨ Premium Card"] : [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "s
