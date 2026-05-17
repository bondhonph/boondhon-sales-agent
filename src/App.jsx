import React, { useState, useEffect, useRef } from "react";

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
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text) {
    if (!text.trim() || loading) return;
    const userMsg = { role: "user", content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const history = updated.map(m => ({ role: m.role, content: m.content }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ system: SYSTEM_PROMPT, messages: history }),
      });
      const data = await res.json();
      const reply = data.content?.find(b => b.type === "text")?.text || "দুঃখিত, একটু পরে আবার চেষ্টা করুন 😊";
      const newMessages = [...updated, { role: "assistant", content: reply }];
      setNewMsgIndex(newMessages.length - 1);
      setMessages(newMessages);
    } catch {
      setMessages([...updated, { role: "assistant", content: "দুঃখিত, সমস্যা হচ্ছে। একটু পরে try করুন 😊" }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  }

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(160deg, ${BRAND.navy} 0%, #0d2040 100%)`, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, fontFamily: "'Hind Siliguri', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&display=swap');
        @keyframes bounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        textarea { resize: none; border: none; background: transparent; outline: none; }
      `}</style>
      <div style={{ width: "100%", maxWidth: 440, borderRadius: 24, overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.5)", display: "flex", flexDirection: "column", height: "88vh", maxHeight: 720 }}>
        <div style={{ background: `linear-gradient(135deg, ${BRAND.navy} 0%, #0d2a50 100%)`, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, borderBottom: `1px solid rgba(41,171,226,0.2)` }}>
          <div style={{ width: 46, height: 46, borderRadius: "50%", background: `linear-gradient(135deg, ${BRAND.sky} 0%, #1a8fc0 100%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>🌸</div>
          <div style={{ flex: 1 }}>
            <div style={{ color: "white", fontWeight: 700, fontSize: 15.5 }}>BOONDHON Printing House</div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80" }} />
              <span style={{ color: "#a0b4cc", fontSize: 12 }}>Online এখন • সাথে আছি 😊</span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: BRAND.gold, fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>Est. 2019</div>
            <div style={{ color: "#4a6a8a", fontSize: 10.5 }}>Manikganj, BD</div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", background: BRAND.chatBg, padding: "16px 14px 8px" }}>
          {messages.map((msg, i) => <MessageBubble key={i} msg={msg} isNew={i === newMsgIndex} />)}
          {loading && <div style={{ marginLeft: 42, marginBottom: 10 }}><TypingIndicator /></div>}
          <div ref={bottomRef} />
        </div>

        {quickReplies.length > 0 && (
          <div style={{ background: BRAND.chatBg, padding: "6px 14px 10px", display: "flex", gap: 8, flexWrap: "wrap", borderTop: "1px solid rgba(0,0,0,0.04)" }}>
            {quickReplies.map(r => <QuickReply key={r} label={r} onClick={sendMessage} />)}
          </div>
        )}

        <div style={{ background: "white", padding: "12px 14px", borderTop: "1px solid #e8edf3", display: "flex", alignItems: "flex-end", gap: 10 }}>
          <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey} placeholder="মেসেজ লিখুন..." rows={1} style={{ flex: 1, fontSize: 14.5, color: BRAND.navy, fontFamily: "'Hind Siliguri', sans-serif", lineHeight: 1.5, maxHeight: 80, overflowY: "auto", padding: "6px 2px" }} />
          <button onClick={() => sendMessage(input)} disabled={loading || !input.trim()} style={{ width: 40, height: 40, borderRadius: "50%", border: "none", background: input.trim() && !loading ? `linear-gradient(135deg, ${BRAND.sky}, #1a8fc0)` : "#dde4ed", color: "white", fontSize: 16, cursor: input.trim() && !loading ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>➤</button>
        </div>

        <div style={{ background: "white", textAlign: "center", padding: "6px", borderTop: "1px solid #f0f3f8" }}>
          <span style={{ fontSize: 10.5, color: "#a0afc0" }}>📞 01682588856 · bKash/Nagad available</span>
        </div>
      </div>
    </div>
  );
}
