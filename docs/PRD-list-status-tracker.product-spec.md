---
spec_format_version: "0.1"
title: "SF + NYC network: list status tracker"
artifact_type: "prd"
spec_revision: 1
author: "Hermes for Krish"
created_at: "2026-10-26T00:00:00Z"
updated_at: "2026-10-26T00:00:00Z"
custom_sections:
  - id: "current-state"
    label: "Current State (code today)"
    after: "product-summary"
  - id: "reference-patterns"
    label: "Reference patterns (verified)"
    after: "solution"
---

# Problem
Krish is working through the lists on sf-nyc-network.vercel.app (one row per list, e.g. "Suds · SF · Investors") to find people for the SF coffee sprint. Nothing on the site records which lists he has already been through, so he has to remember it. The lists also overlap heavily (235 of the 462 people in Suds · SF · Investors are in another list too), so each new list repeats people he has already looked at.

# Hypothesis
If every list has a status (To do / Processing / Done / Skipped), plus a count of people he hasn't seen yet, Krish will get through all 33 SF lists without re-reading the same people, because the home page shows what's left and each list can hide the people he has already been through.

# Product Summary
The home page gets a Status column with a pill you tap to change, one progress bar with a summary line, and a Status filter. Each list page gets the same status control at the top, a "Hide already seen" toggle, and a "Mark done & open next" button at the bottom. Statuses are saved in Convex, so they're the same on his phone and laptop.

# Current State (code today)
- Static site: `index.html` (home), `list.html` (one list), `app.js`, `style.css`, `data.json` (5,461 people). Deployed to Vercel.
- Home renders 11 source groups × city × role = 66 lists (33 with the SF filter). Columns: List · City · Role · People · 2+ lists · 1K–20K. `index.html` caps the page at 880px wide.
- A list is identified by its URL: `src` + `city` + `role` (e.g. `src=itzsuds&city=SF&role=investors`).
- Convex `groovy-labrador-571` (shared with sf-coffee-list) has two tables: `hearts` (17 hearted today) and `sfcPlacements`. Neither is touched by this PRD.
- Phone (414px): City and Role columns are hidden.

# Scope
```productspec-scope
in:
  - Include a status per list (To do, Processing, Done, Skipped), keyed by source + city + role, with To do as the default for any list that has never been set.
  - Include a Status column on the home page with a pill that opens a small menu of the four statuses; tapping the pill must not open the list.
  - Include one thin progress bar and one summary line under the City/Role filters ("2 of 33 SF lists done · 2 processing · 1 skipped · 28 to do"), counted for whatever City/Role filter is on.
  - Include a Status filter row on the home page (All · To do · Processing · Done · Skipped, with counts) that hides non-matching rows and empty group headers.
  - Include a New column on the home page showing how many people in that list are not in any list marked Done.
  - Include a ♥ column on the home page showing how many hearted people are in that list.
  - Include a Status segmented control on each list page, under the subtitle, that saves immediately.
  - Include "N new to you" in the list page subtitle and a "Hide N already seen" toggle next to "Hide 250K+", on by default once at least one list is Done.
  - Include a bar at the bottom of each list page with "Skip list" and "Mark done & open next", where next is the next To do list in home-page order under the same city.
  - Include a new Convex table and file for statuses (listStatus: list, set) and leave hearts and sfc functions exactly as they are.
  - Widen the home page from 880px to 1040px so the new columns fit, and on phones hide People, 2+ lists, 1K–20K and ♥ so List · New · Status fit at 414px with no sideways scroll.
out:
  - Do not auto-change a status when a list is opened; status only changes when Krish sets it.
  - Do not track progress inside a list (scroll position, which people were looked at one by one).
  - Do not add notes per list, history of changes, or who changed what.
  - Do not add a login or password.
  - Do not change list membership, the regexes, data.json or the sf-coffee-list site.
  - Do not change the hearts or sfcPlacements tables or their functions.
cut:
  - Cut the ♥ column first if time is tight.
  - Cut the "Mark done & open next" bar (keep the top status control) if time is tight.
```

# Solution
**Home page (mock A, B, D)**
- New columns at the end: **New** (blue number; "—" when the list itself is Done), **♥** (pink count, "·" when none), **Status** (pill).
- Pills: To do = white outline, Processing = amber, Done = green with ✓, Skipped = grey struck-through. Done and Skipped rows are greyed so the open work stands out.
- Tap a pill → a small menu of the four statuses with a ✓ by the current one. Picking one saves straight away and updates the bar, the filter counts and every New number.
- Progress: one thin bar (green done, amber processing, grey skipped) + one line. No stage strip, no extra cards.
- Status filter sits under the bar. "To do" is the useful one when he's working: it shows only what's left.

**List page (mock C)**
- Under the subtitle: `Status  [To do | Processing | ✓ Done | Skipped]`.
- Subtitle adds "**7 new to you** (40 were in lists you've marked done)".
- "Hide 40 already seen" checkbox next to "Hide 250K+". On by default; untick to see everyone.
- Bottom bar: "Finished this list? Next to do: Surya follows · SF · Founders" + `Skip list` + `✓ Mark done & open next`.

**"Seen" rule (plain):** a person counts as seen if they're in any list you've marked Done. Processing and Skipped don't count, so skipping a list never hides anyone.

**Data:** Convex table `listStatus { key: "itzsuds|SF|investors", status, at }`, index by key. `listStatus:list` returns all rows (≤ ~70); `listStatus:set { key, status }` upserts. Pages load statuses alongside data.json and hearts, the same way hearts load today. New counts are computed in the browser.

# Reference patterns (verified)
- Status pill with a dropdown and a status filter: Notion database Status property, Linear issue status. Krish's own Warm Capital CRM uses the same grouped-table + pill pattern.
- One thin bar + one summary line: Launch OS progress header (his preferred progress display).
- Table, filters, chips and colours: this site's own `style.css` (`.seg`, `.rw-t`, `.ch`, `.btn`, `.btn2`). No new visual language.
- Load and save: the existing `hearts:list` / `hearts:toggle` pattern in `app.js`.

# Acceptance Criteria
```productspec-acceptance-criteria
- id: AC-1
  criterion: When a list has never been set, its pill reads "To do" on the home page and the To do option is selected on its list page.
- id: AC-2
  criterion: When Krish picks Done from a home-page pill, the row greys out, the bar and summary line update, and after a reload on another device the list still shows Done.
- id: AC-3
  criterion: When Krish taps a status pill, the list does not open; tapping anywhere else on the row still opens the list.
- id: AC-4
  criterion: Given SF is selected, the summary line counts only the 33 SF lists and its four numbers add up to 33.
- id: AC-5
  criterion: When the Status filter is set to To do, only To do rows show and source groups with no matching rows are hidden.
- id: AC-6
  criterion: Given lists A and B are Done, the New number for list C equals the people in C who are in neither A nor B, and Done lists show "—".
- id: AC-7
  criterion: On a list page with "Hide already seen" ticked, no person from a Done list is shown and the footer says how many are hidden; unticking shows everyone again.
- id: AC-8
  criterion: When Krish clicks "Mark done & open next", the current list becomes Done and the next To do list under the same city opens; if none are left, the button reads "All done · back to overview".
- id: AC-9
  criterion: At 414px wide the home table shows List, New and Status with no horizontal scroll (document scrollWidth = 414).
- id: AC-10
  criterion: After deploy, hearts:list, hearts:toggle, sfc:list and sfc:setMany still work and sf-coffee-list.vercel.app loads with its placements unchanged.
```

# Success Metrics
```productspec-success-metrics
- id: SM-1
  metric: sf_lists_marked_done_or_skipped
  target: "33 of 33"
  window: before the SF trip
- id: SM-2
  metric: people_shown_already_seen
  target: "0 with Hide already seen on"
  window: every list page
- id: SM-3
  metric: status_set_errors
  target: "0"
  window: first week
```

# Rollout
1. Backend: add `convex/listStatus.ts` + the table to `schema.ts`, deploy to groovy-labrador-571 with `npx convex dev --once` style push, smoke-test through the HTTP API, then check hearts/sfc still return.
2. Home page, then list page.
3. QA script (Playwright) per AC on a local server, then on live after the Vercel deploy. Test statuses are cleared afterwards so he starts at 0 done.

# Risks
- Shared Convex deployment: a schema push could break sf-coffee-list. Mitigation: new table only, all existing tables and functions unchanged, AC-10 checks both sites.
- Anyone with the link can change statuses (same as hearts today).
- "Seen" by list membership is broad: if he only skimmed a Done list, its people are still hidden elsewhere. The toggle lets him see them again.

# Open Questions
1. Status names: To do / Processing / Done / Skipped? Default: yes, these four.
2. Should opening a list set it to Processing automatically? Default: no, manual only (predictable).
3. Should Processing lists also count as "seen"? Default: no, only Done.
4. Phone: hide People, 2+ lists, 1K–20K and ♥ so Status fits? Default: yes (desktop keeps every column).
5. Should statuses also cover the "unclear role" lists linked in the note under the table? Default: yes on their list pages, but they stay out of the home table and the bar.
