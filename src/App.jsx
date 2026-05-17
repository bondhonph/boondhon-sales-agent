import React, { useState, useEffect, useRef } from "react";

const BRAND = { sky: "#29ABE2", navy: "#0a1628", gold: "#C9A84C", chatBg: "#eef2f7" };

const SYSTEM_PROMPT = `You are the official AI Sales Agent of BOONDHON Printing House, based in Manikganj, Bangladesh. Your name is "Brishti Apa" — a warm, friendly, real Bangladeshi sales executive. Talk in Bengali colloquial style. Keep replies short 2-5 lines. Use emojis naturally.

Sell: Affordable Card & Premium Card.
Price: 50pcs Affordable=2750tk Premium=3250tk | 100pcs Affordable=4500tk Premium=5500tk FREE নিকাহনামা | 200pcs Affordable=7000tk Premium=9000tk FREE নিকাহনামা. Advance 30% bKash/Nagad: 01682588856.
Order info needed: নাম, পিস, জেলা, ফোন, বিয়ের তারিখ.
Never say you are AI.`;

const FIRST_MSG = { role: "assistant", content: `আসসালামু আলাইকুম! 😊\nBOONDHON Printing House-এ স্বাগতম! 🌸\n\nআমাদের সবচেয়ে জনপ্রিয় collection:\n\n💚 Affordable Card — সুন্দর ডিজাইন, সাশ্রয়ী দামে\n✨ Premium Card — এলিগ্যান্ট ও luxury feel\n\nকোন collection টা দেখতে চান? 👇` };

export default function App() {
  const [messages, setMessages] = useState([FIRST_MSG]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  async function sendMessage(text) {
    if (!text.trim() || loading) return;
    const updated = [...messages, { role: "user", content: text }];
    setMessages(updated);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ system: SYSTEM_PROMPT, messages: updated }),
      });
      const data = await res.json();
      const reply = data?.choices?.[0]?.message?.content || data?.content?.[0]?.text || "দুঃখিত 😊";
      setMessages([...updated, { role: "assistant", content: reply }]);
    } catch {
      setMessages([...updated, { role: "assistant", content: "সমস্যা হচ্ছে 😊" }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(160deg, ${BRAND.navy}, #0d2040)`, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, fontFamily: "'Hind Siliguri', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&display=swap'); @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} } * { box-sizing:border-box; margin:0; padding:0; } textarea { resize:none; border:none; background:transparent; outline:none; }`}</style>
      <div style={{ width: "100%", maxWidth: 440, borderRadius: 24, overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.5)", display: "flex", flexDirection: "column", height: "88vh", maxHeight: 720 }}>
        
        <div style={{ background: `linear-gradient(135deg, ${BRAND.navy}, #0d2a50)`, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid rgba(41,171,226,0.2)" }}>
          <div style={{ width: 46, height: 46, borderRadius: "50%", background: `linear-gradient(135deg, ${BRAND.sky}, #1a8fc0)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>🌸</div>
          <div style={{ flex: 1 }}>
            <div style={{ color: "white", fontWeight: 700, fontSize: 15.5 }}>BOONDHON Printing House</div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80" }} />
              <span style={{ color: "#a0b4cc", fontSize: 12 }}>Online এখন • সাথে আছি 😊</span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: BRAND.gold, fontSize: 11, fontWeight: 700 }}>Est. 2019</div>
            <div style={{ color: "#4a6a8a", fontSize: 10.5 }}>Manikganj, BD</div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", background: BRAND.chatBg, padding: "16px 14px 8px" }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: "flex", justifyContent: msg.role === "assistant" ? "flex-start" : "flex-end", marginBottom: 10 }}>
              {msg.role === "assistant" && <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg, ${BRAND.sky}, ${BRAND.navy})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, marginRight: 8, flexShrink: 0, alignSelf: "flex-end" }}>🌸</div>}
              <div style={{ maxWidth: "72%", padding: "10px 14px", borderRadius: 18, borderBottomLeftRadius: msg.role === "assistant" ? 4 : 18, borderBottomRightRadius: msg.role === "assistant" ? 18 : 4, background: msg.role === "assistant" ? "white" : `linear-gradient(135deg, ${BRAND.sky}, #1a8fc0)`, color: msg.role === "assistant" ? BRAND.navy : "white", fontSize: 14.5, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", marginLeft: 42, marginBottom: 10 }}>
              <div style={{ background: "white", borderRadius: 18, borderBottomLeftRadius: 4, padding: "10px 14px", display: "flex", gap: 6 }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: BRAND.sky, animation: "bounce 1.2s infinite", animationDelay: `${i*0.2}s` }} />)}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {messages.length <= 2 && (
          <div style={{ background: BRAND.chatBg, padding: "6px 14px 10px", display: "flex", gap: 8, borderTop: "1px solid rgba(0,0,0,0.04)" }}>
            {["💚 Affordable Card", "✨ Premium Card"].map(r => (
              <button key={r} onClick={() => sendMessage(r)} style={{ padding: "8px 16px", borderRadius: 20, border: `1.5px solid ${BRAND.sky}`, background: "white", color: BRAND.sky, fontSize: 13, cursor: "pointer", fontWeight: 600 }}>{r}</button>
            ))}
          </div>
        )}

        <div style={{ background: "white", padding: "12px 14px", borderTop: "1px solid #e8edf3", display: "flex", alignItems: "flex-end", gap: 10 }}>
          <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }}} placeholder="মেসেজ লিখুন..." rows={1} style={{ flex: 1, fontSize: 14.5, color: BRAND.navy, lineHeight: 1.5, maxHeight: 80, overflowY: "auto", padding: "6px 2px" }} />
          <button onClick={() => sendMessage(input)} disabled={loading || !input.trim()} style={{ width: 40, height: 40, borderRadius: "50%", border: "none", background: input.trim() && !loading ? `linear-gradient(135deg, ${BRAND.sky}, #1a8fc0)` : "#dde4ed", color: "white", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>➤</button>
        </div>

        <div style={{ background: "white", textAlign: "center", padding: "6px", borderTop: "1px solid #f0f3f8" }}>
          <span style={{ fontSize: 10.5, color: "#a0afc0" }}>📞 01682588856 · bKash/Nagad available</span>
        </div>
      </div>
    </div>
  );
}
