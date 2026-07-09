import { useState } from "react";
import { Home, ShoppingBag, Sparkles, Repeat, User } from "lucide-react";

import { T, fontBody, useFonts } from "./theme/tokens";
import { usePersistentState, clearPersisted } from "./store/persist";
import { remaining, todayKey } from "./lib/utils";

import { Onboarding } from "./features/onboarding/Onboarding";
import { HomeScreen } from "./features/home/HomeScreen";
import { WardrobeScreen } from "./features/wardrobe/WardrobeScreen";
import { OutfitScreen } from "./features/outfit/OutfitScreen";
import { KaiScreen } from "./features/kai/KaiScreen";
import { SchedulerScreen } from "./features/scheduler/SchedulerScreen";
import { SwapScreen } from "./features/swap/SwapScreen";
import { ThriftScreen } from "./features/thrift/ThriftScreen";
import { CommunityScreen } from "./features/social/CommunityScreen";
import { UserProfileScreen } from "./features/social/UserProfileScreen";
import { AnalyticsScreen } from "./features/analytics/AnalyticsScreen";
import { DashboardScreen } from "./features/dashboard/DashboardScreen";
import { ProfileScreen } from "./features/profile/ProfileScreen";
import { SettingsScreen } from "./features/profile/SettingsScreen";
import { PaywallSheet } from "./features/premium/PaywallSheet";

/* ============ MAIN APP SHELL ============
 * Owns global state (persisted to localStorage), routing between the tab
 * screens, and the freemium quota gate. Each screen is self-contained under
 * src/features/*, so adding a new one is: build the screen, add a tab entry. */

const DEFAULT_SETTINGS = { notifOutfit: true, notifSwap: true, notifEvent: true, appearance: "light", allowSwap: true, pubWardrobe: true, pubCity: true, pubStats: true };
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
  const [profile, setProfile] = usePersistentState("profile", null);
  const [thriftOrders, setThriftOrders] = usePersistentState("thriftOrders", []);
  const [follows, setFollows] = usePersistentState("follows", []);
  const [adUsage, setAdUsage] = usePersistentState("adUsage", {});

  // Ephemeral UI state. `stack` is a tiny nav stack so Back works everywhere:
  // tabs reset it, drilling into a feature pushes onto it.
  const [paywall, setPaywall] = useState(null); // {reason} atau null
  const [viewUser, setViewUser] = useState(null);
  const [stack, setStack] = useState(["home"]);

  const dark = settings.appearance === "dark";

  const resetAll = () => {
    clearPersisted();
    setOnboarded(false); setItems([]); setSchedule([]); setSwapRequests([]); setChat([]);
    setLikes([]); setRankOptIn(null); setPlan("free"); setUsage({}); setDeposit(DEFAULT_DEPOSIT);
    setSettings(DEFAULT_SETTINGS); setProfile(null); setThriftOrders([]); setFollows([]); setAdUsage({});
    setStack(["home"]);
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

  // Rewarded ads: watch 2 ads → 1 free generate, capped at 4 ad-views/day.
  const AD_LIMIT = 4;
  const adsWatched = adUsage.date === todayKey() ? adUsage.count : 0;
  const adsLeft = plan === "premium" ? Infinity : Math.max(0, AD_LIMIT - adsWatched);
  const watchAd = () => setAdUsage((u) => { const c = u.date === todayKey() ? u.count : 0; return { date: todayKey(), count: c + 1 }; });

  if (!onboarded) {
    return <Onboarding onFinish={(seedItems, userProfile) => { setItems(seedItems); if (userProfile) setProfile(userProfile); setOnboarded(true); }} />;
  }

  const NAV = [
    { key: "home", label: "Home", icon: Home },
    { key: "wardrobe", label: "Lemari", icon: ShoppingBag },
    { key: "outfit", label: "Outfit", icon: Sparkles },
    { key: "swap", label: "Swap", icon: Repeat },
    { key: "profile", label: "Profil", icon: User },
  ];
  const route = stack[stack.length - 1];
  const rootTab = stack[0];
  const isMainTab = (r) => NAV.some((n) => n.key === r);
  const setTab = (t) => setStack([t]);
  const back = () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  // Main tabs switch tab; sub-features push onto the stack so Back returns here.
  const navTo = (r) => (isMainTab(r) ? setTab(r) : setStack((s) => [...s, r]));

  return (
    <div className="min-h-screen" style={{ background: dark ? "#1B1F3B" : T.bg, ...fontBody }}>
      <div className="max-w-md mx-auto min-h-screen relative" style={{ background: dark ? "#1B1F3B" : T.bg }}>
        {route === "home" && <HomeScreen profile={profile} items={items} swapRequests={swapRequests} onGo={navTo} />}
        {route === "wardrobe" && <WardrobeScreen items={items} setItems={setItems} />}
        {route === "outfit" && <OutfitScreen items={items} setItems={setItems} likes={likes} setLikes={setLikes} plan={plan} usage={usage} useQuota={useQuota} adsLeft={adsLeft} watchAd={watchAd} onUpgrade={() => setPaywall({ reason: "Outfit Generate tanpa batas" })} />}
        {route === "swap" && <SwapScreen items={items} setItems={setItems} swapRequests={swapRequests} setSwapRequests={setSwapRequests} deposit={deposit} setDeposit={setDeposit} />}
        {route === "thrift" && <ThriftScreen onBack={back} items={items} setItems={setItems} thriftOrders={thriftOrders} setThriftOrders={setThriftOrders} />}
        {route === "community" && <CommunityScreen onBack={back} items={items} optIn={rankOptIn} setOptIn={setRankOptIn} follows={follows} setFollows={setFollows} onOpenUser={(u) => { setViewUser(u); setStack((s) => [...s, "user"]); }} />}
        {route === "user" && <UserProfileScreen user={viewUser} follows={follows} setFollows={setFollows} onBack={back} />}
        {route === "profile" && <ProfileScreen profile={profile} setProfile={setProfile} follows={follows} items={items} swapRequests={swapRequests} plan={plan} settings={settings} onNavigate={navTo} />}
        {route === "settings" && <SettingsScreen onBack={back} profile={profile} setProfile={setProfile} settings={settings} setSettings={setSettings} plan={plan} rankOptIn={rankOptIn} setRankOptIn={setRankOptIn} onUpgrade={() => setPaywall({ reason: "Buka semua fitur premium" })} onManageSub={() => setPaywall({ reason: "Kelola langganan ClosetCloud+" })} onExport={exportData} onSignOut={resetAll} onDeleteAccount={resetAll} />}

        {route === "kai" && <KaiScreen onBack={back} items={items} setItems={setItems} chat={chat} setChat={setChat} plan={plan} usage={usage} useQuota={useQuota} onUpgrade={() => setPaywall({ reason: "Chat Kai tanpa batas" })} />}
        {route === "scheduler" && <SchedulerScreen onBack={back} items={items} schedule={schedule} setSchedule={setSchedule} />}
        {route === "analytics" && <AnalyticsScreen onBack={back} items={items} />}
        {route === "dashboard" && <DashboardScreen onBack={back} items={items} swapRequests={swapRequests} />}

        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto flex justify-around items-center py-2.5 px-1" style={{ background: dark ? "#252A4D" : T.white, borderTop: dark ? "1px solid #333858" : "1px solid #E3E6F0", boxShadow: "0 -8px 24px -18px rgba(27,31,59,.4)" }}>
          {NAV.map((t) => {
            const on = rootTab === t.key;
            return (
              <button key={t.key} onClick={() => setTab(t.key)} className="cc-press flex flex-col items-center gap-1 px-1.5 flex-1">
                <span className="w-9 h-9 rounded-2xl flex items-center justify-center transition-colors" style={{ background: on ? T.mintLight : "transparent" }}>
                  <t.icon size={20} color={on ? T.lavenderDeep : "#A3A8C0"} />
                </span>
                <span className="text-[10px] font-semibold" style={{ color: on ? T.navy : "#A3A8C0" }}>{t.label}</span>
              </button>
            );
          })}
        </div>

        {paywall && <PaywallSheet reason={paywall.reason} onClose={() => setPaywall(null)} onUpgrade={() => setPlan("premium")} />}
      </div>
    </div>
  );
}
