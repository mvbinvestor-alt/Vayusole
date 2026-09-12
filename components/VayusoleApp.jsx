"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  Droplet,
  Clock,
  Wind,
  Hand,
  Sparkles,
  X,
} from "lucide-react";

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
  const [revealed, setRevealed] = useState(0);
  const itemRefs = useRef([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.dataset.idx);
            // only ever moves forward, so the spine never rewinds
            setRevealed((r) => Math.max(r, idx + 1));
          }
        });
      },
      { rootMargin: "0px 0px -25% 0px", threshold: 0.15 }
    );
    itemRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

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
          style={{ background: "rgba(241,231,211,0.12)" }}
        />
        {/* the spine fills as you scroll through the eras */}
        <div
          className="absolute left-[7px] top-2 w-px origin-top"
          style={{
            height: `${(revealed / HISTORY.length) * 100}%`,
            background: "linear-gradient(#C8763B, rgba(200,118,59,0.3))",
            transition: "height .8s cubic-bezier(.4,0,.2,1)",
          }}
        />
        {HISTORY.map((h, i) => {
          const isOn = i < revealed;
          return (
            <div
              key={i}
              ref={(el) => (itemRefs.current[i] = el)}
              data-idx={i}
              className="relative mb-8 last:mb-0"
              style={{
                opacity: isOn ? 1 : 0.25,
                transform: isOn ? "translateY(0)" : "translateY(14px)",
                transition: "opacity .7s ease, transform .7s cubic-bezier(.4,0,.2,1)",
              }}
            >
              <div
                className="absolute -left-6 top-1 rounded-full"
                style={{
                  width: isOn ? 14 : 10,
                  height: isOn ? 14 : 10,
                  marginLeft: isOn ? 0 : 2,
                  marginTop: isOn ? 0 : 2,
                  background: isOn ? "#C8763B" : "rgba(241,231,211,0.25)",
                  border: "3px solid #10262B",
                  boxShadow: isOn ? "0 0 0 4px rgba(200,118,59,0.15)" : "none",
                  transition: "all .6s ease",
                }}
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
          );
        })}
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

// Radius multiplier for the pressure-guide ring at each phase of the cycle.
const PHASE_SCALE = { press: 1, hold: 0.92, release: 0.25, rest: 0 };
const PHASE_LABEL = {
  press: "Press in",
  hold: "Hold steady",
  release: "Release",
  rest: "Paused",
};

function FootMap({
  activeIds = [],
  pulseId = null,
  phase = "rest",
  onPick = null,
  intensity = null,
  maxWidth = 220,
}) {
  return (
    <svg
      viewBox="0 0 300 520"
      className="w-full mx-auto"
      style={{ maxWidth: `${maxWidth}px` }}
    >
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
        const pulsing = pulseId === key;
        const heat = intensity ? intensity[key] || 0 : 0;
        const maxHeat = intensity ? Math.max(1, ...Object.values(intensity)) : 1;
        const heatRatio = heat / maxHeat;

        // Dot size: intensity mode scales with session count, otherwise active state.
        const baseR = intensity ? 3.5 + heatRatio * 5.5 : active ? 7 : 4;
        const dotFill = intensity
          ? heat > 0
            ? ZONES[p.zone]
            : "rgba(241,231,211,0.18)"
          : active
          ? ZONES[p.zone]
          : "rgba(241,231,211,0.3)";

        return (
          <g key={key} onClick={onPick ? () => onPick(key) : undefined}>
            {/* generous invisible hit area for touch */}
            {onPick && (
              <circle cx={p.x} cy={p.y} r="22" fill="transparent" style={{ cursor: "pointer" }} />
            )}

            {/* pressure-guide ring — scales with the press/hold/release phase */}
            {pulsing && (
              <circle
                cx={p.x}
                cy={p.y}
                r="26"
                fill={ZONES[p.zone]}
                style={{
                  opacity: phase === "release" ? 0.1 : 0.3,
                  transform: `scale(${PHASE_SCALE[phase] ?? 0})`,
                  transformOrigin: `${p.x}px ${p.y}px`,
                  transition:
                    phase === "press"
                      ? "transform 2s cubic-bezier(.4,0,.2,1), opacity 2s ease"
                      : "transform 2s ease-out, opacity 2s ease",
                }}
              />
            )}

            {/* soft halo on protocol points (not in explore/heat modes) */}
            {active && !intensity && !pulsing && (
              <circle cx={p.x} cy={p.y} r="13" fill={ZONES[p.zone]} opacity="0.18" />
            )}

            {/* glow behind worked points in constellation mode */}
            {intensity && heat > 0 && (
              <circle
                cx={p.x}
                cy={p.y}
                r={10 + heatRatio * 12}
                fill={ZONES[p.zone]}
                opacity={0.08 + heatRatio * 0.22}
              />
            )}

            <circle
              cx={p.x}
              cy={p.y}
              r={pulsing ? 8.5 : baseR}
              fill={dotFill}
              stroke={pulsing ? "#F1E7D3" : active && !intensity ? "#F1E7D3" : "none"}
              strokeWidth="1.5"
              style={{ transition: "r .4s ease" }}
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
            Last: {sessions[sessions.length - 1].label}
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

// Keywords that identify which reflex point a written step refers to.
// Derived from the step text itself so the protocol data stays untouched.
const STEP_KEYWORDS = {
  solarPlexus: ["solar plexus"],
  head: ["head point", "head /", "head reflex"],
  sinus: ["sinus"],
  pituitary: ["pituitary"],
  lung: ["lung"],
  heart: ["heart"],
  spine: ["spine"],
  lowerBack: ["lower back"],
  sciatic: ["sciatic"],
  pelvic: ["pelvic"],
  lymphatic: ["lymphatic"],
  diaphragm: ["diaphragm"],
  kidney: ["kidney"],
  intestine: ["intestine"],
};

function pointsForStep(stepText, candidatePoints) {
  const lower = stepText.toLowerCase();
  return candidatePoints.filter((id) =>
    (STEP_KEYWORDS[id] || []).some((kw) => lower.includes(kw))
  );
}

// Whole-foot steps (effleurage, rolling, warming) name no single point.
// Those keep the full protocol lit rather than blanking the map.
function mapPointsForStep(stepText, candidatePoints) {
  const hits = pointsForStep(stepText, candidatePoints);
  return hits.length ? hits : candidatePoints;
}

function ProtocolView({ problem, onBack, onComplete }) {
  const [seconds, setSeconds] = useState(problem.duration);
  const [running, setRunning] = useState(false);
  const [breathOn, setBreathOn] = useState(true);
  const [openStep, setOpenStep] = useState(null);
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

  // Everything below is derived from the timer — no second source of truth.
  const elapsed = problem.duration - seconds;

  // Pressure cycle: 2s press · 4s hold · 2s release, then advance to the next point.
  const PRESSURE_CYCLE = 8;
  const cyclePos = elapsed % PRESSURE_CYCLE;
  const phase = !running
    ? "rest"
    : cyclePos < 2
    ? "press"
    : cyclePos < 6
    ? "hold"
    : "release";
  const pulseId = running
    ? problem.points[Math.floor(elapsed / PRESSURE_CYCLE) % problem.points.length]
    : null;

  // Breath cycle: 4s in · 2s hold · 4s out.
  const BREATH_CYCLE = 10;
  const bPos = elapsed % BREATH_CYCLE;
  const breathPhase = bPos < 4 ? "in" : bPos < 6 ? "full" : "out";
  const breathScale = breathPhase === "in" ? 1 : breathPhase === "full" ? 1 : 0.45;

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

      <FootMap
        activeIds={
          openStep !== null
            ? mapPointsForStep(problem.steps[openStep], problem.points)
            : problem.points
        }
        pulseId={pulseId}
        phase={phase}
      />

      {/* live pressure caption — follows the ring on the map */}
      <div className="h-6 flex items-center justify-center mt-1">
        {running && pulseId ? (
          <p
            className="text-xs flex items-center gap-2"
            style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#C8763B" }}
          >
            <Hand size={12} />
            {PHASE_LABEL[phase]} · {POINTS[pulseId].name}
          </p>
        ) : (
          <p
            className="text-xs"
            style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: "rgba(241,231,211,0.35)" }}
          >
            Start the timer to follow the pressure rhythm
          </p>
        )}
      </div>

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

      {/* breath pacer */}
      <div
        className="rounded-2xl p-5 mb-5"
        style={{ background: "rgba(78,139,120,0.12)", border: "1px solid rgba(78,139,120,0.3)" }}
      >
        <div className="flex items-center justify-between mb-1">
          <p
            className="text-xs flex items-center gap-1.5"
            style={{ color: "rgba(241,231,211,0.6)", fontFamily: "'IBM Plex Sans', sans-serif" }}
          >
            <Wind size={12} /> Breath pacer
          </p>
          <button
            onClick={() => setBreathOn((b) => !b)}
            className="text-[10px] px-2.5 py-1 rounded-full"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              background: breathOn ? "rgba(78,139,120,0.35)" : "rgba(241,231,211,0.08)",
              color: breathOn ? "#F1E7D3" : "rgba(241,231,211,0.5)",
            }}
          >
            {breathOn ? "ON" : "OFF"}
          </button>
        </div>

        {breathOn && (
          <div className="flex flex-col items-center pt-3 pb-1">
            <div className="relative w-[120px] h-[120px] flex items-center justify-center">
              <div
                className="absolute rounded-full"
                style={{
                  width: 120,
                  height: 120,
                  border: "1px solid rgba(78,139,120,0.3)",
                }}
              />
              <div
                className="absolute rounded-full"
                style={{
                  width: 110,
                  height: 110,
                  background: "radial-gradient(circle, rgba(78,139,120,0.45), rgba(78,139,120,0.05))",
                  transform: `scale(${running ? breathScale : 0.45})`,
                  transition:
                    breathPhase === "in"
                      ? "transform 4s cubic-bezier(.37,0,.63,1)"
                      : "transform 4s cubic-bezier(.37,0,.63,1)",
                }}
              />
              <p
                className="relative text-xs"
                style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#F1E7D3" }}
              >
                {!running ? "ready" : breathPhase === "in" ? "in" : breathPhase === "full" ? "hold" : "out"}
              </p>
            </div>
            <p
              className="text-[11px] mt-2 text-center leading-relaxed"
              style={{ color: "rgba(241,231,211,0.45)", fontFamily: "'IBM Plex Sans', sans-serif" }}
            >
              Four counts in, two held, four out. Let the pressure follow the breath.
            </p>
          </div>
        )}
      </div>

      {/* steps */}
      <h3 className="text-sm uppercase tracking-wide mb-3" style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#C8763B" }}>
        Guided steps
      </h3>
      <ol className="space-y-2 mb-2">
        {problem.steps.map((s, i) => {
          const stepPoints = pointsForStep(s, problem.points);
          const isOpen = openStep === i;
          return (
            <li key={i}>
              <button
                onClick={() => setOpenStep(isOpen ? null : i)}
                className="flex gap-3 text-sm text-left w-full rounded-xl p-2 -m-2 transition-colors"
                style={{
                  color: "#F1E7D3",
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  background: isOpen ? "rgba(200,118,59,0.12)" : "transparent",
                }}
              >
                <span
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs"
                  style={{
                    background: isOpen ? "#C8763B" : "rgba(241,231,211,0.12)",
                    color: isOpen ? "#10262B" : "#F1E7D3",
                    fontFamily: "'IBM Plex Mono', monospace",
                    transition: "all .25s ease",
                  }}
                >
                  {i + 1}
                </span>
                <span className="pt-0.5 leading-relaxed flex-1">
                  {s}
                  {stepPoints.length > 0 && (
                    <span className="flex flex-wrap gap-1.5 mt-2">
                      {stepPoints.map((id) => (
                        <span
                          key={id}
                          className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full"
                          style={{
                            background: isOpen
                              ? ZONES[POINTS[id].zone]
                              : "rgba(241,231,211,0.08)",
                            color: isOpen ? "#10262B" : "rgba(241,231,211,0.6)",
                            fontFamily: "'IBM Plex Mono', monospace",
                            transition: "all .25s ease",
                          }}
                        >
                          {POINTS[id].code}
                        </span>
                      ))}
                    </span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      <p
        className="text-[11px] mb-6 pl-9"
        style={{ color: "rgba(241,231,211,0.35)", fontFamily: "'IBM Plex Sans', sans-serif" }}
      >
        Tap a step to light its points on the map above.
      </p>

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
          onComplete(problem);
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

// Schematic motion diagrams. These show the movement of the hand, not anatomy —
// no anatomical accuracy is claimed or needed for a motion cue.
function TechniqueDiagram({ name }) {
  const ink = "rgba(241,231,211,0.35)";
  const surface = "rgba(241,231,211,0.10)";
  const ember = "#C8763B";
  const jade = "#4E8B78";

  // shared: a slab standing in for a patch of sole
  const Slab = ({ y = 78 }) => (
    <path
      d={`M12 ${y} Q100 ${y - 16} 188 ${y}`}
      fill="none"
      stroke={ink}
      strokeWidth="2"
      strokeLinecap="round"
    />
  );

  const diagrams = {
    "Thumb Walking": (
      <>
        <Slab />
        <rect x="8" y="62" width="184" height="30" rx="14" fill={surface} />
        {/* caterpillar steps */}
        {[40, 72, 104, 136].map((x, i) => (
          <g key={x}>
            <circle cx={x} cy={74 - i * 1.5} r="5" fill={ember} opacity={0.25 + i * 0.22} />
            <path
              d={`M${x + 8} ${70 - i * 1.5} Q${x + 16} ${58 - i * 1.5} ${x + 24} ${70 - i * 1.5}`}
              fill="none"
              stroke={ember}
              strokeWidth="1.6"
              strokeLinecap="round"
              opacity="0.55"
            />
          </g>
        ))}
        {/* thumb */}
        <path
          d="M150 40 q16 4 18 20 q2 16 -12 20 q-14 4 -20 -8 q-6 -14 4 -24 q5 -6 10 -8 Z"
          fill={ember}
          opacity="0.9"
        />
        <path d="M28 100 L172 100" stroke={ember} strokeWidth="1.2" strokeDasharray="3 4" opacity="0.5" />
        <path d="M166 96 l8 4 -8 4" fill="none" stroke={ember} strokeWidth="1.4" strokeLinecap="round" />
      </>
    ),
    "Finger Walking": (
      <>
        <Slab />
        <rect x="8" y="62" width="184" height="30" rx="14" fill={surface} />
        {[52, 80, 108].map((x, i) => (
          <g key={x}>
            <circle cx={x} cy={74} r="3.6" fill={jade} opacity={0.35 + i * 0.25} />
            <path
              d={`M${x + 6} ${70} Q${x + 12} ${60} ${x + 18} ${70}`}
              fill="none"
              stroke={jade}
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.5"
            />
          </g>
        ))}
        {/* index finger */}
        <path
          d="M126 34 q10 2 12 16 l2 22 q1 10 -9 12 q-10 2 -12 -8 l-3 -26 q-1 -12 10 -16 Z"
          fill={jade}
          opacity="0.9"
        />
        <text x="100" y="112" textAnchor="middle" fontSize="9" fill={ink} fontFamily="'IBM Plex Mono', monospace">
          smaller areas · between toes
        </text>
      </>
    ),
    "Hook and Backup": (
      <>
        <Slab y={84} />
        <rect x="8" y="68" width="184" height="30" rx="14" fill={surface} />
        <circle cx="100" cy="80" r="9" fill={ember} opacity="0.25" />
        <circle cx="100" cy="80" r="4" fill={ember} />
        {/* press in */}
        <path d="M100 30 L100 62" stroke={ember} strokeWidth="2" strokeLinecap="round" />
        <path d="M94 56 l6 8 6 -8" fill="none" stroke={ember} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* hook back */}
        <path
          d="M100 80 q22 0 26 -20"
          fill="none"
          stroke={jade}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="4 4"
        />
        <path d="M120 64 l6 -6 3 8" fill="none" stroke={jade} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <text x="46" y="26" fontSize="9" fill={ember} fontFamily="'IBM Plex Mono', monospace">1 press</text>
        <text x="132" y="26" fontSize="9" fill={jade} fontFamily="'IBM Plex Mono', monospace">2 hook</text>
      </>
    ),
    "Press and Rotate": (
      <>
        <Slab y={86} />
        <rect x="8" y="70" width="184" height="30" rx="14" fill={surface} />
        <circle cx="100" cy="82" r="4" fill={ember} />
        {/* rotation */}
        <circle cx="100" cy="82" r="18" fill="none" stroke={ember} strokeWidth="1.8" strokeDasharray="5 5" opacity="0.7" />
        <circle cx="100" cy="82" r="27" fill="none" stroke={ember} strokeWidth="1.2" strokeDasharray="4 6" opacity="0.35" />
        <path d="M118 76 l6 6 -8 5" fill="none" stroke={ember} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M100 34 L100 60" stroke={ember} strokeWidth="2" strokeLinecap="round" />
        <path d="M94 54 l6 8 6 -8" fill="none" stroke={ember} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <text x="100" y="116" textAnchor="middle" fontSize="9" fill={ink} fontFamily="'IBM Plex Mono', monospace">
          either direction · larger areas
        </text>
      </>
    ),
    "Effleurage (warm-up strokes)": (
      <>
        {/* schematic sole */}
        <path
          d="M62 18 q-20 4 -18 26 q2 18 -4 34 q-6 20 4 34 q10 14 26 12 q16 -2 22 -18 q6 -18 4 -34 q-2 -20 2 -34 q4 -18 -14 -22 q-14 -4 -22 2 Z"
          fill={surface}
          stroke={ink}
          strokeWidth="1.5"
        />
        {/* long sweeps */}
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M${70 + i * 6} 106 Q${76 + i * 6} 60 ${70 + i * 6} 26`}
            fill="none"
            stroke={ember}
            strokeWidth="2"
            strokeLinecap="round"
            opacity={0.75 - i * 0.2}
          />
        ))}
        <path d="M64 34 l6 -10 6 10" fill="none" stroke={ember} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* flat hand */}
        <rect x="130" y="52" width="46" height="30" rx="12" fill={ember} opacity="0.85" />
        <rect x="140" y="40" width="30" height="18" rx="8" fill={ember} opacity="0.55" />
        <text x="153" y="104" textAnchor="middle" fontSize="9" fill={ink} fontFamily="'IBM Plex Mono', monospace">
          flat of the hand
        </text>
        <text x="153" y="116" textAnchor="middle" fontSize="9" fill={ink} fontFamily="'IBM Plex Mono', monospace">
          heel → toe
        </text>
      </>
    ),
  };

  if (!diagrams[name]) return null;

  return (
    <svg viewBox="0 0 200 124" className="w-full" style={{ maxWidth: 260, margin: "0 auto" }}>
      {diagrams[name]}
    </svg>
  );
}

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
            <div
              className="rounded-xl mt-3 py-2"
              style={{ background: "#10262B" }}
            >
              <TechniqueDiagram name={t.name} />
            </div>
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

// Which protocols call on a given point — built once from PROBLEMS.
const POINT_USES = Object.keys(POINTS).reduce((acc, key) => {
  acc[key] = PROBLEMS.filter((p) => p.points.includes(key));
  return acc;
}, {});

const ZONE_LABEL = {
  head: "Head & sinus",
  chest: "Chest & lung",
  digestive: "Digestive",
  spine: "Spine & back",
  pelvic: "Pelvic",
  circulation: "Circulation",
};

function ExploreView({ onSelect }) {
  const [picked, setPicked] = useState(null);
  const p = picked ? POINTS[picked] : null;

  return (
    <div className="px-5 pt-8 pb-10">
      <p
        className="text-xs tracking-widest uppercase mb-1"
        style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#C8763B" }}
      >
        Explore
      </p>
      <h1
        className="text-3xl mb-2 leading-tight"
        style={{ fontFamily: "'Fraunces', serif", color: "#F1E7D3", fontWeight: 600 }}
      >
        The map, without a protocol
      </h1>
      <p
        className="text-sm mb-6 leading-relaxed"
        style={{ color: "rgba(241,231,211,0.6)", fontFamily: "'IBM Plex Sans', sans-serif" }}
      >
        Tap any point to see what it's traditionally mapped to, which zone it sits in,
        and which sessions use it.
      </p>

      <FootMap
        activeIds={picked ? [picked] : []}
        onPick={(key) => setPicked((cur) => (cur === key ? null : key))}
        maxWidth={250}
      />

      {/* zone key */}
      <div className="flex flex-wrap gap-2 justify-center mt-4">
        {Object.entries(ZONE_LABEL).map(([z, label]) => (
          <span
            key={z}
            className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(241,231,211,0.06)",
              color: "rgba(241,231,211,0.65)",
              fontFamily: "'IBM Plex Sans', sans-serif",
            }}
          >
            <span className="w-2 h-2 rounded-full" style={{ background: ZONES[z] }} />
            {label}
          </span>
        ))}
      </div>

      {/* detail card */}
      <div className="mt-6">
        {!p ? (
          <div
            className="rounded-2xl p-5 text-center"
            style={{ background: "rgba(241,231,211,0.05)", border: "1px dashed rgba(241,231,211,0.18)" }}
          >
            <p
              className="text-sm"
              style={{ color: "rgba(241,231,211,0.45)", fontFamily: "'IBM Plex Sans', sans-serif" }}
            >
              Nothing selected — tap a point on the sole.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl p-5" style={{ background: "#F1E7D3" }}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: ZONES[p.zone] }} />
                  <span
                    className="text-[11px]"
                    style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#6B6255" }}
                  >
                    {p.code} · {ZONE_LABEL[p.zone]}
                  </span>
                </div>
                <h3
                  className="text-xl"
                  style={{ fontFamily: "'Fraunces', serif", color: "#10262B", fontWeight: 600 }}
                >
                  {p.name}
                </h3>
              </div>
              <button
                onClick={() => setPicked(null)}
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(16,38,43,0.08)", color: "#10262B" }}
              >
                <X size={14} />
              </button>
            </div>

            <p
              className="text-xs mb-4 leading-relaxed"
              style={{ color: "#3A342A", fontFamily: "'IBM Plex Sans', sans-serif" }}
            >
              Traditional reflexology maps this spot to the {p.name.toLowerCase()} region.
              The mapping comes from Ingham's charts, not from anatomy — there's no nerve
              pathway connecting this part of the sole to that organ.
            </p>

            {POINT_USES[picked].length > 0 ? (
              <>
                <p
                  className="text-[10px] uppercase tracking-wide mb-2"
                  style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#8A7F6E" }}
                >
                  Used in
                </p>
                <div className="flex flex-wrap gap-2">
                  {POINT_USES[picked].map((prob) => (
                    <button
                      key={prob.id}
                      onClick={() => onSelect(prob)}
                      className="text-xs px-3 py-1.5 rounded-full transition-transform active:scale-95"
                      style={{
                        background: "rgba(16,38,43,0.08)",
                        color: "#10262B",
                        fontFamily: "'IBM Plex Sans', sans-serif",
                      }}
                    >
                      {prob.label} →
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <p
                className="text-xs"
                style={{ color: "#6B6255", fontFamily: "'IBM Plex Sans', sans-serif" }}
              >
                No protocol in the app uses this point yet.
              </p>
            )}
          </div>
        )}
      </div>

      <p
        className="text-[11px] text-center mt-6 leading-relaxed"
        style={{ color: "rgba(241,231,211,0.35)", fontFamily: "'IBM Plex Sans', sans-serif" }}
      >
        This chart is diagrammatic, not anatomical. Point positions are illustrative.
      </p>
    </div>
  );
}

function ProgressView({ sessions }) {
  // How many times each point has been worked across all sessions.
  const intensity = sessions.reduce((acc, s) => {
    s.points.forEach((id) => {
      acc[id] = (acc[id] || 0) + 1;
    });
    return acc;
  }, {});

  const lit = Object.keys(intensity).length;
  const total = Object.keys(POINTS).length;
  const ranked = Object.entries(intensity).sort((a, b) => b[1] - a[1]);

  return (
    <div className="px-5 pt-8 pb-10">
      <p
        className="text-xs tracking-widest uppercase mb-1"
        style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#C8763B" }}
      >
        Progress
      </p>
      <h1
        className="text-3xl mb-2 leading-tight"
        style={{ fontFamily: "'Fraunces', serif", color: "#F1E7D3", fontWeight: 600 }}
      >
        Your constellation
      </h1>
      <p
        className="text-sm mb-6 leading-relaxed"
        style={{ color: "rgba(241,231,211,0.6)", fontFamily: "'IBM Plex Sans', sans-serif" }}
      >
        Every completed session lights the points it worked. The more you return to a
        point, the brighter it burns.
      </p>

      {sessions.length === 0 ? (
        <div
          className="rounded-2xl p-8 text-center"
          style={{ background: "rgba(241,231,211,0.05)", border: "1px dashed rgba(241,231,211,0.18)" }}
        >
          <Sparkles size={20} color="rgba(241,231,211,0.35)" className="mx-auto mb-3" />
          <p
            className="text-sm leading-relaxed"
            style={{ color: "rgba(241,231,211,0.45)", fontFamily: "'IBM Plex Sans', sans-serif" }}
          >
            Nothing lit yet. Finish a session on the Today tab and the first points
            will appear here.
          </p>
        </div>
      ) : (
        <>
          <FootMap intensity={intensity} maxWidth={250} />

          <div className="grid grid-cols-3 gap-3 mt-6 mb-6">
            {[
              { label: "Sessions", value: sessions.length },
              { label: "Points lit", value: `${lit}/${total}` },
              {
                label: "Most worked",
                value: ranked.length ? POINTS[ranked[0][0]].code : "—",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl p-3 text-center"
                style={{ background: "rgba(241,231,211,0.06)", border: "1px solid rgba(241,231,211,0.12)" }}
              >
                <p
                  className="text-xl mb-1"
                  style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#F1E7D3" }}
                >
                  {stat.value}
                </p>
                <p
                  className="text-[10px] leading-tight"
                  style={{ color: "rgba(241,231,211,0.5)", fontFamily: "'IBM Plex Sans', sans-serif" }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <h3
            className="text-sm uppercase tracking-wide mb-3"
            style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#C8763B" }}
          >
            Point log
          </h3>
          <div className="space-y-2 mb-6">
            {ranked.map(([id, count]) => {
              const maxCount = ranked[0][1];
              return (
                <div key={id} className="flex items-center gap-3">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: ZONES[POINTS[id].zone] }}
                  />
                  <span
                    className="text-xs flex-shrink-0 w-[110px] truncate"
                    style={{ color: "#F1E7D3", fontFamily: "'IBM Plex Sans', sans-serif" }}
                  >
                    {POINTS[id].name}
                  </span>
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(241,231,211,0.08)" }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(count / maxCount) * 100}%`,
                        background: ZONES[POINTS[id].zone],
                        transition: "width .6s ease",
                      }}
                    />
                  </div>
                  <span
                    className="text-[11px] w-4 text-right"
                    style={{ color: "rgba(241,231,211,0.5)", fontFamily: "'IBM Plex Mono', monospace" }}
                  >
                    {count}
                  </span>
                </div>
              );
            })}
          </div>

          <h3
            className="text-sm uppercase tracking-wide mb-3"
            style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#C8763B" }}
          >
            Recent sessions
          </h3>
          <div className="space-y-2">
            {[...sessions]
              .reverse()
              .slice(0, 8)
              .map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl px-4 py-3"
                  style={{ background: "rgba(241,231,211,0.06)" }}
                >
                  <span
                    className="text-sm"
                    style={{ color: "#F1E7D3", fontFamily: "'IBM Plex Sans', sans-serif" }}
                  >
                    {s.label}
                  </span>
                  <span
                    className="text-[11px]"
                    style={{ color: "rgba(241,231,211,0.45)", fontFamily: "'IBM Plex Mono', monospace" }}
                  >
                    {new Date(s.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))}
          </div>
        </>
      )}

      <p
        className="text-[11px] text-center mt-6 leading-relaxed"
        style={{ color: "rgba(241,231,211,0.35)", fontFamily: "'IBM Plex Sans', sans-serif" }}
      >
        Progress is held in memory for this visit only. Persisting it is what the
        Supabase sessions table is for.
      </p>
    </div>
  );
}

const BUILD_PRINCIPLES = [
  {
    head: "Graded, not asserted",
    body: "Every protocol and remedy carries an evidence letter. Nothing is graded above C, because nothing in the published literature supports more than that. The grade is visible before you start, not buried in a footer.",
  },
  {
    head: "The unflattering studies are included",
    body: "The Evidence tab lists systematic reviews that found no effect alongside the ones that found a signal — including the 2024 Australian Department of Health review. A source list that only contains good news is marketing.",
  },
  {
    head: "Contraindications come first",
    body: "Each protocol names who should not do it — neuropathy, recent injury, pregnancy, fever, open wounds. Low risk is not no risk, and the difference is written down.",
  },
  {
    head: "Traditional claims are labelled as traditional",
    body: "Where a point or remedy rests on long use rather than trial data, it is marked grade D and says so. Age is not evidence.",
  },
  {
    head: "Nothing here diagnoses or treats",
    body: "The app suggests where to press and for how long. It does not tell you what is wrong with you, and it never asks you to delay care.",
  },
];

function AboutView() {
  return (
    <div className="px-5 pt-8 pb-10">
      <p
        className="text-xs tracking-widest uppercase mb-1"
        style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#C8763B" }}
      >
        Why this exists
      </p>
      <h1
        className="text-3xl mb-3 leading-tight"
        style={{ fontFamily: "'Fraunces', serif", color: "#F1E7D3", fontWeight: 600 }}
      >
        Built from experience, checked against research
      </h1>

      {/* founder story */}
      <div
        className="rounded-2xl p-5 mb-7"
        style={{ background: "rgba(241,231,211,0.06)", border: "1px solid rgba(241,231,211,0.15)" }}
      >
        <p
          className="text-sm leading-relaxed mb-3"
          style={{ color: "rgba(241,231,211,0.8)", fontFamily: "'IBM Plex Sans', sans-serif" }}
        >
          My wife was bedridden for a month. I spent that month anxious and not
          sleeping, and we started going for foot reflexology. It helped me — my sleep
          settled, and the anxiety eased. That is the whole of my personal evidence, and
          it is not enough to recommend anything to anyone.
        </p>
        <p
          className="text-sm leading-relaxed mb-3"
          style={{ color: "rgba(241,231,211,0.8)", fontFamily: "'IBM Plex Sans', sans-serif" }}
        >
          So I did the other work. I sat with naturopathy practitioners and asked what
          they actually claim and what they don't. I read the systematic reviews,
          including the ones concluding there is no demonstrated clinical effect. Then I
          built this around what survived that reading, rather than around what I'd
          personally felt.
        </p>
        <p
          className="text-sm leading-relaxed"
          style={{ color: "rgba(241,231,211,0.8)", fontFamily: "'IBM Plex Sans', sans-serif" }}
        >
          The result is deliberately modest. Reflexology may bring some people
          short-term relaxation and less anxiety. It may do nothing for you. It treats
          no underlying condition. For most people it is low risk and costs nothing to
          try — so if you want to try it, here is a careful way to do that.
        </p>
        <div
          className="flex items-center justify-between gap-3 mt-4 pt-4"
          style={{ borderTop: "1px solid rgba(241,231,211,0.12)" }}
        >
          <p
            className="text-xs"
            style={{ color: "rgba(241,231,211,0.5)", fontFamily: "'IBM Plex Mono', monospace" }}
          >
            Balaji Veeramani · builder
          </p>
          <a
            href="https://www.linkedin.com/in/balaji-veeramani-b235aa15"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] px-3 py-1.5 rounded-full flex-shrink-0"
            style={{
              background: "rgba(241,231,211,0.08)",
              border: "1px solid rgba(241,231,211,0.18)",
              color: "rgba(241,231,211,0.75)",
              fontFamily: "'IBM Plex Sans', sans-serif",
            }}
          >
            LinkedIn ↗
          </a>
        </div>
      </div>

      {/* how it's built */}
      <h3
        className="text-sm uppercase tracking-wide mb-3"
        style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#C8763B" }}
      >
        How it's built
      </h3>
      <div className="space-y-3 mb-7">
        {BUILD_PRINCIPLES.map((b, i) => (
          <div
            key={i}
            className="rounded-2xl p-4"
            style={{ background: "rgba(241,231,211,0.06)", border: "1px solid rgba(241,231,211,0.12)" }}
          >
            <p
              className="text-sm font-medium mb-1.5"
              style={{ color: "#F1E7D3", fontFamily: "'IBM Plex Sans', sans-serif" }}
            >
              {b.head}
            </p>
            <p
              className="text-xs leading-relaxed"
              style={{ color: "rgba(241,231,211,0.65)", fontFamily: "'IBM Plex Sans', sans-serif" }}
            >
              {b.body}
            </p>
          </div>
        ))}
      </div>

      {/* what this is not */}
      <h3
        className="text-sm uppercase tracking-wide mb-3"
        style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#C8763B" }}
      >
        What this is not
      </h3>
      <div className="rounded-2xl p-5 mb-7" style={{ background: "#F1E7D3" }}>
        <ul className="space-y-2.5">
          {[
            "Not a diagnosis. The app cannot tell you what is causing your symptoms.",
            "Not a treatment. It does not act on any underlying disease process.",
            "Not a reason to delay care. If something is severe, sudden, worsening, or unlike your usual pattern, see a doctor — today, not after a session.",
            "Not a replacement for prescribed medication. Never stop or change a prescription because a session helped.",
            "Not risk-free for everyone. Diabetic neuropathy, blood clots, pregnancy, fractures, infections and open wounds all need medical advice first.",
          ].map((t, i) => (
            <li
              key={i}
              className="flex gap-2.5 text-xs leading-relaxed"
              style={{ color: "#3A342A", fontFamily: "'IBM Plex Sans', sans-serif" }}
            >
              <span style={{ color: "#C1583B" }}>·</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* data & privacy */}
      <h3
        className="text-sm uppercase tracking-wide mb-3"
        style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#C8763B" }}
      >
        Your data
      </h3>
      <div
        className="rounded-2xl p-4 mb-7"
        style={{ background: "rgba(78,139,120,0.12)", border: "1px solid rgba(78,139,120,0.3)" }}
      >
        <p
          className="text-sm font-medium mb-2"
          style={{ color: "#F1E7D3", fontFamily: "'IBM Plex Sans', sans-serif" }}
        >
          We don't collect any.
        </p>
        <p
          className="text-xs leading-relaxed"
          style={{ color: "rgba(241,231,211,0.7)", fontFamily: "'IBM Plex Sans', sans-serif" }}
        >
          No account, no sign-up, no analytics, no advertising, no tracking
          cookies. Which protocols you pick and what's bothering you never leaves
          your device — your session history lives in the browser's memory while the
          app is open and is gone when you close the tab. If that ever changes,
          this panel changes with it, before the feature ships.
        </p>
      </div>

      {/* discretion */}
      <div
        className="rounded-2xl p-4 mb-4"
        style={{ background: "rgba(193,88,59,0.15)", border: "1px solid rgba(193,88,59,0.3)" }}
      >
        <div className="flex gap-2 mb-2">
          <AlertTriangle size={16} color="#E08A6B" className="flex-shrink-0 mt-0.5" />
          <p
            className="text-sm font-medium"
            style={{ color: "#F1E7D3", fontFamily: "'IBM Plex Sans', sans-serif" }}
          >
            Use at your own discretion
          </p>
        </div>
        <p
          className="text-xs leading-relaxed"
          style={{ color: "rgba(241,231,211,0.75)", fontFamily: "'IBM Plex Sans', sans-serif" }}
        >
          Everything in Vayusole is educational content about a complementary practice.
          It is not medical advice and no doctor–patient relationship is created by using
          it. You decide whether to try a protocol, and you take responsibility for that
          decision. If you have any medical condition, are pregnant, or take regular
          medication, speak to a qualified healthcare professional before starting. Stop
          immediately if anything hurts.
        </p>
      </div>

      <p
        className="text-[11px] text-center leading-relaxed"
        style={{ color: "rgba(241,231,211,0.35)", fontFamily: "'IBM Plex Sans', sans-serif" }}
      >
        In an emergency, contact your local emergency number or nearest hospital. Do not
        use this app.
      </p>
    </div>
  );
}

function ConsentGate({ onAccept, onCancel }) {
  const [checked, setChecked] = useState(false);

  return (
    <div className="px-5 pt-10 pb-10">
      <div
        className="rounded-2xl p-6"
        style={{ background: "rgba(241,231,211,0.06)", border: "1px solid rgba(241,231,211,0.18)" }}
      >
        <div className="flex gap-2 mb-4">
          <AlertTriangle size={18} color="#E08A6B" className="flex-shrink-0 mt-0.5" />
          <h2
            className="text-xl leading-tight"
            style={{ fontFamily: "'Fraunces', serif", color: "#F1E7D3", fontWeight: 600 }}
          >
            Before your first session
          </h2>
        </div>

        <ul className="space-y-3 mb-5">
          {[
            "This is educational content about a complementary practice — not medical advice, diagnosis, or treatment.",
            "The evidence is limited and mixed. Nothing here is graded above C. It may bring you short-term relaxation. It may do nothing.",
            "It does not treat any underlying condition, and is never a reason to delay care or change a prescription.",
            "Check with a healthcare professional first if you are pregnant, diabetic, have neuropathy, circulation problems, a recent injury, an infection, or any open wound on the foot.",
            "Stop immediately if anything is painful. Pressure should feel firm, never sharp.",
          ].map((t, i) => (
            <li
              key={i}
              className="flex gap-2.5 text-xs leading-relaxed"
              style={{ color: "rgba(241,231,211,0.75)", fontFamily: "'IBM Plex Sans', sans-serif" }}
            >
              <span style={{ color: "#C8763B" }}>·</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={() => setChecked((c) => !c)}
          className="flex items-start gap-3 w-full text-left mb-5"
        >
          <span
            className="flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center mt-0.5"
            style={{
              background: checked ? "#C8763B" : "transparent",
              border: `1.5px solid ${checked ? "#C8763B" : "rgba(241,231,211,0.35)"}`,
              transition: "all .2s ease",
            }}
          >
            {checked && (
              <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                <path d="M1 4.5L4 7.5L10 1.5" stroke="#10262B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
          <span
            className="text-xs leading-relaxed"
            style={{ color: "#F1E7D3", fontFamily: "'IBM Plex Sans', sans-serif" }}
          >
            I've read this, I'm choosing to try it at my own discretion, and I'll seek
            medical care for anything severe or persistent.
          </span>
        </button>

        <button
          onClick={onAccept}
          disabled={!checked}
          className="w-full rounded-2xl py-4 text-sm font-medium transition-transform active:scale-95 mb-2"
          style={{
            background: checked ? "#C8763B" : "rgba(241,231,211,0.08)",
            color: checked ? "#10262B" : "rgba(241,231,211,0.3)",
            fontFamily: "'IBM Plex Sans', sans-serif",
            cursor: checked ? "pointer" : "not-allowed",
          }}
        >
          Continue to session
        </button>
        <button
          onClick={onCancel}
          className="w-full rounded-2xl py-3 text-xs"
          style={{ color: "rgba(241,231,211,0.5)", fontFamily: "'IBM Plex Sans', sans-serif" }}
        >
          Not now
        </button>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div
      className="px-5 py-6 text-center"
      style={{ borderTop: "1px solid rgba(241,231,211,0.08)" }}
    >
      <p
        className="text-[11px] mb-1"
        style={{ fontFamily: "'IBM Plex Mono', monospace", color: "rgba(241,231,211,0.45)" }}
      >
        © {new Date().getFullYear()} Balaji Veeramani
      </p>
      <p
        className="text-[10px] leading-relaxed"
        style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: "rgba(241,231,211,0.3)" }}
      >
        Vayusole · All rights reserved · Educational content only, not medical advice
      </p>
    </div>
  );
}

function NavTabs({ tab, setTab }) {
  const tabs = [
    { id: "today", label: "Today" },
    { id: "explore", label: "Explore" },
    { id: "progress", label: "Progress" },
    { id: "technique", label: "Technique" },
    { id: "evidence", label: "Evidence" },
    { id: "about", label: "Why" },
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
  const [acknowledged, setAcknowledged] = useState(false);
  const [pending, setPending] = useState(null);

  // First protocol of the visit goes through the acknowledgement screen.
  const openProtocol = (problem) => {
    if (acknowledged) setSelected(problem);
    else setPending(problem);
  };

  return (
    <div className="min-h-screen" style={{ background: "#10262B" }}>
      <style>{FONT_IMPORT}</style>
      <div className="max-w-md mx-auto">
        {pending ? (
          <ConsentGate
            onAccept={() => {
              setAcknowledged(true);
              setSelected(pending);
              setPending(null);
            }}
            onCancel={() => setPending(null)}
          />
        ) : selected ? (
          <ProtocolView
            problem={selected}
            onBack={() => setSelected(null)}
            onComplete={(p) =>
              setSessions((s) => [
                ...s,
                { label: p.label, points: p.points, at: Date.now() },
              ])
            }
          />
        ) : (
          <>
            <NavTabs tab={tab} setTab={setTab} />
            {tab === "today" && <ProblemPicker onSelect={openProtocol} sessions={sessions} />}
            {tab === "explore" && <ExploreView onSelect={openProtocol} />}
            {tab === "progress" && <ProgressView sessions={sessions} />}
            {tab === "technique" && <TechniquesView />}
            {tab === "evidence" && <EvidenceView />}
            {tab === "about" && <AboutView />}
            {tab === "history" && <HistoryView />}
          </>
        )}
        <Footer />
      </div>
    </div>
  );
}
