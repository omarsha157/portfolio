---
title: Self-managing app
slug: self-managing
order: 1
status: In progress
tagline: "From a runtime error to a fix proposal you can review."
summary: "An experiment in automating bug fixing safely. When the app logs an error, an AI tool tries to reproduce it with a failing test and proposes a fix as a pull request. Nothing ships without passing CI and a preview deployment."
description: "An in-progress experiment: turning a web app's runtime errors into tested fix pull requests that can be reviewed, with results published as they come in."
draft: true
---

## Problem

When a web app breaks in production, someone has to notice the error, work out how to reproduce it, write a fix and ship it safely. Letting an AI change production code directly is not safe, so the question is how much of that loop can be automated while every change stays tested, reviewable and reversible.

## My role

Architecture, the decisions on what the AI may and may not do, the test and CI design, and running it.

## Approach

1. **Error in** — a runtime error is captured with enough context to reproduce it. {{TODO: what context is captured}}
2. **Reproduce first** — before any fix, a test is written that fails because of the bug. No failing test, no fix.
3. **Fix as a pull request** — the AI proposes the fix as a PR, never as a direct change.
4. **CI checks** — the new test and the existing suite must pass.
5. **Preview** — the change runs in a preview deployment before release.
6. **Replay-based rollback** — {{TODO: one or two sentences on how replay decides a rollback}}

## Measured result

Results coming. The table below will be filled from real runs, including the fixes that were wrong and the bugs it could not solve.

| Bugs tested | Fixed correctly | Fixed wrongly | Unsolved | Cost per fix | Time per fix |
|---|---|---|---|---|---|
| {{TODO: in progress}} | {{TODO: in progress}} | {{TODO: in progress}} | {{TODO: in progress}} | {{TODO: in progress}} | {{TODO: in progress}} |

{{TODO: where the test bugs come from — real errors, seeded bugs, or both}}

## Known limits

- It is not finished, and there are no results yet.
- A generated test can pass for the wrong reason; a green CI run is not proof that the fix is right.
- {{TODO: limits you already know about}}
