# Vayusole — Legal Document Drafts

> **STATUS: DRAFT. NOT REVIEWED BY A LAWYER. DO NOT PUBLISH AS-IS.**
>
> These are starting points to hand to counsel, written to save billable time —
> not finished documents. They were drafted by an AI assistant, which is not a
> lawyer and cannot give legal advice.
>
> **Jurisdictions that need checking before publication:**
> - **India** (operator's base) — Digital Personal Data Protection Act 2023;
>   Consumer Protection Act 2019 and the misleading-advertisement rules;
>   **Drugs and Magic Remedies (Objectionable Advertisements) Act 1954**, which
>   covers remedies claimed to influence the structure or function of an organ.
>   This is the highest-priority item for Indian counsel.
> - **EU/UK** — GDPR, if users there are permitted.
> - **US** — FTC health-claim substantiation; state privacy laws.
>
> **Open commercial question:** the app is currently on Vercel's Hobby plan,
> which permits personal, non-commercial use only. If monetisation is intended,
> the hosting plan and these documents both change.

---

## Notes for counsel — what the product actually is

- A web app (PWA) presenting 10 guided foot-reflexology self-care protocols
- Content plus a timer. No sensors, no measurement, no diagnosis, no
  personalisation, no AI-generated advice at runtime
- Every protocol and remedy carries an evidence grade; nothing is graded above
  C, and the app publishes systematic reviews finding no effect
- The user presses their own feet. All physical action is self-applied
- **Current data position: no account, no analytics, no cookies, no
  persistence.** Session history exists in browser memory only and is destroyed
  on tab close. Nothing reaches a server.
- A Supabase integration exists in the codebase (`lib/supabase.js`) but is
  **not wired to any UI and does not run**. If activated it would store a user
  ID, a protocol name, and a timestamp. The privacy policy below has a clearly
  marked alternative section for that case.

---

# 1. Medical Disclaimer (draft)

**Vayusole is not medical advice.**

Vayusole provides educational and informational content about reflexology, a
complementary practice. It does not diagnose, treat, cure, or prevent any
disease or medical condition, and it makes no claim to do so.

**The evidence is limited.** No systematic review has demonstrated that
reflexology treats any specific medical condition. The most consistent finding
in the literature is a short-term reduction in anxiety and a sense of
relaxation in some people. That is not the same as treating an underlying
problem. Every protocol and remedy in this app is labelled with an evidence
grade, and nothing is graded above C.

**No professional relationship is created.** Using this app does not create a
doctor–patient, practitioner–client, or any other professional relationship
between you and Vayusole or its operator.

**Always consult a qualified healthcare professional** before starting, and
particularly if you are pregnant, have diabetes or neuropathy, have circulation
problems or a known or suspected blood clot, take regular medication, have had
recent surgery or injury, or have any infection or open wound on the foot.

**Never delay care.** Do not use this app instead of seeing a doctor, and never
stop or change prescribed medication because a session helped. If your symptoms
are severe, sudden, worsening, or unlike your usual pattern, seek medical
attention.

**In an emergency, contact your local emergency number or nearest hospital.
Do not use this app.**

**Stop immediately if anything hurts.** Pressure should feel firm, never sharp.

**Use is at your own discretion and risk.** You decide whether to follow a
protocol, and you accept responsibility for that decision.

*[Counsel: confirm whether Indian law requires any specific form of wording,
and whether the evidence-grading and no-efficacy-claim posture is sufficient to
stay outside the Drugs and Magic Remedies Act.]*

---

# 2. Privacy Policy (draft)

**Last updated:** `[DATE]`
**Operator:** `[LEGAL NAME / ENTITY]`, `[ADDRESS]`
**Contact:** `[EMAIL]`

## The short version

Vayusole does not collect your personal data. There is no account, no sign-up,
no analytics, no advertising, and no tracking cookies. We do not know who you
are.

## What we do not collect

- Name, email address, phone number, or any contact detail
- Health information, symptoms, or anything you select in the app
- Location data
- Advertising or cross-site tracking identifiers

## What stays on your device

Your session history — which protocols you completed and when — exists only in
your browser's memory while the app is open. It is never transmitted anywhere,
and it is destroyed when you close the tab.

## What our hosting provider processes

The app is served by Vercel Inc. Like any web host, Vercel processes technical
data necessary to deliver the page, which may include your IP address, browser
type, and the time of the request. We do not use this for analytics or
profiling. See Vercel's own privacy notice at `[LINK]`.

*[Counsel: confirm whether this makes us a data controller for server logs
under the DPDP Act / GDPR, and whether a processor agreement is required.]*

## Your rights

Because we hold no personal data about you, there is nothing for us to
disclose, correct, or delete. If you believe otherwise, contact us at the
address above.

## Children

This app is not directed at children. *[Counsel: advise on a minimum age and
whether the DPDP Act's verifiable parental consent requirement is engaged.]*

## Changes

We will post any change here with a new "last updated" date.

---

### ⚠️ ALTERNATIVE SECTION — only if Supabase accounts are switched on

*Delete this block if the app ships without accounts. If accounts are enabled,
the "short version" above must be rewritten — it would no longer be true.*

If you create an account, we collect and store:

- Your email address and an account identifier, to sign you in
- A record of each session you mark complete: the protocol name and a timestamp

**This session record is health-related information about you.** It is stored
with Supabase Inc. and protected by row-level security so that only your
account can read it. It is never sold, never shared with advertisers, and never
used for profiling.

- **Retention:** kept until you delete your account, then erased within
  `[N]` days
- **Your rights:** access, correction, deletion, and export, by emailing
  `[EMAIL]`; we respond within `[N]` days
- **Cross-border transfer:** Supabase may store data outside your country
  *[Counsel: DPDP Act transfer rules; GDPR Article 46 safeguards]*
- **Breach notification:** we will notify affected users and the relevant
  authority as required by law

---

# 3. Terms of Use (draft)

**Last updated:** `[DATE]`

## 1. Acceptance

By using Vayusole you agree to these terms. If you do not agree, do not use it.

## 2. What the service is

Vayusole is free educational content about reflexology, presented with a timer.
It is not a medical device, not medical advice, and not a substitute for
professional care. The Medical Disclaimer forms part of these terms.

## 3. Your responsibilities

- You are responsible for deciding whether a protocol is appropriate for you
- You confirm you have read the safety information and contraindications
- You will consult a healthcare professional where the app advises it
- You will stop immediately if anything is painful
- You will not use the app in an emergency

## 4. Eligibility

You must be `[AGE]` or older. *[Counsel: set this.]*

## 5. Intellectual property

The app, its text, protocols, evidence summaries, design, and code are
© `[YEAR]` Balaji Veeramani, all rights reserved. You may use the app
personally. You may not copy, redistribute, or create derivative works without
written permission. *[Counsel: confirm this matches the repository licence — the
repo currently has no LICENSE file, which should be fixed either way.]*

## 6. Third-party content

Cited studies belong to their publishers; we summarise findings and link out.
Product categories mentioned in remedies (Epsom salt, arnica, and so on) are
generic and not endorsements, and we receive no commission.

## 7. No warranty

The service is provided "as is" and "as available", without warranty of any
kind. We do not warrant that it is accurate, complete, uninterrupted, or fit
for any particular purpose.

## 8. Limitation of liability

*[Counsel: draft this. Note that Indian consumer protection law limits how far
liability for personal injury can be excluded, and a clause that overreaches
may be unenforceable in full. Please advise what is actually achievable rather
than boilerplate.]*

## 9. Changes and availability

We may modify or discontinue the service at any time without notice.

## 10. Governing law and disputes

These terms are governed by the laws of India, and the courts of
`[CITY]` have exclusive jurisdiction. *[Counsel: confirm, and advise on
consumer-forum rights that cannot be contracted away.]*

## 11. Contact

`[EMAIL]`

---

## Checklist before publishing

- [ ] Counsel has reviewed all three documents
- [ ] Indian counsel has specifically cleared the Drugs and Magic Remedies Act question
- [ ] Operator legal name, address, and contact email filled in
- [ ] Minimum age set
- [ ] Commercial vs non-commercial decided, and hosting plan matched to it
- [ ] LICENSE file added to the repository
- [ ] Clinical review packet signed and any amendments applied to the app
- [ ] Privacy policy matches what the app actually does on the day it ships
