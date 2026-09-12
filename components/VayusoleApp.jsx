"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, Play, Pause, RotateCcw, AlertTriangle, Droplet, Clock } from "lucide-react";

/* ---------- Design tokens ----------
  ink:      #10262B  (deep spa teal, primary background)
  paper:    #F1E7D3  (warm parchment, card surface)
  ember:    #C8763B  (signature accent — turmeric/marigold, ties to Indian herbal materials)
  zones:    amber #D69A3C (head/sinus) · jade #4E8B78 (chest/lung) ·
            rust #C1583B (digestive) · steel #3D6E8C (spine/back) ·
            plum #8A5E96 (pelvic/reproductive) · slate #5B7A8C (circulation)
  display:  Fraunces (headlines — has the slightly clinical/diagrammatic serif weight)
  body:     IBM Plex Sans
  mono:     IBM Plex Mono (point codes, timer, data)
------------------------------------ */

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap');`;

const ZONES = {
  head: "#D69A3C",
  chest: "#4E8B78",
  digestive: "#C1583B",
  spine: "#3D6E8C",
  pelvic: "#8A5E96",
  circulation: "#5B7A8C",
};

// Point map — coordinates are illustrative/diagrammatic, not anatomically exact.
// viewBox 0 0 300 520, foot pointing up (toes at top), sole view.
const POINTS = {
  solarPlexus: { name: "Solar Plexus", code: "RF-01", x: 150, y: 195, zone: "digestive" },
  head: { name: "Head / Brain", code: "RF-02", x: 118, y: 55, zone: "head" },
  sinus: { name: "Sinus", code: "RF-03", x: 150, y: 65, zone: "head" },
  pituitary: { name: "Pituitary", code: "RF-04", x: 150, y: 78, zone: "head" },
  lung: { name: "Lung / Chest", code: "RF-05", x: 175, y: 165, zone: "chest" },
  heart: { name: "Heart", code: "RF-06", x: 185, y: 155, zone: "chest" },
  spine: { name: "Spine", code: "RF-07", x: 90, y: 260, zone: "spine" },
  lowerBack: { name: "Lower Back", code: "RF-08", x: 90, y: 330, zone: "spine" },
  kidney: { name: "Kidney", code: "RF-09", x: 140, y: 230, zone: "digestive" },
  intestine: { name: "Intestines", code: "RF-10", x: 145, y: 300, zone: "digestive" },
  sciatic: { name: "Sciatic Nerve", code: "RF-11", x: 110, y: 400, zone: "spine" },
  pelvic: { name: "Pelvic / Uterus", code: "RF-12", x: 200, y: 420, zone: "pelvic" },
  lymphatic: { name: "Lymphatic", code: "RF-13", x: 90, y: 110, zone: "circulation" },
  diaphragm: { name: "Diaphragm", code: "RF-14", x: 150, y: 175, zone: "digestive" },
};

const PROBLEMS = [
  {
    id: "stress",
    label: "Stress & Anxiety",
    points: ["solarPlexus", "head", "diaphragm"],
    grade: "C",
    duration: 300,
    steps: [
      "Sit comfortably, foot resting on opposite knee.",
      "Thumb-walk slowly into the Solar Plexus point, hold 5 seconds, release.",
      "Move to the Head point at the big toe pad — small circular pressure.",
      "Finish with 3 slow breaths, pressing the Diaphragm line across the ball of the foot.",
    ],
    remedy: {
      name: "Lavender foot soak",
      detail: "4–5 drops lavender oil in warm water, 10 min soak before or after.",
      grade: "D",
    },
    safety: "Skip if you have a fever or open wound on the foot.",
  },
  {
    id: "headache",
    label: "Headache / Tension",
    points: ["head", "sinus", "pituitary"],
    grade: "C",
    duration: 240,
    steps: [
      "Apply firm, steady pressure to the Head point for 30 seconds.",
      "Walk thumb along the base of all toes (Sinus line), toe by toe.",
      "Hold the Pituitary point at the center of the big toe for 20 seconds.",
    ],
    remedy: {
      name: "Peppermint temple + foot combo",
      detail: "Diluted peppermint oil on temples; cool water foot rinse.",
      grade: "D",
    },
    safety: "Seek care for sudden, severe, or worsening headaches — this is not a substitute.",
  },
  {
    id: "sleep",
    label: "Poor Sleep",
    points: ["solarPlexus", "pituitary", "diaphragm"],
    grade: "C",
    duration: 420,
    steps: [
      "Dim the lights. Begin with slow effleurage strokes across the whole sole.",
      "Hold Solar Plexus for 1 minute with steady breathing.",
      "Press Pituitary point gently for 30 seconds.",
      "Close with long strokes from heel to toe, 10 repeats.",
    ],
    remedy: {
      name: "Magnesium cream + chamomile",
      detail: "Magnesium cream massaged into soles before bed.",
      grade: "C",
    },
    safety: "Consult a doctor if insomnia persists beyond 2–3 weeks.",
  },
  {
    id: "tiredfeet",
    label: "Tired / Achy Feet",
    points: ["lymphatic", "spine", "lowerBack"],
    grade: "D",
    duration: 300,
    steps: [
      "Roll a tennis ball or reflexology stick along the full arch, both feet.",
      "Thumb-walk the Lymphatic zone below the ankle bone.",
      "Squeeze and rotate each toe individually.",
    ],
    remedy: {
      name: "Epsom salt soak",
      detail: "2 cups Epsom salt in warm water, soak 15 minutes.",
      grade: "C",
    },
    safety: "Avoid if you have diabetes-related neuropathy without medical guidance.",
  },
  {
    id: "digestion",
    label: "Digestive Discomfort",
    points: ["solarPlexus", "intestine", "diaphragm"],
    grade: "C",
    duration: 300,
    steps: [
      "Press Solar Plexus, hold 5 seconds, release. Repeat 5 times.",
      "Thumb-walk the Intestine zone across the mid-arch in small circles.",
      "Finish with Diaphragm line pressure, 3 slow breaths.",
    ],
    remedy: {
      name: "Ginger tea + warm compress",
      detail: "Warm ginger tea alongside a warm towel compress on the arch.",
      grade: "D",
    },
    safety: "See a doctor for persistent or severe abdominal pain.",
  },
  {
    id: "backpain",
    label: "Lower Back Pain",
    points: ["spine", "lowerBack", "sciatic"],
    grade: "C",
    duration: 360,
    steps: [
      "Thumb-walk the Spine reflex along the inner edge of the foot, heel to toe.",
      "Hold Lower Back point firmly for 30 seconds.",
      "Sweep along the Sciatic line on the heel pad, both directions.",
    ],
    remedy: {
      name: "Arnica gel",
      detail: "Light arnica gel massage on lower back after the session.",
      grade: "C",
    },
    safety: "Avoid deep pressure if pain is from a recent injury — see a doctor first.",
  },
  {
    id: "circulation",
    label: "Poor Circulation / Cold Feet",
    points: ["lymphatic", "heart", "lung"],
    grade: "D",
    duration: 300,
    steps: [
      "Warm the feet first with a brief rub between both palms.",
      "Thumb-walk the Lymphatic zone, both feet, 1 minute each.",
      "Light pressure on Heart and Lung points, 20 seconds each.",
    ],
    remedy: {
      name: "Warm mustard foot bath",
      detail: "1 tbsp mustard powder in warm water, soak 10 minutes.",
      grade: "D",
    },
    safety: "Consult a doctor if cold feet are sudden, one-sided, or with numbness.",
  },
  {
    id: "cramps",
    label: "Menstrual Cramps",
    points: ["pelvic", "lowerBack", "solarPlexus"],
    grade: "C",
    duration: 300,
    steps: [
      "Hold the Pelvic point with steady pressure for 1 minute.",
      "Thumb-walk Lower Back in small circles.",
      "Finish with Solar Plexus hold and slow breathing.",
    ],
    remedy: {
      name: "Warm castor oil pack",
      detail: "Warm compress on lower abdomen alongside the session.",
      grade: "C",
    },
    safety: "Seek care for pain that's severe, sudden, or unlike your usual pattern.",
  },
  {
    id: "sinus",
    label: "Sinus Congestion",
    points: ["sinus", "head", "lung"],
    grade: "D",
    duration: 240,
    steps: [
      "Walk thumb along the base of each toe, one at a time.",
      "Pinch and hold each toe tip for 5 seconds (sinus reflex).",
      "Finish with light pressure on the Lung zone for open breathing.",
    ],
    remedy: {
      name: "Eucalyptus steam",
      detail: "3 drops eucalyptus oil in steaming water, inhale 5 minutes.",
      grade: "D",
    },
    safety: "See a doctor if congestion is with high fever or lasts over 10 days.",
  },
  {
    id: "muscle",
    label: "Muscle Tension",
    points: ["spine", "diaphragm", "lymphatic"],
    grade: "C",
    duration: 300,
    steps: [
      "Long, firm strokes from heel to toe across the whole sole, 8 reps.",
      "Thumb-walk the Spine reflex slowly.",
      "Finish with Diaphragm point pressure and 3 deep breaths.",
    ],
    remedy: {
      name: "Capsaicin or menthol rub",
      detail: "Light application to calves post-session, not directly on reflex points.",
      grade: "C",
    },
    safety: "Avoid capsaicin on broken skin; wash hands after applying.",
  },
];

const HISTORY = [
  {
    era: "c. 2330 BCE",
    title: "The Physician's Tomb, Egypt",
    text: "In Saqqara, a carved relief on the tomb of Ankhmahor — an Egyptian physician — shows two figures working on a patient's hands and feet. It's the earliest surviving evidence we have of pressure-point foot therapy, though no one recorded exactly why it was done.",
  },
  {
    era: "c. 4000 years ago",
    title: "Foot therapy in ancient China",
    text: "Alongside acupuncture and meridian theory, Chinese medicine developed zu liao fa — foot therapy — built on the idea that the feet hold a map of the body's internal organs, connected by channels of energy.",
  },
  {
    era: "Long practiced",
    title: "Cherokee and other Indigenous traditions",
    text: "Separately, some Native American communities, including Cherokee healers, practiced their own forms of foot therapy passed down orally through generations — a reminder that this idea arose independently in more than one place.",
  },
  {
    era: "1915",
    title: "Dr. William Fitzgerald's zone therapy",
    text: "An American ear-nose-throat physician proposed that the body could be divided into ten vertical zones running from the toes to the head, and that pressure on one part of a zone could influence the rest of it. He called it zone therapy — the direct ancestor of modern reflexology.",
  },
  {
    era: "1930s–40s",
    title: "Eunice Ingham maps the feet",
    text: "A physiotherapist, Ingham refined Fitzgerald's zones into the detailed foot maps still used today, matching specific points to specific organs. She spent decades traveling the US teaching the technique and is often called the mother of modern reflexology.",
  },
  {
    era: "1960s–today",
    title: "A global, complementary practice",
    text: "Reflexology spread worldwide as a relaxation and complementary wellness practice, sitting alongside — never replacing — conventional medicine. Modern research on it remains limited and mixed, which is why this app labels every claim by its evidence level.",
  },
];

function HistoryView() {
  return (
    <div className="px-5 pt-8 pb-10">
      <p
        className="text-xs tracking-widest uppercase mb-1"
        style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#C8763B" }}
      >
        Origins
      </p>
      <h1
        className="text-3xl mb-3 leading-tight"
        style={{ fontFamily: "'Fraunces', serif", color: "#F1E7D3", fontWeight: 600 }}
      >
        Four thousand years of paying attention to feet
      </h1>
      <p
        className="text-sm mb-8 leading-relaxed"
        style={{ color: "rgba(241,231,211,0.65)", fontFamily: "'IBM Plex Sans', sans-serif" }}
      >
        Long before anyone could explain why it might work, people across unconnected
        civilizations arrived at the same instinct: press the foot, and something
        elsewhere in the body responds. Here's the honest, evidence-labeled version of
        that story.
      </p>

      <div className="relative pl-6">
        <div
          className="absolute left-[7px] top-2 bottom-2 w-px"
          style={{ background: "rgba(241,231,211,0.15)" }}
        />
        {HISTORY.map((h, i) => (
          <div key={i} className="relative mb-7 last:mb-0">
            <div
              className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full"
              style={{ background: "#C8763B", border: "3px solid #10262B" }}
            />
            <p
              className="text-xs mb-1"
              style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#C8763B" }}
            >
              {h.era}
            </p>
            <h3
              className="text-lg mb-1.5"
              style={{ fontFamily: "'Fraunces', serif", color: "#F1E7D3", fontWeight: 600 }}
            >
              {h.title}
            </h3>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "rgba(241,231,211,0.7)", fontFamily: "'IBM Plex Sans', sans-serif" }}
            >
              {h.text}
            </p>
          </div>
        ))}
      </div>

      <div
        className="rounded-2xl p-4 mt-2"
        style={{ background: "rgba(241,231,211,0.08)", border: "1px solid rgba(241,231,211,0.15)" }}
      >
        <p
          className="text-xs leading-relaxed"
          style={{ color: "rgba(241,231,211,0.6)", fontFamily: "'IBM Plex Sans', sans-serif" }}
        >
          Reflexology is a complementary practice, not a diagnosis or a cure. Its long
          history explains why people keep returning to it — not proof of a clinical
          effect. We label every point and remedy by evidence level so you can judge
          for yourself.
        </p>
      </div>
    </div>
  );
}

const GRADE_LABEL = {
  A: "Strong evidence",
  B: "Moderate evidence",
  C: "Mixed / small studies",
  D: "Traditional use only",
};

function GradeBadge({ grade }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs"
      style={{
        fontFamily: "'IBM Plex Mono', monospace",
        background: "rgba(241,231,211,0.12)",
        color: "#F1E7D3",
        border: "1px solid rgba(241,231,211,0.25)",
      }}
    >
      EVIDENCE {grade} · {GRADE_LABEL[grade]}
    </span>
  );
}

function FootMap({ activeIds }) {
  return (
    <svg viewBox="0 0 300 520" className="w-full max-w-[220px] mx-auto">
      {/* stylized sole outline */}
      <path
        d="M150 10
           C 100 10 85 55 90 100
           C 94 140 70 160 65 210
           C 60 270 55 320 60 370
           C 65 430 90 480 130 500
           C 150 510 165 508 185 495
           C 225 470 240 420 235 360
           C 232 320 245 260 240 210
           C 236 160 210 140 210 100
           C 212 55 200 10 150 10 Z"
        fill="#1A3A40"
        stroke="rgba(241,231,211,0.35)"
        strokeWidth="1.5"
      />
      {/* toe separators, decorative */}
      {[110, 130, 150, 170, 190].map((x, i) => (
        <line key={i} x1={x} y1="8" x2={x} y2="42" stroke="rgba(241,231,211,0.15)" strokeWidth="2" />
      ))}
      {Object.entries(POINTS).map(([key, p]) => {
        const active = activeIds.includes(key);
        return (
          <g key={key}>
            {active && (
              <circle cx={p.x} cy={p.y} r="14" fill={ZONES[p.zone]} opacity="0.25">
                <animate attributeName="r" values="10;18;10" dur="2.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.35;0.08;0.35" dur="2.2s" repeatCount="indefinite" />
              </circle>
            )}
            <circle
              cx={p.x}
              cy={p.y}
              r={active ? 7 : 4}
              fill={active ? ZONES[p.zone] : "rgba(241,231,211,0.3)"}
              stroke={active ? "#F1E7D3" : "none"}
              strokeWidth="1.5"
            />
          </g>
        );
      })}
    </svg>
  );
}

function ProblemPicker({ onSelect, sessions }) {
  return (
    <div className="px-5 pt-8 pb-6">
      {sessions.length > 0 && (
        <div
          className="rounded-2xl p-4 mb-6 flex items-center justify-between"
          style={{ background: "rgba(200,118,59,0.15)", border: "1px solid rgba(200,118,59,0.35)" }}
        >
          <div>
            <p className="text-xs mb-1" style={{ color: "rgba(241,231,211,0.6)", fontFamily: "'IBM Plex Sans', sans-serif" }}>
              Sessions completed
            </p>
            <p className="text-2xl" style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#F1E7D3" }}>
              {sessions.length}
            </p>
          </div>
          <p className="text-xs text-right max-w-[45%] leading-relaxed" style={{ color: "rgba(241,231,211,0.5)", fontFamily: "'IBM Plex Sans', sans-serif" }}>
            Last: {sessions[sessions.length - 1]}
          </p>
        </div>
      )}
      <p
        className="text-xs tracking-widest uppercase mb-1"
        style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#C8763B" }}
      >
        Vayusole
      </p>
      <h1
        className="text-3xl mb-2 leading-tight"
        style={{ fontFamily: "'Fraunces', serif", color: "#F1E7D3", fontWeight: 600 }}
      >
        What's bothering you today?
      </h1>
      <p className="text-sm mb-6" style={{ color: "rgba(241,231,211,0.6)", fontFamily: "'IBM Plex Sans', sans-serif" }}>
        Pick one — you'll get a guided reflexology protocol and a complementary remedy.
      </p>
      <div className="grid grid-cols-2 gap-3">
        {PROBLEMS.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelect(p)}
            className="text-left rounded-2xl p-4 transition-transform active:scale-95"
            style={{ background: "#F1E7D3", color: "#10262B" }}
          >
            <div
              className="w-2 h-2 rounded-full mb-3"
              style={{ background: ZONES[POINTS[p.points[0]].zone] }}
            />
            <p className="text-sm font-medium leading-snug" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
              {p.label}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

function ProtocolView({ problem, onBack, onComplete }) {
  const [seconds, setSeconds] = useState(problem.duration);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running && seconds > 0) {
      intervalRef.current = setInterval(() => setSeconds((s) => s - 1), 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, seconds]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const activeZones = [...new Set(problem.points.map((id) => POINTS[id].zone))];

  return (
    <div className="px-5 pt-6 pb-10">
      <button
        onClick={onBack}
        className="flex items-center gap-1 mb-4 text-sm"
        style={{ color: "rgba(241,231,211,0.7)", fontFamily: "'IBM Plex Sans', sans-serif" }}
      >
        <ChevronLeft size={16} /> Back
      </button>

      <h2
        className="text-2xl mb-2"
        style={{ fontFamily: "'Fraunces', serif", color: "#F1E7D3", fontWeight: 600 }}
      >
        {problem.label}
      </h2>
      <div className="mb-5">
        <GradeBadge grade={problem.grade} />
      </div>

      <FootMap activeIds={problem.points} />

      {/* legend */}
      <div className="flex flex-wrap gap-3 justify-center mt-3 mb-6">
        {problem.points.map((id) => (
          <div key={id} className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(241,231,211,0.75)", fontFamily: "'IBM Plex Sans', sans-serif" }}>
            <span className="w-2 h-2 rounded-full" style={{ background: ZONES[POINTS[id].zone] }} />
            {POINTS[id].name}
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", opacity: 0.5 }}>{POINTS[id].code}</span>
          </div>
        ))}
      </div>

      {/* timer */}
      <div
        className="rounded-2xl p-5 mb-5 flex items-center justify-between"
        style={{ background: "rgba(241,231,211,0.08)", border: "1px solid rgba(241,231,211,0.15)" }}
      >
        <div>
          <p className="text-xs mb-1 flex items-center gap-1" style={{ color: "rgba(241,231,211,0.5)", fontFamily: "'IBM Plex Sans', sans-serif" }}>
            <Clock size={12} /> Session timer
          </p>
          <p className="text-3xl" style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#F1E7D3" }}>
            {mm}:{ss}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setRunning((r) => !r)}
            className="w-11 h-11 rounded-full flex items-center justify-center"
            style={{ background: "#C8763B", color: "#10262B" }}
          >
            {running ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button
            onClick={() => {
              setSeconds(problem.duration);
              setRunning(false);
            }}
            className="w-11 h-11 rounded-full flex items-center justify-center"
            style={{ background: "rgba(241,231,211,0.1)", color: "#F1E7D3" }}
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* steps */}
      <h3 className="text-sm uppercase tracking-wide mb-3" style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#C8763B" }}>
        Guided steps
      </h3>
      <ol className="space-y-3 mb-6">
        {problem.steps.map((s, i) => (
          <li key={i} className="flex gap-3 text-sm" style={{ color: "#F1E7D3", fontFamily: "'IBM Plex Sans', sans-serif" }}>
            <span
              className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs"
              style={{ background: "rgba(241,231,211,0.12)", fontFamily: "'IBM Plex Mono', monospace" }}
            >
              {i + 1}
            </span>
            <span className="pt-0.5 leading-relaxed">{s}</span>
          </li>
        ))}
      </ol>

      {/* remedy card */}
      <div className="rounded-2xl p-4 mb-4" style={{ background: "#F1E7D3" }}>
        <div className="flex items-center gap-2 mb-2">
          <Droplet size={16} color="#C8763B" />
          <p className="text-sm font-medium" style={{ color: "#10262B", fontFamily: "'IBM Plex Sans', sans-serif" }}>
            {problem.remedy.name}
          </p>
        </div>
        <p className="text-xs mb-2 leading-relaxed" style={{ color: "#3A342A", fontFamily: "'IBM Plex Sans', sans-serif" }}>
          {problem.remedy.detail}
        </p>
        <span
          className="text-[10px] px-2 py-0.5 rounded-full"
          style={{ background: "rgba(16,38,43,0.08)", color: "#10262B", fontFamily: "'IBM Plex Mono', monospace" }}
        >
          EVIDENCE {problem.remedy.grade} · {GRADE_LABEL[problem.remedy.grade]}
        </span>
      </div>

      {/* safety */}
      <div className="flex gap-2 p-3 rounded-xl" style={{ background: "rgba(193,88,59,0.15)", border: "1px solid rgba(193,88,59,0.3)" }}>
        <AlertTriangle size={16} color="#E08A6B" className="flex-shrink-0 mt-0.5" />
        <p className="text-xs leading-relaxed" style={{ color: "#F1E7D3", fontFamily: "'IBM Plex Sans', sans-serif" }}>
          {problem.safety}
        </p>
      </div>

      <button
        onClick={() => {
          onComplete(problem.label);
          onBack();
        }}
        className="w-full rounded-2xl py-4 mt-5 text-sm font-medium transition-transform active:scale-95"
        style={{ background: "#C8763B", color: "#10262B", fontFamily: "'IBM Plex Sans', sans-serif" }}
      >
        Mark session complete
      </button>

      <p className="text-[11px] text-center mt-6" style={{ color: "rgba(241,231,211,0.35)", fontFamily: "'IBM Plex Sans', sans-serif" }}>
        Educational content only, not medical advice. Consult a healthcare provider for persistent or severe symptoms.
      </p>
    </div>
  );
}

const TECHNIQUES = [
  {
    name: "Thumb Walking",
    tool: "Hands only",
    text: "Bend the thumb at the first joint and 'walk' it forward in small, caterpillar-like steps across the point — bend, press, straighten, advance. The most common reflexology movement.",
  },
  {
    name: "Finger Walking",
    tool: "Hands only",
    text: "Same walking motion as the thumb, but with the index finger — used on smaller or more sensitive areas like between the toes.",
  },
  {
    name: "Hook and Backup",
    tool: "Hands only",
    text: "Hook the thumb into a point, apply steady pressure, then pull back slightly while maintaining contact. Used for smaller, harder-to-reach reflex points like the pituitary.",
  },
  {
    name: "Press and Rotate",
    tool: "Hands only",
    text: "Press firmly into a point and rotate the thumb in small circles, either direction. Good for larger areas like the solar plexus.",
  },
  {
    name: "Effleurage (warm-up strokes)",
    tool: "Hands only",
    text: "Long, gliding strokes across the whole sole using the flat of the hand. Always start and end a session with this to relax the foot before and after point work.",
  },
];

const TOOLS = [
  {
    name: "Wooden Reflexology Stick",
    text: "A rounded wooden probe for precise pressure on a single point when fingers tire. Never force it — the point should feel like firm pressure, not sharp pain.",
    caution: "Go gently; wood concentrates pressure more than a thumb does.",
  },
  {
    name: "Reflexology Roller / Foot Roller",
    text: "A ridged wooden or plastic roller you roll the sole across, seated. Good for a quick daily routine when a full hand session isn't practical.",
    caution: "Fine for daily light use; avoid if there's any foot injury or open skin.",
  },
  {
    name: "Spiky Massage Ball",
    text: "A textured rubber ball rolled under the foot to stimulate broad areas rather than single points — often used before or after targeted work.",
    caution: "Start with light body weight; too much pressure too fast can bruise.",
  },
  {
    name: "Acupressure Mat",
    text: "A mat covered in small plastic points, stood or sat on for a few minutes to stimulate the whole sole at once — a passive, full-foot alternative to hands-on work.",
    caution: "Use for short sessions first (2–3 min) to build tolerance.",
  },
];

function TechniquesView() {
  return (
    <div className="px-5 pt-8 pb-10">
      <p
        className="text-xs tracking-widest uppercase mb-1"
        style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#C8763B" }}
      >
        How it's done
      </p>
      <h1
        className="text-3xl mb-2 leading-tight"
        style={{ fontFamily: "'Fraunces', serif", color: "#F1E7D3", fontWeight: 600 }}
      >
        Techniques & tools
      </h1>
      <p
        className="text-sm mb-7 leading-relaxed"
        style={{ color: "rgba(241,231,211,0.65)", fontFamily: "'IBM Plex Sans', sans-serif" }}
      >
        Every protocol in this app uses these five hand movements. Tools are optional —
        helpful when your hands tire, never required.
      </p>

      <h3
        className="text-sm uppercase tracking-wide mb-3"
        style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#C8763B" }}
      >
        Hand techniques
      </h3>
      <div className="space-y-3 mb-8">
        {TECHNIQUES.map((t, i) => (
          <div key={i} className="rounded-2xl p-4" style={{ background: "#F1E7D3" }}>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-sm font-medium" style={{ color: "#10262B", fontFamily: "'IBM Plex Sans', sans-serif" }}>
                {t.name}
              </p>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full"
                style={{ background: "rgba(16,38,43,0.08)", color: "#10262B", fontFamily: "'IBM Plex Mono', monospace" }}
              >
                {t.tool}
              </span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "#3A342A", fontFamily: "'IBM Plex Sans', sans-serif" }}>
              {t.text}
            </p>
          </div>
        ))}
      </div>

      <h3
        className="text-sm uppercase tracking-wide mb-3"
        style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#C8763B" }}
      >
        Optional tools
      </h3>
      <div className="space-y-3">
        {TOOLS.map((t, i) => (
          <div
            key={i}
            className="rounded-2xl p-4"
            style={{ background: "rgba(241,231,211,0.08)", border: "1px solid rgba(241,231,211,0.15)" }}
          >
            <p className="text-sm font-medium mb-1.5" style={{ color: "#F1E7D3", fontFamily: "'IBM Plex Sans', sans-serif" }}>
              {t.name}
            </p>
            <p className="text-xs leading-relaxed mb-2" style={{ color: "rgba(241,231,211,0.65)", fontFamily: "'IBM Plex Sans', sans-serif" }}>
              {t.text}
            </p>
            <div className="flex gap-1.5 items-start">
              <AlertTriangle size={12} color="#E08A6B" className="flex-shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed" style={{ color: "#E08A6B", fontFamily: "'IBM Plex Sans', sans-serif" }}>
                {t.caution}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const CITATIONS = [
  {
    ref: "Wang M-Y et al., 2008",
    journal: "Journal of Advanced Nursing",
    finding:
      "Reviewed controlled trials across all conditions. Found no evidence of a specific effect of reflexology in any condition, except urinary symptoms in multiple sclerosis. Concluded routine provision is not recommended.",
    weight: "Core negative review",
  },
  {
    ref: "Ernst E et al., 2011",
    journal: "Maturitas",
    finding:
      "Updated review of randomised clinical trials. Concluded the best clinical evidence does not convincingly demonstrate reflexology to be an effective treatment for any medical condition.",
    weight: "Update, same conclusion",
  },
  {
    ref: "Ernst E, 2009 (RCT review)",
    journal: "DARE / NCBI",
    finding:
      "Of 18 trials: 5 suggested positive effects, 12 found no effectiveness, 1 unclear. Methodological quality generally poor. The two largest trials reported negative or no effects.",
    weight: "Larger trials fared worse",
  },
  {
    ref: "McCullough J et al., 2014",
    journal: "Evid Based Complement Alternat Med",
    finding:
      "17 RCTs, 34 physiological outcome measures. Only 3 studies (blood pressure, cardiac index, salivary amylase) showed significant between-group changes favouring reflexology. Overall quality low.",
    weight: "Physiological outcomes",
  },
  {
    ref: "Meta-analysis, cardiac surgery",
    journal: "Cited in systematic review",
    finding:
      "Reflexology significantly reduced anxiety in open-heart surgery patients (g = −1.49). Authors caution that significant heterogeneity between studies limits confidence.",
    weight: "Strongest positive signal",
  },
  {
    ref: "Australian Dept of Health, 2024",
    journal: "Natural Therapies Review (PROSPERO CRD42023394291)",
    finding:
      "Government-commissioned evidence evaluation conducted by Cochrane Australia using GRADE methodology. The most current comprehensive assessment available.",
    weight: "Most recent",
  },
  {
    ref: "Oncology review, 2023",
    journal: "PMC10782728",
    finding:
      "26 studies, 2,465 cancer patients. Outcomes (pain, quality of life, anxiety, fatigue) were heterogeneous — some studies showed significant improvement, others none. Study quality moderate to low.",
    weight: "Mixed, larger population",
  },
];

const CASE_TEMPLATE = [
  "Age range and general context (no identifying details)",
  "What they came in with, in their own words",
  "What else was happening — medication, rest, physiotherapy, time elapsed",
  "Number of sessions and over what period",
  "What changed, and what didn't",
  "Practitioner's own note on confounding factors",
  "Written consent on file",
];

function EvidenceView() {
  return (
    <div className="px-5 pt-8 pb-10">
      <p
        className="text-xs tracking-widest uppercase mb-1"
        style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#C8763B" }}
      >
        Where we stand
      </p>
      <h1
        className="text-3xl mb-3 leading-tight"
        style={{ fontFamily: "'Fraunces', serif", color: "#F1E7D3", fontWeight: 600 }}
      >
        What the research actually shows
      </h1>
      <p
        className="text-sm mb-7 leading-relaxed"
        style={{ color: "rgba(241,231,211,0.65)", fontFamily: "'IBM Plex Sans', sans-serif" }}
      >
        We publish the unflattering findings alongside the promising ones. If you're
        deciding whether this is worth your time, you deserve the whole picture — not
        the half that sells.
      </p>

      <div
        className="rounded-2xl p-4 mb-7"
        style={{ background: "rgba(193,88,59,0.15)", border: "1px solid rgba(193,88,59,0.3)" }}
      >
        <p className="text-sm font-medium mb-2" style={{ color: "#F1E7D3", fontFamily: "'IBM Plex Sans', sans-serif" }}>
          The short version
        </p>
        <p className="text-xs leading-relaxed" style={{ color: "rgba(241,231,211,0.75)", fontFamily: "'IBM Plex Sans', sans-serif" }}>
          No systematic review has demonstrated that reflexology treats a specific medical
          condition. The most consistent signal is short-term reduction in anxiety and a
          sense of relaxation. That is a real benefit — it is just not the same as treating
          the underlying problem. Nothing in this app is graded above C for that reason.
        </p>
      </div>

      <h3
        className="text-sm uppercase tracking-wide mb-3"
        style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#C8763B" }}
      >
        The studies
      </h3>
      <div className="space-y-3 mb-8">
        {CITATIONS.map((c, i) => (
          <div
            key={i}
            className="rounded-2xl p-4"
            style={{ background: "rgba(241,231,211,0.08)", border: "1px solid rgba(241,231,211,0.15)" }}
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="text-sm font-medium" style={{ color: "#F1E7D3", fontFamily: "'IBM Plex Sans', sans-serif" }}>
                {c.ref}
              </p>
              <span
                className="text-[9px] px-2 py-0.5 rounded-full flex-shrink-0"
                style={{ background: "rgba(200,118,59,0.25)", color: "#E8A56B", fontFamily: "'IBM Plex Mono', monospace" }}
              >
                {c.weight}
              </span>
            </div>
            <p className="text-[11px] mb-2" style={{ color: "rgba(241,231,211,0.45)", fontFamily: "'IBM Plex Mono', monospace" }}>
              {c.journal}
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "rgba(241,231,211,0.7)", fontFamily: "'IBM Plex Sans', sans-serif" }}>
              {c.finding}
            </p>
          </div>
        ))}
      </div>

      <h3
        className="text-sm uppercase tracking-wide mb-3"
        style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#C8763B" }}
      >
        Stories from the centre
      </h3>
      <div className="rounded-2xl p-4 mb-4" style={{ background: "#F1E7D3" }}>
        <p className="text-xs leading-relaxed mb-3" style={{ color: "#3A342A", fontFamily: "'IBM Plex Sans', sans-serif" }}>
          Practitioners see people improve. Those experiences are real and worth recording
          — they just answer a different question than a trial does. A trial asks "does this
          work better than nothing, on average, across strangers." A case study asks "what
          happened to this person." Both are honest. Only one generalises.
        </p>
        <p className="text-xs font-medium mb-2" style={{ color: "#10262B", fontFamily: "'IBM Plex Sans', sans-serif" }}>
          Every case study we publish records:
        </p>
        <ul className="space-y-1.5">
          {CASE_TEMPLATE.map((c, i) => (
            <li key={i} className="flex gap-2 text-xs" style={{ color: "#3A342A", fontFamily: "'IBM Plex Sans', sans-serif" }}>
              <span style={{ color: "#C8763B" }}>·</span>
              <span className="leading-relaxed">{c}</span>
            </li>
          ))}
        </ul>
      </div>

      <div
        className="rounded-2xl p-4"
        style={{ background: "rgba(241,231,211,0.06)", border: "1px dashed rgba(241,231,211,0.25)" }}
      >
        <p className="text-xs leading-relaxed" style={{ color: "rgba(241,231,211,0.55)", fontFamily: "'IBM Plex Sans', sans-serif" }}>
          Case studies will appear here once collected under this template and reviewed.
          We publish the ones where nothing changed too. A library of only successes isn't
          a library — it's an advertisement.
        </p>
      </div>
    </div>
  );
}

function NavTabs({ tab, setTab }) {
  const tabs = [
    { id: "today", label: "Today" },
    { id: "technique", label: "Technique" },
    { id: "evidence", label: "Evidence" },
    { id: "history", label: "Origins" },
  ];
  return (
    <div className="flex gap-1 px-5 pt-5 flex-wrap">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => setTab(t.id)}
          className="px-4 py-2 rounded-full text-xs"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            background: tab === t.id ? "#C8763B" : "rgba(241,231,211,0.08)",
            color: tab === t.id ? "#10262B" : "rgba(241,231,211,0.6)",
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export default function VayusoleApp() {
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState("today");
  const [sessions, setSessions] = useState([]);

  return (
    <div className="min-h-screen" style={{ background: "#10262B" }}>
      <style>{FONT_IMPORT}</style>
      <div className="max-w-md mx-auto">
        {selected ? (
          <ProtocolView
            problem={selected}
            onBack={() => setSelected(null)}
            onComplete={(label) => setSessions((s) => [...s, label])}
          />
        ) : (
          <>
            <NavTabs tab={tab} setTab={setTab} />
            {tab === "today" && <ProblemPicker onSelect={setSelected} sessions={sessions} />}
            {tab === "technique" && <TechniquesView />}
            {tab === "evidence" && <EvidenceView />}
            {tab === "history" && <HistoryView />}
          </>
        )}
      </div>
    </div>
  );
}
