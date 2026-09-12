"use client";

import { useState } from "react";

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap');`;

export default function Gate() {
  const [code, setCode] = useState("");
  const [state, setState] = useState("idle"); // idle | checking | wrong

  const submit = async () => {
    if (!code.trim() || state === "checking") return;
    setState("checking");
    try {
      const res = await fetch("/api/beta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });
      if (res.ok) {
        window.location.href = "/";
        return;
      }
      setState("wrong");
    } catch {
      setState("wrong");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "#10262B" }}
    >
      <style>{FONT_IMPORT}</style>
      <div className="w-full max-w-sm">
        <p
          className="text-xs tracking-widest uppercase mb-2"
          style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#C8763B" }}
        >
          Vayusole
        </p>
        <h1
          className="text-3xl mb-3 leading-tight"
          style={{ fontFamily: "'Fraunces', serif", color: "#F1E7D3", fontWeight: 600 }}
        >
          Closed beta
        </h1>
        <p
          className="text-sm mb-7 leading-relaxed"
          style={{ color: "rgba(241,231,211,0.6)", fontFamily: "'IBM Plex Sans', sans-serif" }}
        >
          This is a private test build. Enter the code you were sent. The safety
          content is still under clinical review, which is part of what's being
          tested.
        </p>

        <input
          type="text"
          inputMode="text"
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            if (state === "wrong") setState("idle");
          }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="access code"
          className="w-full rounded-2xl px-4 py-4 mb-3 outline-none"
          style={{
            background: "rgba(241,231,211,0.08)",
            border: `1px solid ${state === "wrong" ? "rgba(193,88,59,0.7)" : "rgba(241,231,211,0.2)"}`,
            color: "#F1E7D3",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 16, // keeps iOS from zooming on focus
            transition: "border-color .2s ease",
          }}
        />

        {state === "wrong" && (
          <p
            className="text-xs mb-3"
            style={{ color: "#E08A6B", fontFamily: "'IBM Plex Sans', sans-serif" }}
          >
            That code isn't recognised. Check for extra spaces, or ask for a new one.
          </p>
        )}

        <button
          onClick={submit}
          disabled={!code.trim() || state === "checking"}
          className="w-full rounded-2xl py-4 text-sm font-medium transition-transform active:scale-95"
          style={{
            background: code.trim() ? "#C8763B" : "rgba(241,231,211,0.08)",
            color: code.trim() ? "#10262B" : "rgba(241,231,211,0.3)",
            fontFamily: "'IBM Plex Sans', sans-serif",
            cursor: code.trim() ? "pointer" : "not-allowed",
          }}
        >
          {state === "checking" ? "Checking…" : "Enter"}
        </button>

        <p
          className="text-[11px] text-center mt-8 leading-relaxed"
          style={{ color: "rgba(241,231,211,0.3)", fontFamily: "'IBM Plex Sans', sans-serif" }}
        >
          © {new Date().getFullYear()} Balaji Veeramani · Educational content only,
          not medical advice
        </p>
      </div>
    </div>
  );
}
