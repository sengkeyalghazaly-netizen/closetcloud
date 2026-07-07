import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, X, Sparkles, CalendarPlus, Bell, AlertTriangle, RefreshCw, Check, Trash2, CalendarDays } from "lucide-react";
import { T, fontDisplay } from "../../theme/tokens";
import { Card, Chip, Button, EmptyState, Header } from "../../components/ui";
import { WEATHER_OPTIONS, AGENDA_OPTIONS } from "../../data/reference";
import { generateOutfits } from "../../lib/outfits";
import { toKey, MONTH_NAMES, WEEKDAY_LABELS, buildMonthGrid, findConflict } from "../../lib/utils";

/* ============ OUTFIT SCHEDULER ============ */
function DayDetailModal({ date, items, schedule, setSchedule, onClose }) {
  const dateKey = toKey(date);
  const existing = schedule.find((s) => s.date === dateKey);
  const [mode, setMode] = useState(existing ? "view" : "choose"); // choose | generate | event | view
  const [weatherKey, setWeatherKey] = useState("sejuk");
  const [agenda, setAgenda] = useState(AGENDA_OPTIONS[0]);
  const [candidate, setCandidate] = useState(null);
  const [conflict, setConflict] = useState(null);
  const [eventLabel, setEventLabel] = useState("");
  const [reminder, setReminder] = useState(true);

  const dateLabel = date.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" });

  const runGenerate = () => {
    const options = generateOutfits(items, weatherKey, agenda);
    if (options.length === 0) return;
    const combo = options[0];
    const itemIds = [combo.top, combo.bottom, combo.shoe, combo.outer, combo.acc].filter(Boolean).map((i) => i.id);
    setCandidate({ combo, itemIds });
    setConflict(findConflict(schedule, dateKey, itemIds, dateKey));
  };

  const confirmSave = () => {
    if (!candidate) return;
    const entry = { date: dateKey, itemIds: candidate.itemIds, label: agenda, special: false, reminder: false };
    setSchedule([...schedule.filter((s) => s.date !== dateKey), entry]);
    onClose();
  };

  const saveEvent = () => {
    if (!eventLabel.trim()) return;
    const entry = { date: dateKey, itemIds: candidate ? candidate.itemIds : [], label: eventLabel.trim(), special: true, reminder };
    setSchedule([...schedule.filter((s) => s.date !== dateKey), entry]);
    onClose();
  };

  const removeEntry = () => {
    setSchedule(schedule.filter((s) => s.date !== dateKey));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ background: "rgba(27,31,59,0.55)" }}>
      <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-5 max-h-[92vh] overflow-y-auto" style={{ background: T.bg }}>
        <div className="flex items-center justify-between mb-1">
          <p className="font-bold text-lg" style={{ ...fontDisplay, color: T.navy }}>{dateLabel}</p>
          <button onClick={onClose} className="p-2 rounded-full" style={{ background: T.white }}><X size={18} color={T.navy} /></button>
        </div>

        {mode === "view" && existing && (
          <div className="flex flex-col gap-3 mt-3">
            {existing.special && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "#F3EEFB" }}>
                <Bell size={16} color={T.lavenderDeep} />
                <span className="text-sm font-semibold" style={{ color: T.navy }}>{existing.label}{existing.reminder ? " · Pengingat aktif" : ""}</span>
              </div>
            )}
            {existing.itemIds.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {existing.itemIds.map((id) => {
                  const it = items.find((i) => i.id === id);
                  return it ? <img key={id} src={it.image} className="w-16 h-16 rounded-xl object-cover" /> : null;
                })}
              </div>
            )}
            {!existing.special && <p className="text-sm" style={{ color: T.navySoft }}>Agenda: {existing.label}</p>}
            <div className="flex gap-2 mt-2">
              <Button variant="outline" icon={RefreshCw} onClick={() => { setMode("choose"); }}>Ubah</Button>
              <Button full variant="outline" icon={Trash2} onClick={removeEntry} style={{ color: T.coral, borderColor: T.coral }}>Hapus jadwal</Button>
            </div>
          </div>
        )}

        {mode === "choose" && (
          <div className="flex flex-col gap-3 mt-3">
            <button onClick={() => setMode("generate")} className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left" style={{ background: T.white, border: "1px solid #E3E6F0" }}>
              <Sparkles size={20} color={T.lavenderDeep} />
              <div>
                <p className="font-semibold text-sm" style={{ color: T.navy }}>Generate outfit otomatis</p>
                <p className="text-xs" style={{ color: T.navySoft }}>AI pilih dari isi lemarimu</p>
              </div>
            </button>
            <button onClick={() => setMode("event")} className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left" style={{ background: T.white, border: "1px solid #E3E6F0" }}>
              <CalendarPlus size={20} color={T.lavenderDeep} />
              <div>
                <p className="font-semibold text-sm" style={{ color: T.navy }}>Tambah acara khusus</p>
                <p className="text-xs" style={{ color: T.navySoft }}>Interview, wisuda, kondangan, dll.</p>
              </div>
            </button>
          </div>
        )}

        {mode === "generate" && (
          <div className="flex flex-col gap-3 mt-3">
            <div className="flex gap-2">
              {WEATHER_OPTIONS.map((w) => (
                <button key={w.key} onClick={() => setWeatherKey(w.key)} className="flex-1 rounded-xl py-2.5 flex flex-col items-center gap-1"
                  style={{ background: weatherKey === w.key ? T.mintLight : T.white, border: weatherKey === w.key ? `1.5px solid ${T.mint}` : "1px solid #E3E6F0" }}>
                  <w.icon size={16} color={T.navy} />
                  <span className="text-xs font-medium" style={{ color: T.navy }}>{w.temp}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              {AGENDA_OPTIONS.map((a) => <Chip key={a} active={agenda === a} onClick={() => setAgenda(a)}>{a}</Chip>)}
            </div>
            {!candidate ? (
              <Button icon={Sparkles} onClick={runGenerate}>Generate Outfit</Button>
            ) : (
              <>
                <div className="flex gap-2 flex-wrap">
                  {[candidate.combo.top, candidate.combo.outer, candidate.combo.bottom, candidate.combo.shoe, candidate.combo.acc].filter(Boolean).map((it) => (
                    <img key={it.id} src={it.image} className="w-16 h-16 rounded-xl object-cover" />
                  ))}
                </div>
                {conflict && (
                  <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl" style={{ background: "#FCEEE9" }}>
                    <AlertTriangle size={16} color={T.coral} className="mt-0.5 shrink-0" />
                    <p className="text-xs" style={{ color: T.navy }}>
                      Outfit ini mirip dengan yang dijadwalkan {new Date(conflict.date).toLocaleDateString("id-ID", { day: "numeric", month: "long" })}. Mau coba kombinasi lain?
                    </p>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" icon={RefreshCw} onClick={runGenerate}>Coba lagi</Button>
                  <Button full icon={Check} onClick={confirmSave}>{conflict ? "Tetap pakai ini" : "Simpan ke jadwal"}</Button>
                </div>
              </>
            )}
          </div>
        )}

        {mode === "event" && (
          <div className="flex flex-col gap-3 mt-3">
            <div>
              <label className="text-xs font-semibold" style={{ color: T.navySoft }}>Nama acara</label>
              <input value={eventLabel} onChange={(e) => setEventLabel(e.target.value)} placeholder="mis. Interview kerja, Wisuda, Kondangan"
                className="w-full mt-1 px-3 py-2.5 rounded-xl outline-none" style={{ background: T.white, border: "1px solid #E3E6F0" }} />
            </div>
            <button onClick={() => setReminder(!reminder)} className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: T.white, border: "1px solid #E3E6F0" }}>
              <div className="flex items-center gap-2"><Bell size={16} color={T.lavenderDeep} /><span className="text-sm font-medium" style={{ color: T.navy }}>Ingatkan sehari sebelumnya</span></div>
              <div className="w-10 h-6 rounded-full p-0.5 transition-colors" style={{ background: reminder ? T.mint : "#E3E6F0" }}>
                <div className="w-5 h-5 rounded-full bg-white transition-transform" style={{ transform: reminder ? "translateX(16px)" : "translateX(0)" }} />
              </div>
            </button>
            <Button full disabled={!eventLabel.trim()} icon={Check} onClick={saveEvent}>Simpan acara</Button>
          </div>
        )}
      </div>
    </div>
  );
}

export function SchedulerScreen({ items, schedule, setSchedule, onBack }) {
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const cells = useMemo(() => buildMonthGrid(viewDate), [viewDate]);
  const todayKeyStr = toKey(new Date());

  return (
    <div className="pb-24">
      <Header title="Outfit Scheduler" subtitle="Rencanakan outfit seperti kalender" onBack={onBack} />
      <div className="px-4">
        <Card>
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))} className="p-1.5 rounded-full" style={{ background: T.mintLight }}>
              <ChevronLeft size={16} color={T.navy} />
            </button>
            <p className="font-bold text-sm" style={{ ...fontDisplay, color: T.navy }}>{MONTH_NAMES[viewDate.getMonth()]} {viewDate.getFullYear()}</p>
            <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))} className="p-1.5 rounded-full" style={{ background: T.mintLight }}>
              <ChevronRight size={16} color={T.navy} />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-1">
            {WEEKDAY_LABELS.map((w) => <p key={w} className="text-center text-xs font-semibold" style={{ color: T.navySoft }}>{w}</p>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((d, idx) => {
              if (!d) return <div key={idx} />;
              const key = toKey(d);
              const entry = schedule.find((s) => s.date === key);
              const isToday = key === todayKeyStr;
              return (
                <button key={idx} onClick={() => setSelectedDate(d)} className="aspect-square rounded-xl flex flex-col items-center justify-center relative"
                  style={{ background: isToday ? T.mintLight : "transparent", border: isToday ? `1.5px solid ${T.mint}` : "1px solid transparent" }}>
                  <span className="text-sm font-medium" style={{ color: T.navy }}>{d.getDate()}</span>
                  {entry && <div className="w-1.5 h-1.5 rounded-full mt-0.5" style={{ background: entry.special ? T.lavenderDeep : T.sage }} />}
                </button>
              );
            })}
          </div>
        </Card>

        <div className="mt-4 flex items-center gap-4 px-1">
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ background: T.sage }} /><span className="text-xs" style={{ color: T.navySoft }}>Outfit terjadwal</span></div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ background: T.lavenderDeep }} /><span className="text-xs" style={{ color: T.navySoft }}>Acara khusus</span></div>
        </div>

        {schedule.length === 0 && (
          <div className="mt-4">
            <EmptyState icon={CalendarDays} title="Belum ada jadwal" subtitle="Ketuk tanggal di kalender untuk mulai rencanakan outfit atau tambah acara khusus." action={null} />
          </div>
        )}
      </div>

      {selectedDate && (
        <DayDetailModal date={selectedDate} items={items} schedule={schedule} setSchedule={setSchedule} onClose={() => setSelectedDate(null)} />
      )}
    </div>
  );
}
