# Vayusole

Guided foot reflexology protocols for everyday complaints, with every claim
labelled by evidence level.

## Position

Most reflexology apps claim cures. This one publishes the systematic reviews
that found no effect, alongside the ones that found a signal. Nothing is graded
above **C**, because nothing in the literature supports more than that.

## Stack

- Next.js 14 (App Router), PWA-installable
- Tailwind CSS
- Supabase (session logging, auth)
- Deploy: Vercel

## Run locally

```bash
npm install
cp .env.local.example .env.local   # fill in Supabase keys
npm run dev
```

## Deploy

1. Push to GitHub
2. Import repo at vercel.com
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` env vars
4. Deploy

## BEFORE PUBLIC LAUNCH — blocking items

Reviewed against the regulatory position (see `docs/legal-drafts.md`). The app
makes no treatment claims, takes no measurements, and performs no diagnosis, so
it sits outside medical-device territory. That downgrades two items and keeps two.

**Still blocking:**

- [ ] **Contraindication review by a medical professional.** This is the actual
      physical-harm surface — neuropathy, DVT, pregnancy, burn risk in the
      remedies. Packet ready to send: `docs/clinical-review-packet.md`.
- [ ] **Legal pages reviewed by counsel.** Drafts ready:
      `docs/legal-drafts.md`. Indian counsel must specifically clear the Drugs
      and Magic Remedies (Objectionable Advertisements) Act 1954 question.
- [ ] **LICENSE file.** Repo has none; terms draft assumes all rights reserved.
- [ ] **Commercial vs non-commercial decision.** Vercel's Hobby plan permits
      personal, non-commercial use only. Monetising means moving to Pro.

**Downgraded to recommended:**

- [ ] Anatomical foot chart. The SVG is diagrammatic placeholder art, and the
      app says so in-product on the Explore tab. Commission a proper chart when
      budget allows — no longer launch-blocking.
- [ ] Practitioner sign-off on the 10 protocols. Valuable for credibility, not
      legally required given no efficacy is claimed.

**Done:**

- [x] **Evidence grades locked.** Audited: 20 graded items, 12 at C and 8 at D.
      Nothing above C. Re-run the audit if protocols change.

## Beta gate

The whole site can be put behind an access code. Controlled by environment
variables in Vercel (Settings → Environment Variables), then redeploy.

| Variable | Value | Effect |
|---|---|---|
| `BETA_GATE` | `on` | Gate is up. Anything else, or unset, means the site is open. |
| `BETA_CODES` | `mohan:heel-19,amy:sun-42` | Comma separated. `label:code` or a bare `code`. The label is never shown to users — it exists so you can tell whose code was used. |
| `BETA_SECRET` | long random string | Signs the session cookie. Changing it logs everyone out. |

**Turning it off:** set `BETA_GATE=off` and redeploy. Nothing else to undo.

**Adding a tester:** append `name:their-code` to `BETA_CODES`, redeploy, send
them the code. **Revoking one:** remove their entry and redeploy — but note
that a cookie they already hold stays valid for up to 30 days. To cut everyone
off immediately, change `BETA_SECRET`.

**One-tap links:** `https://vayusole.vercel.app/?code=heel-19` signs them in
and strips the code from the URL. Convenient, but anyone they forward the link
to gets in too — for a small closed beta that is usually a fair trade.

The cookie is HMAC-signed, httpOnly, secure, and expires after 30 days.
Forged, expired, and label-swapped cookies are all rejected.

## Audio

All sound is synthesised in the browser with the Web Audio API. There are no
audio files, no samples, and nothing licensed from anyone — so there is no
copyright or attribution obligation, nothing to host, and no bandwidth cost.

- A low drone (110Hz root, slight detune, fifth beneath, low-passed) whose
  level follows the breath cycle — swelling on the inhale, settling on the
  exhale
- A soft sine tone at each pressure transition: D4 on press, F4 on hold,
  A4 on release, lightly panned
- Off by default. The toggle is the user gesture that lets iOS start the
  audio context.

Deliberately not framed as binaural beats or anything with a claimed
physiological effect — that would be the first grade-A claim in an app that
grades nothing above C. It is an audible timing cue, nothing more.

## Evidence policy

Grades follow: A = strong systematic review, B = moderate clinical trial,
C = small or mixed studies, D = traditional use only.

Key sources are listed in the in-app Evidence tab. Primary references:
Wang et al. 2008 (J Adv Nurs); Ernst et al. 2011 (Maturitas);
McCullough et al. 2014 (PMC4026838); Australian Dept of Health Natural
Therapies Review 2024 (PROSPERO CRD42023394291).

## Disclaimer

Educational content only. Not medical advice, not a diagnosis, not a treatment.
