# Hackathon & AI‑Agent Development Instructions – SafeCity MVP

## Purpose of This File

This instruction file is **authoritative** and must be followed by the AI agent (and human developers) **throughout the entire development lifecycle** of the SafeCity MVP.

The AI agent must treat this file as **persistent memory** and re‑apply these rules at **every task, sub‑task, and phase** defined in `tasks-safe-city-mvp.md`.

---

## Core Objective

Demonstrate **step‑by‑step development from scratch**, showing:

* Clear problem understanding
* Incremental feature building
* Explicit technical reasoning
* Transparent decision‑making

⚠️ The evaluation is based on **process + evolution**, not just the final output.

---

## Absolute Rules (Non‑Negotiable)

1. ❌ **Single‑commit or bulk commits are NOT allowed**.
2. ✅ Development must follow the **task order and phases** defined in `tasks-safe-city-mvp.md`.
3. ✅ Each task or sub‑task must map to:

   * One logical change
   * One or more meaningful commits
4. ❌ Never skip phases, even if implementation seems trivial.

---

## AI Agent Operating Rules (VERY IMPORTANT)

The AI agent must:

1. **Read the current task number** before acting.
2. Work on **ONLY ONE sub‑task at a time**.
3. Never jump ahead to future tasks or files.
4. Stop immediately after completing the sub‑task.
5. Ask explicitly:

   > "Is this correct?"
6. Proceed only if the response is **"go"**.

If feedback is negative:

* Revise the SAME sub‑task
* Do NOT proceed forward

---

## Task‑Driven Development Alignment

For every task in `tasks-safe-city-mvp.md`, the AI agent must:

1. State clearly:

   * Task number (e.g., 3.2)
   * Task objective
2. Explain **what is being built and why**.
3. Implement or design ONLY what the task requires.
4. Ensure changes are limited to **relevant files only**.

---

## Commit Discipline (Mandatory)

Each completed sub‑task must result in at least one commit that:

* Has a **clear, descriptive message**, e.g.:

  * `feat: add FIR CSV parser`
  * `logic: hotspot density calculation`
  * `docs: explain insight generation logic`

Avoid:

* `final commit`
* `hackathon work`
* `changes`

Commit history must clearly narrate the project story.

---

## DSA & Logic Explanation Rules

For **every non‑trivial function or service**:

1. Identify whether a DSA or algorithm is used.
2. If used:

   * Name it clearly
   * Explain why it is appropriate
   * Mention time & space complexity
3. If NOT used:

   * Explicitly say so
   * Limit explanation to **2–3 lines only**

This applies strongly to:

* Filtering logic
* Hotspot detection
* Insight generation
* Geospatial calculations

---

## Phase Visibility Requirement

The AI agent must help preserve **visible phases** such as:

* Understanding & scoping
* Data modeling
* Core logic
* Visualization
* Insight generation
* Refinement

Each phase should be inferable from:

* Task order
* Commits
* Documentation

---

## Documentation Rules

At every major phase, the AI agent must:

* Add or update Markdown documentation explaining:

  * Decisions made
  * Assumptions
  * Trade‑offs

Documentation must prioritize **clarity over volume**.

---

## What the AI Agent Must NEVER Do

* ❌ Implement multiple tasks at once
* ❌ Skip explanation and jump to code
* ❌ Optimize prematurely
* ❌ Introduce features not listed in the task file
* ❌ Override or ignore this instruction file

---

## Evaluation Lens (Keep This in Mind)

Judges and reviewers should be able to:

* Follow the evolution of the system step by step
* Understand *why* each decision was taken
* Trust the correctness and intent of the implementation

---

## Final Reminder

⚠️ This instruction file acts as the **memory and guardrails** for the AI agent.

Every response, decision, and implementation must be checked against this file **before proceeding**.

**If there is a conflict:**

* This file > task file > implementation convenience

---

**End of AI‑Agent Instructions**
