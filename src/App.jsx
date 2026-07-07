import { useState } from "react";
import { ShoppingBag, Shirt, MessageCircle, Trophy, CalendarDays, Repeat, Wallet, BarChart3, User, Filter } from "lucide-react";

import { T, fontBody, useFonts } from "./theme/tokens";
import { usePersistentState, clearPersisted } from "./store/persist";
import { remaining, todayKey } from "./lib/utils";

import { Onboarding } from "./features/onboarding/Onboarding";
import { WardrobeScreen } from "./features/wardrobe/WardrobeScreen";
import { OutfitScreen } from "./features/outfit/OutfitScreen";
import { KaiScreen } from "./features/kai/KaiScreen";
import { SchedulerScreen } from "./features/scheduler/SchedulerScreen";
import { SwapScreen } from "./features/swap/SwapScreen";
import { RankScreen } from "./features/rank/RankScreen";
import { AnalyticsScreen } from "./features/analytics/AnalyticsScreen";
import { DashboardScreen } from "./features/dashboard/DashboardScreen";
import { ProfileScreen } from "./features/profile/ProfileScreen";
import { PaywallSheet } from "./features/premium/PaywallSheet";

/* ============ MAIN APP SHELL ============
 * Owns global state (persisted to localStorage), routing between the tab
 * screens, and the freemium quota gate. Each screen is self-contained under
 * src/features/*, so adding a new one is: build the screen, add a tab entry. */

const DEFAULT_SETTINGS = { notifOutfit: true, notifSwap: true, notifEvent: true, appearance: "light", allowSwap: true };
const DEFAULT_DEPOSIT = 200000;

export default function App() {
  useFonts();

  // Persistent app state — survives refresh so demos/dev keep their data.
  const [onboarded, setOnboarded] = usePersistentState("onboarded", false);
  const [items, setItems] = usePersistentState("items", []);
  const [schedule, setSchedule] = usePersistentState("schedule", []);
  const [swapRequests, setSwapRequests] = usePersistentState("swapRequests", []);
  const [deposit, setDeposit] = usePersistentState("deposit", DEFAULT_DEPOSIT);
  const [chat, setChat] = usePersistentState("chat", []);
  const [likes, setLikes] = usePersistentState("likes", []);
  const [rankOptIn, setRankOptIn] = usePersistentState("rankOptIn", null);
  const [plan, setPlan] = usePersistentState("plan", "free");
  const [usage, setUsage] = usePersistentState("usage", {});
  const [settings, setSettings] = usePersistentState("settings", DEFAULT_SETTINGS);

  // Ephemeral UI state.
  const [paywall, setPaywall] = useState(null); // {reason} atau null
  const [tab, setTab] = useState("wardrobe");
  const [moreOpen, setMoreOpen] = useState(false);

  const dark = settings.appearance === "dark";

  const resetAll = () => {
    clearPersisted();
    setOnboarded(false); setItems([]); setSchedule([]); setSwapRequests([]); setChat([]);
    setLikes([]); setRankOptIn(null); setPlan("free"); setUsage({}); setDeposit(DEFAULT_DEPOSIT);
    setSettings(DEFAULT_SETTINGS);
    setTab("wardrobe"); setMoreOpen(false);
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ items, schedule, swapRequests, plan, settings }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "closetcloud-data.json"; a.click();
    URL.revokeObjectURL(url);
  };

  const useQuota = (feature, reason) => {
    if (plan === "premium") return true;
    const left = remaining(usage, feature, plan);
    if (left <= 0) { setPaywall({ reason }); return false; }
    setUsage((u) => {
      const cur = u[feature]?.date === todayKey() ? u[feature].count : 0;
      return { ...u, [feature]: { date: todayKey(), count: cur + 1 } };
    });
    return true;
  };

  if (!onboarded) {
    return <Onboarding onFinish={(seedItems) => { setItems(seedItems); setOnboarded(true); }} />;
  }

  const mainTabs = [
    { key: "wardrobe", label: "Lemari", icon: ShoppingBag },
    { key: "outfit", label: "Outfit", icon: Shirt },
    { key: "kai", label: "Kai", icon: MessageCircle },
    { key: "rank", label: "Rank", icon: Trophy },
  ];
  const moreTabs = [
    { key: "scheduler", label: "Jadwal", icon: CalendarDays },
    { key: "swap", label: "Swap", icon: Repeat },
    { key: "analytics", label: "Biaya", icon: Wallet },
    { key: "dashboard", label: "Insight", icon: BarChart3 },
    { key: "profile", label: "Profil", icon: User },
  ];

  return (
    <div className="min-h-screen" style={{ background: dark ? "#1B1F3B" : T.bg, ...fontBody }}>
      <div className="max-w-md mx-auto min-h-screen relative" style={{ background: dark ? "#1B1F3B" : T.bg }}>
        {tab === "wardrobe" && <WardrobeScreen items={items} setItems={setItems} />}
        {tab === "outfit" && <OutfitScreen items={items} setItems={setItems} likes={likes} setLikes={setLikes} plan={plan} usage={usage} useQuota={useQuota} onUpgrade={() => setPaywall({ reason: "Outfit Generate tanpa batas" })} />}
        {tab === "kai" && <KaiScreen items={items} setItems={setItems} chat={chat} setChat={setChat} plan={plan} usage={usage} useQuota={useQuota} onUpgrade={() => setPaywall({ reason: "Chat Kai tanpa batas" })} />}
        {tab === "scheduler" && <SchedulerScreen items={items} schedule={schedule} setSchedule={setSchedule} />}
        {tab === "swap" && <SwapScreen items={items} setItems={setItems} swapRequests={swapRequests} setSwapRequests={setSwapRequests} deposit={deposit} setDeposit={setDeposit} />}
        {tab === "rank" && <RankScreen items={items} optIn={rankOptIn} setOptIn={setRankOptIn} />}
        {tab === "analytics" && <AnalyticsScreen items={items} />}
        {tab === "dashboard" && <DashboardScreen items={items} swapRequests={swapRequests} />}
        {tab === "profile" && <ProfileScreen items={items} swapRequests={swapRequests} plan={plan} settings={settings} setSettings={setSettings} rankOptIn={rankOptIn} setRankOptIn={setRankOptIn} onNavigate={(t) => setTab(t)} onUpgrade={() => setPaywall({ reason: "Buka semua fitur premium" })} onManageSub={() => setPaywall({ reason: "Kelola langganan ClosetCloud+" })} onSignOut={resetAll} onDeleteAccount={resetAll} onExport={exportData} />}

        {moreOpen && (
          <div className="fixed inset-0 z-40 flex items-end max-w-md mx-auto" style={{ background: "rgba(27,31,59,0.4)" }} onClick={() => setMoreOpen(false)}>
            <div className="w-full rounded-t-3xl p-5 pb-8" style={{ background: T.bg }} onClick={(e) => e.stopPropagation()}>
              <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: "#D8DBE8" }} />
              <p className="font-bold text-sm mb-3" style={{ color: T.navy }}>Menu Lainnya</p>
              <div className="grid grid-cols-4 gap-3">
                {moreTabs.map((t) => (
                  <button key={t.key} onClick={() => { setTab(t.key); setMoreOpen(false); }} className="flex flex-col items-center gap-1.5 py-2">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: tab === t.key ? T.mintLight : T.white, border: "1px solid #E3E6F0" }}>
                      <t.icon size={20} color={tab === t.key ? T.lavenderDeep : T.navySoft} />
                    </div>
                    <span className="text-[11px] font-medium text-center" style={{ color: T.navy }}>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto flex justify-around items-center py-2.5 px-1" style={{ background: dark ? "#252A4D" : T.white, borderTop: dark ? "1px solid #333858" : "1px solid #E3E6F0" }}>
          {mainTabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)} className="flex flex-col items-center gap-1 px-1.5 flex-1">
              <t.icon size={20} color={tab === t.key ? T.lavenderDeep : "#A3A8C0"} />
              <span className="text-[10px] font-semibold" style={{ color: tab === t.key ? T.navy : "#A3A8C0" }}>{t.label}</span>
            </button>
          ))}
          <button onClick={() => setMoreOpen(true)} className="flex flex-col items-center gap-1 px-1.5 flex-1">
            <Filter size={20} color={moreTabs.some((t) => t.key === tab) ? T.lavenderDeep : "#A3A8C0"} />
            <span className="text-[10px] font-semibold" style={{ color: moreTabs.some((t) => t.key === tab) ? T.navy : "#A3A8C0" }}>Lainnya</span>
          </button>
        </div>

        {paywall && <PaywallSheet reason={paywall.reason} onClose={() => setPaywall(null)} onUpgrade={() => setPlan("premium")} />}
      </div>
    </div>
  );
}
