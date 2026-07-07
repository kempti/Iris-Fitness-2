import { useState, useEffect } from "react";
import { Dumbbell, Check, ChevronLeft, Flame, Info, RotateCcw, ArrowRight, PartyPopper } from "lucide-react";

const WORKOUTS = [
  {
    id: "upper",
    name: "Upper Body",
    focus: "Back, chest, shoulders & arms",
    accent: "violet",
    dot: "bg-violet-500",
    ring: "ring-violet-200",
    soft: "bg-violet-50",
    text: "text-violet-700",
    btn: "bg-violet-600 hover:bg-violet-700",
    warmup: [
      "Arm circles — 30 sec each direction",
      "Shoulder rolls — 30 sec",
      "Marching or light jog on the spot — 2 min",
    ],
    exercises: [
      { name: "Push-ups", sets: "3", reps: "8–12", cue: "Drop to your knees if you need to. Keep your body in a straight line." },
      { name: "Bent-over rows", sets: "3", reps: "10–12", cue: "Use dumbbells, a backpack, or water bottles. Squeeze your shoulder blades together." },
      { name: "Shoulder press", sets: "3", reps: "10", cue: "Press straight up. Don't arch your lower back." },
      { name: "Bicep curls", sets: "3", reps: "12", cue: "Slow and controlled, elbows tucked in." },
      { name: "Chair tricep dips", sets: "3", reps: "10", cue: "Hands on a sturdy chair. Keep elbows pointing back, not out." },
      { name: "Plank", sets: "3", reps: "20–30 sec", cue: "Straight line from head to heels. Don't let your hips sag." },
    ],
    cooldown: ["Chest & shoulder stretch — 30 sec each side", "Overhead tricep stretch — 30 sec each arm"],
  },
  {
    id: "lower",
    name: "Lower Body",
    focus: "Legs & glutes",
    accent: "amber",
    dot: "bg-amber-500",
    ring: "ring-amber-200",
    soft: "bg-amber-50",
    text: "text-amber-700",
    btn: "bg-amber-500 hover:bg-amber-600",
    warmup: [
      "Leg swings — 30 sec each leg",
      "Bodyweight squats (slow) — 1 min",
      "Marching on the spot — 2 min",
    ],
    exercises: [
      { name: "Bodyweight squats", sets: "3", reps: "12–15", cue: "Sit back like you're reaching for a chair. Knees track over your toes." },
      { name: "Reverse lunges", sets: "3", reps: "10 each leg", cue: "Step back and lower gently. Keep your chest up." },
      { name: "Glute bridges", sets: "3", reps: "15", cue: "Squeeze your glutes hard at the top." },
      { name: "Calf raises", sets: "3", reps: "20", cue: "Rise onto your toes, lower slowly." },
      { name: "Wall sit", sets: "3", reps: "30–45 sec", cue: "Back flat on the wall, thighs parallel to the floor." },
      { name: "Side-lying leg raises", sets: "3", reps: "12 each side", cue: "Lift with control, don't rock your body." },
    ],
    cooldown: ["Standing quad stretch — 30 sec each leg", "Seated hamstring stretch — 30 sec each leg"],
  },
  {
    id: "full",
    name: "Full Body",
    focus: "All-round strength",
    accent: "emerald",
    dot: "bg-emerald-500",
    ring: "ring-emerald-200",
    soft: "bg-emerald-50",
    text: "text-emerald-700",
    btn: "bg-emerald-600 hover:bg-emerald-700",
    warmup: [
      "Arm circles + leg swings — 1 min",
      "Jumping jacks or step-touch — 2 min",
      "Slow squats — 1 min",
    ],
    exercises: [
      { name: "Squat to overhead press", sets: "3", reps: "12", cue: "Squat down, then press up as you stand tall." },
      { name: "Push-ups", sets: "3", reps: "8–10", cue: "Knees down is fine. Body in a straight line." },
      { name: "Reverse lunges", sets: "3", reps: "10 each leg", cue: "Chest up, lower gently." },
      { name: "Bent-over rows", sets: "3", reps: "12", cue: "Squeeze shoulder blades together." },
      { name: "Glute bridges", sets: "3", reps: "15", cue: "Squeeze at the top." },
      { name: "Plank", sets: "3", reps: "30 sec", cue: "Strong straight line, hips level." },
      { name: "Easy cardio finisher (optional)", sets: "1", reps: "5 min", cue: "March, step-ups, or dance — whatever feels good." },
    ],
    cooldown: ["Full-body stretch — reach up tall, then fold forward — 1 min", "Deep breaths — 1 min"],
  },
];

const TIPS = [
  "Rest 45–60 seconds between sets.",
  "Move slowly with good form — that beats rushing every time.",
  "When it starts feeling easy, add a rep or a little weight.",
  "Fuel up: eat enough and get some protein. Muscle is built with food, not by skipping meals.",
  "Take rest days — your muscles actually grow when you recover.",
];

function getWeekKey() {
  const d = new Date();
  const jan1 = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${week}`;
}

const DEFAULT = { currentIndex: 0, totalSessions: 0, weekKey: getWeekKey(), doneThisWeek: [] };

export default function App() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(DEFAULT);
  const [activeId, setActiveId] = useState(null);
  const [checked, setChecked] = useState({});
  const [done, setDone] = useState(false);

  useEffect(() => {
    (async () => {
      let p = null;
      try {
        if (typeof window !== "undefined" && window.storage) {
          const r = await window.storage.get("progress");
          if (r) p = JSON.parse(r.value);
        }
      } catch (e) { p = null; }
      if (p) {
        if (p.weekKey !== getWeekKey()) { p.weekKey = getWeekKey(); p.doneThisWeek = []; }
        setProgress({ ...DEFAULT, ...p });
      }
      setLoading(false);
    })();
  }, []);

  const persist = async (p) => {
    setProgress(p);
    try {
      if (typeof window !== "undefined" && window.storage) {
        await window.storage.set("progress", JSON.stringify(p));
      }
    } catch (e) { /* keeps working in-session even if saving fails */ }
  };

  const open = (id) => { setActiveId(id); setChecked({}); setDone(false); window.scrollTo(0, 0); };
  const home = () => { setActiveId(null); setChecked({}); setDone(false); window.scrollTo(0, 0); };

  const complete = async () => {
    const idx = WORKOUTS.findIndex((w) => w.id === activeId);
    const nextIndex = (idx + 1) % WORKOUTS.length;
    const dtw = progress.doneThisWeek.includes(activeId)
      ? progress.doneThisWeek
      : [...progress.doneThisWeek, activeId];
    await persist({
      currentIndex: nextIndex,
      totalSessions: progress.totalSessions + 1,
      weekKey: getWeekKey(),
      doneThisWeek: dtw,
    });
    setDone(true);
    window.scrollTo(0, 0);
  };

  const reset = async () => { setChecked({}); await persist({ ...DEFAULT, weekKey: getWeekKey() }); };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50 text-slate-400 font-medium">
        Loading your week…
      </div>
    );
  }

  const active = WORKOUTS.find((w) => w.id === activeId);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-rose-50 via-fuchsia-50 to-violet-50 text-slate-800">
      <div className="max-w-md mx-auto px-5 py-8 pb-16">
        {!active ? (
          <Dashboard progress={progress} onOpen={open} onReset={reset} />
        ) : (
          <WorkoutView
            w={active}
            checked={checked}
            setChecked={setChecked}
            done={done}
            onComplete={complete}
            onBack={home}
            progress={progress}
          />
        )}
      </div>
    </div>
  );
}

function CycleLoop({ currentId }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {WORKOUTS.map((w, i) => (
        <div key={w.id} className="flex items-center gap-2">
          <div
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
              w.id === currentId ? `${w.dot} text-white shadow-sm` : "bg-white/70 text-slate-400"
            }`}
          >
            {w.name.split(" ")[0]}
          </div>
          {i < WORKOUTS.length - 1 && <ArrowRight size={14} className="text-slate-300" />}
        </div>
      ))}
    </div>
  );
}

function Dashboard({ progress, onOpen, onReset }) {
  const next = WORKOUTS[progress.currentIndex];
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <div className="bg-fuchsia-600 text-white w-9 h-9 rounded-2xl flex items-center justify-center">
          <Dumbbell size={18} />
        </div>
        <h1 className="text-2xl font-black tracking-tight">Move Weekly</h1>
      </div>
      <p className="text-slate-500 text-sm mb-6 ml-1">3 sessions a week, in any order that fits your life.</p>

      <CycleLoop currentId={next.id} />

      {/* Next up hero */}
      <div className={`rounded-3xl p-6 mb-5 bg-white shadow-sm ring-4 ${next.ring}`}>
        <div className="flex items-center gap-2 mb-2">
          <span className={`w-2.5 h-2.5 rounded-full ${next.dot}`} />
          <span className="text-xs font-bold uppercase tracking-wide text-slate-400">Next up</span>
        </div>
        <h2 className="text-3xl font-black tracking-tight mb-1">{next.name}</h2>
        <p className="text-slate-500 text-sm mb-1">{next.focus}</p>
        <p className="text-slate-400 text-xs mb-5">≈ 45 minutes · {next.exercises.length} moves</p>
        <button
          onClick={() => onOpen(next.id)}
          className={`w-full ${next.btn} text-white font-bold py-4 rounded-2xl transition active:scale-[0.98] flex items-center justify-center gap-2`}
        >
          Start workout <ArrowRight size={18} />
        </button>
      </div>

      {/* Pick any (flexibility) */}
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-2 ml-1">Or pick any day</p>
      <div className="space-y-2 mb-6">
        {WORKOUTS.map((w) => {
          const doneThisWeek = progress.doneThisWeek.includes(w.id);
          return (
            <button
              key={w.id}
              onClick={() => onOpen(w.id)}
              className="w-full bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm active:scale-[0.99] transition text-left"
            >
              <span className={`w-10 h-10 rounded-xl ${w.soft} ${w.text} flex items-center justify-center font-black`}>
                {w.name.split(" ")[0][0]}
              </span>
              <div className="flex-1">
                <div className="font-bold leading-tight">{w.name}</div>
                <div className="text-xs text-slate-400">{w.focus}</div>
              </div>
              {doneThisWeek && (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <Check size={14} /> done
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* This week */}
      <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold flex items-center gap-1.5">
            <Flame size={16} className="text-fuchsia-500" /> This week
          </span>
          <span className="text-xs text-slate-400">{progress.doneThisWeek.length} of 3</span>
        </div>
        <div className="flex gap-2">
          {WORKOUTS.map((w) => (
            <div
              key={w.id}
              className={`flex-1 h-2.5 rounded-full ${progress.doneThisWeek.includes(w.id) ? w.dot : "bg-slate-100"}`}
            />
          ))}
        </div>
        {progress.totalSessions > 0 && (
          <p className="text-xs text-slate-400 mt-3">{progress.totalSessions} workouts done all-time 💪</p>
        )}
      </div>

      {/* Tips */}
      <div className="bg-white/70 rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-1.5 mb-2 text-sm font-bold text-slate-600">
          <Info size={15} /> A few things worth knowing
        </div>
        <ul className="space-y-1.5">
          {TIPS.map((t, i) => (
            <li key={i} className="text-xs text-slate-500 flex gap-2">
              <span className="text-fuchsia-400 font-bold">·</span> {t}
            </li>
          ))}
        </ul>
      </div>

      <button onClick={onReset} className="text-xs text-slate-400 flex items-center gap-1 mx-auto mt-2 hover:text-slate-600">
        <RotateCcw size={12} /> Reset the week
      </button>
    </div>
  );
}

function CheckRow({ label, sub, cue, done, onToggle }) {
  return (
    <button onClick={onToggle} className="w-full flex items-start gap-3 py-3 text-left active:opacity-70 transition">
      <span
        className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition ${
          done ? "bg-emerald-500 text-white" : "bg-slate-100 text-transparent"
        }`}
      >
        <Check size={15} strokeWidth={3} />
      </span>
      <div className="flex-1">
        <div className={`font-semibold leading-tight ${done ? "line-through text-slate-400" : ""}`}>
          {label} {sub && <span className="text-slate-400 font-medium">· {sub}</span>}
        </div>
        {cue && <div className="text-xs text-slate-400 mt-0.5">{cue}</div>}
      </div>
    </button>
  );
}

function WorkoutView({ w, checked, setChecked, done, onComplete, onBack, progress }) {
  const toggle = (k) => setChecked((c) => ({ ...c, [k]: !c[k] }));

  if (done) {
    const nextName = WORKOUTS[progress.currentIndex].name;
    return (
      <div className="pt-10 text-center">
        <div className={`w-20 h-20 ${w.soft} ${w.text} rounded-3xl flex items-center justify-center mx-auto mb-5`}>
          <PartyPopper size={34} />
        </div>
        <h2 className="text-2xl font-black mb-2">Nice work!</h2>
        <p className="text-slate-500 mb-1">{w.name} done and logged.</p>
        <p className="text-slate-400 text-sm mb-8">Whenever you're ready next, you're up for <span className="font-semibold text-slate-600">{nextName}</span>.</p>
        <button onClick={onBack} className="w-full bg-slate-800 text-white font-bold py-4 rounded-2xl active:scale-[0.98] transition">
          Back to home
        </button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1 text-slate-400 text-sm mb-4 hover:text-slate-600">
        <ChevronLeft size={16} /> Home
      </button>

      <div className="flex items-center gap-2 mb-1">
        <span className={`w-3 h-3 rounded-full ${w.dot}`} />
        <span className="text-xs font-bold uppercase tracking-wide text-slate-400">{w.focus}</span>
      </div>
      <h1 className="text-3xl font-black tracking-tight mb-6">{w.name}</h1>

      <Section title="Warm up" note="~5 min">
        {w.warmup.map((item, i) => (
          <CheckRow key={`wu${i}`} label={item} done={!!checked[`wu${i}`]} onToggle={() => toggle(`wu${i}`)} />
        ))}
      </Section>

      <Section title="Workout" note="rest 45–60 sec between sets">
        {w.exercises.map((ex, i) => (
          <CheckRow
            key={`ex${i}`}
            label={ex.name}
            sub={`${ex.sets} × ${ex.reps}`}
            cue={ex.cue}
            done={!!checked[`ex${i}`]}
            onToggle={() => toggle(`ex${i}`)}
          />
        ))}
      </Section>

      <Section title="Cool down" note="~5 min">
        {w.cooldown.map((item, i) => (
          <CheckRow key={`cd${i}`} label={item} done={!!checked[`cd${i}`]} onToggle={() => toggle(`cd${i}`)} />
        ))}
      </Section>

      <button
        onClick={onComplete}
        className={`w-full ${w.btn} text-white font-bold py-4 rounded-2xl mt-4 active:scale-[0.98] transition flex items-center justify-center gap-2`}
      >
        <Check size={18} strokeWidth={3} /> Mark workout complete
      </button>
    </div>
  );
}

function Section({ title, note, children }) {
  return (
    <div className="bg-white rounded-3xl p-5 mb-3 shadow-sm">
      <div className="flex items-baseline justify-between mb-1">
        <h3 className="font-black text-lg">{title}</h3>
        <span className="text-xs text-slate-400">{note}</span>
      </div>
      <div className="divide-y divide-slate-50">{children}</div>
    </div>
  );
}
