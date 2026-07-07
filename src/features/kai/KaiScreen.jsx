import { useState, useEffect, useRef } from "react";
import { MessageCircle, AlertTriangle, Send, Sparkles, Shirt, Check, HandHeart, Banknote, Scissors, Lightbulb } from "lucide-react";
import { T } from "../../theme/tokens";
import { Header, Card, Button } from "../../components/ui";
import { QuotaBanner } from "../../components/QuotaBanner";
import { KAI_QUICK_PROMPTS } from "../../data/mock";
import { askKai } from "../../lib/kai";
import { remaining } from "../../lib/utils";
import { FREE_LIMITS } from "../../config/plans";

function ActionCardView({ card, items, setItems }) {
  const findItem = (id) => items.find((i) => i.id === id);
  const flagItem = (id, flag) => setItems(items.map((i) => i.id === id ? { ...i, flag } : i));
  const wearOutfit = (ids) => setItems(items.map((i) => ids.includes(i.id) ? { ...i, wearCount: i.wearCount + 1, lastWorn: new Date().toISOString(), wearHistory: [...(i.wearHistory || []), new Date().toISOString()] } : i));

  if (card.type === "outfit") {
    const list = (card.item_ids || []).map(findItem).filter(Boolean);
    if (list.length === 0) return null;
    return (
      <Card className="mt-2" style={{ border: `1.5px solid ${T.mint}` }}>
        <div className="flex items-center gap-1.5 mb-2"><Sparkles size={14} color={T.lavenderDeep} /><p className="text-xs font-bold" style={{ color: T.navy }}>{card.title || "Outfit dari Kai"}</p></div>
        <div className="flex gap-2 mb-2">{list.map((it) => <img key={it.id} src={it.image} className="w-12 h-12 rounded-lg object-cover" />)}</div>
        <p className="text-[11px] mb-2" style={{ color: T.navySoft }}>{card.reason}</p>
        <Button full icon={Shirt} onClick={() => wearOutfit(list.map((i) => i.id))} style={{ padding: "8px 12px", fontSize: 13 }}>Pakai hari ini</Button>
      </Card>
    );
  }
  const it = findItem(card.item_id);
  if (!it) return null;

  if (card.type === "rewear") return (
    <Card className="mt-2 flex items-center gap-3" style={{ display: "flex", border: `1.5px solid ${T.lavender}` }}>
      <img src={it.image} className="w-12 h-12 rounded-lg object-cover" />
      <div className="flex-1"><p className="text-xs font-bold" style={{ color: T.navy }}>Pakai ulang: {it.name}</p><p className="text-[11px]" style={{ color: T.navySoft }}>{card.suggestion}</p></div>
    </Card>
  );
  if (card.type === "donate" || card.type === "sell") {
    const isDonate = card.type === "donate";
    const done = it.flag === card.type;
    return (
      <Card className="mt-2" style={{ border: `1.5px solid ${isDonate ? T.sage : T.coral}` }}>
        <div className="flex items-center gap-3">
          <img src={it.image} className="w-12 h-12 rounded-lg object-cover" />
          <div className="flex-1">
            <p className="text-xs font-bold" style={{ color: T.navy }}>{isDonate ? "Layak didonasikan" : "Layak dijual"}: {it.name}</p>
            <p className="text-[11px]" style={{ color: T.navySoft }}>{card.reason}{card.est_price ? ` · Estimasi Rp ${Number(card.est_price).toLocaleString("id-ID")}` : ""}</p>
          </div>
        </div>
        <Button full variant={done ? "dark" : "outline"} icon={done ? Check : (isDonate ? HandHeart : Banknote)}
          onClick={() => flagItem(it.id, done ? null : card.type)} style={{ marginTop: 8, padding: "8px 12px", fontSize: 13 }}>
          {done ? "Sudah ditandai — ketuk untuk batal" : (isDonate ? "Tandai untuk Donasi" : "Tandai untuk Dijual")}
        </Button>
      </Card>
    );
  }
  if (card.type === "diy") return (
    <Card className="mt-2" style={{ border: `1.5px solid ${T.lavender}` }}>
      <div className="flex items-center gap-1.5 mb-1.5"><Scissors size={13} color={T.lavenderDeep} /><p className="text-xs font-bold" style={{ color: T.navy }}>DIY: {card.idea}</p></div>
      <div className="flex gap-3">
        <img src={it.image} className="w-12 h-12 rounded-lg object-cover shrink-0" />
        <ol className="text-[11px] list-decimal ml-4" style={{ color: T.navySoft }}>{(card.steps || []).map((s, i) => <li key={i}>{s}</li>)}</ol>
      </div>
    </Card>
  );
  return null;
}

function SuggestAddCard({ card }) {
  return (
    <Card className="mt-2" style={{ background: T.mintLight }}>
      <div className="flex items-center gap-1.5 mb-1"><Lightbulb size={13} color={T.sage} /><p className="text-xs font-bold" style={{ color: T.navy }}>Gap lemari: {card.category}</p></div>
      <p className="text-[11px]" style={{ color: T.navySoft }}>{card.reason}{card.thrift_first ? " Coba cari lewat thrift atau Swap Network dulu sebelum beli baru ya!" : ""}</p>
    </Card>
  );
}

/* ============ AI CHAT STYLIST "KAI" ============ */
export function KaiScreen({ items, setItems, chat, setChat, plan, usage, useQuota, onUpgrade, onBack }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [failedMsg, setFailedMsg] = useState(null);
  const scrollRef = useRef(null);
  const left = remaining(usage, "ai_chat", plan);

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [chat, loading]);

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    if (!useQuota("ai_chat", "Chat Kai tanpa batas")) return;
    setInput("");
    setFailedMsg(null);
    const newChat = [...chat, { role: "user", content: msg }];
    setChat(newChat);
    setLoading(true);
    try {
      const reply = await askKai(items, chat, msg);
      setChat([...newChat, { role: "assistant", content: reply.content, action_cards: reply.action_cards }]);
    } catch {
      setFailedMsg(msg);
      setChat(newChat);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-24 flex flex-col" style={{ height: "100vh" }}>
      <Header title="Kai — AI Stylist" subtitle="Tanya apa saja soal lemarimu" onBack={onBack} />
      <QuotaBanner remaining={left} limit={FREE_LIMITS.ai_chat} label="pesan Kai" onUpgrade={onUpgrade} />
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pb-4">
        {chat.length === 0 && !loading && (
          <div className="flex flex-col items-center pt-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3" style={{ background: `linear-gradient(135deg, ${T.mint}, ${T.lavender})` }}>
              <MessageCircle size={26} color={T.navy} />
            </div>
            <p className="text-sm text-center mb-5 max-w-xs" style={{ color: T.navySoft }}>Halo! Aku Kai. Aku sudah lihat isi lemarimu — mau mulai dari mana?</p>
            <div className="flex flex-col gap-2 w-full">
              {KAI_QUICK_PROMPTS.map((q) => (
                <button key={q} onClick={() => send(q)} className="text-left px-4 py-3 rounded-2xl text-sm font-medium" style={{ background: T.white, border: "1px solid #E3E6F0", color: T.navy }}>{q}</button>
              ))}
            </div>
          </div>
        )}
        {chat.map((m, idx) => (
          <div key={idx} className={`flex mt-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className="max-w-[85%]">
              <div className="px-3.5 py-2.5 rounded-2xl text-sm" style={m.role === "user"
                ? { background: T.navy, color: T.white, borderBottomRightRadius: 6 }
                : { background: `linear-gradient(135deg, ${T.mintLight}, #F3EEFB)`, color: T.navy, borderBottomLeftRadius: 6 }}>
                {m.content}
              </div>
              {m.role === "assistant" && (m.action_cards || []).map((c, i) =>
                c.type === "suggest_add" ? <SuggestAddCard key={i} card={c} /> : <ActionCardView key={i} card={c} items={items} setItems={setItems} />
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex mt-3">
            <div className="px-4 py-3 rounded-2xl flex gap-1.5" style={{ background: T.mintLight }}>
              {[0, 1, 2].map((i) => <div key={i} className="w-2 h-2 rounded-full animate-bounce" style={{ background: T.lavenderDeep, animationDelay: `${i * 0.15}s` }} />)}
            </div>
          </div>
        )}
        {failedMsg && !loading && (
          <div className="flex items-center gap-2 mt-3 px-3 py-2.5 rounded-xl" style={{ background: "#FCEEE9" }}>
            <AlertTriangle size={15} color={T.coral} />
            <p className="text-xs flex-1" style={{ color: T.navy }}>Kai lagi susah dihubungi. Cek koneksi lalu coba lagi.</p>
            <button onClick={() => send(failedMsg)} className="text-xs font-bold" style={{ color: T.lavenderDeep }}>Coba lagi</button>
          </div>
        )}
      </div>
      <div className="fixed bottom-16 left-0 right-0 max-w-md mx-auto px-4 pb-2 pt-2" style={{ background: T.bg }}>
        <div className="flex gap-2 items-center rounded-2xl px-3 py-2" style={{ background: T.white, border: "1px solid #E3E6F0" }}>
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Tanya Kai soal outfit, donasi, DIY…" className="flex-1 outline-none text-sm bg-transparent" style={{ color: T.navy }} />
          <button onClick={() => send()} disabled={loading || !input.trim()} className="p-2 rounded-full disabled:opacity-40" style={{ background: `linear-gradient(135deg, ${T.mint}, ${T.lavender})` }}>
            <Send size={16} color={T.navy} />
          </button>
        </div>
      </div>
    </div>
  );
}
