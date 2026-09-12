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

- [ ] **Foot chart is illustrative, not anatomical.** The SVG in
      `components/VayusoleApp.jsx` is diagrammatic placeholder art. Commission or
      license a proper chart before anyone outside the test group sees this.
- [ ] **Protocol review by practitioner.** All 10 protocols need sign-off from a
      qualified reflexology practitioner for technique accuracy.
- [ ] **Contraindication review by a medical professional.** Separate from the
      practitioner review. Diabetes, neuropathy, DVT, and pregnancy warnings need
      review by someone medically qualified.
- [ ] **Legal pages.** Disclaimer, privacy policy, terms of use.
- [ ] **Evidence grades locked.** Nothing above C. Re-verify if protocols change.

## Evidence policy

Grades follow: A = strong systematic review, B = moderate clinical trial,
C = small or mixed studies, D = traditional use only.

Key sources are listed in the in-app Evidence tab. Primary references:
Wang et al. 2008 (J Adv Nurs); Ernst et al. 2011 (Maturitas);
McCullough et al. 2014 (PMC4026838); Australian Dept of Health Natural
Therapies Review 2024 (PROSPERO CRD42023394291).

## Disclaimer

Educational content only. Not medical advice, not a diagnosis, not a treatment.
