---
title: Spatial UI
slug: spatial-ui
order: 2
status: In progress
tagline: "Everyday apps, rebuilt as spaces you act in."
summary: "An experiment in replacing flat app interfaces with first-person 3D scenes where you do the real action: a notes app where your hand writes, strikes through and erases on paper, or a shop where adding to cart means putting the item in the cart."
description: "An in-progress experiment: everyday app interfaces rebuilt as first-person 3D scenes in the browser, starting with a notes app."
draft: true
---

## Problem

Most apps use the same interface language: lists, buttons and forms. It works, but it ignores what people already know from doing the same things by hand. Headset interfaces have started to let people act on things directly in space. This project explores what that looks like on an ordinary screen, in a browser, and where it helps rather than gets in the way.

## My role

The concept, the architecture, the 3D scenes and interaction design, testing on real devices, and running it.

## Approach

- **The action is the interface.** Each app keeps its normal features, but you use them by doing the physical action. In the notes app, adding a note means a hand writes it out stroke by stroke, marking it done strikes a line through it, and editing erases it and writes it again. In a shop, you take items off the shelves and put them in a cart.
- **Seen in first person.** The camera is your eyes: you look down at the notebook on the desk, or along the aisle of the shop.
- **App logic stays separate from the scene.** The notes or the cart work the same without the 3D layer, so each app can also run as a plain interface.
- **A plain version is always there.** Screen readers, reduced motion, browsers without WebGL and slow phones get an ordinary, accessible interface for the same app.
- **Notes first.** The first app is a notes and to-do app. Other apps follow the same pattern, one at a time.

## Measured result

Results coming. These will be measured, not estimated:

| Measure | How it will be measured | Result |
|---|---|---|
| Frame rate on a mid-range phone | {{TODO: which phone}}, in-browser frame timing | {{TODO: in progress}} |
| Download size on a phone | Bytes transferred before the scene is usable | {{TODO: in progress}} |
| Task time, 3D vs plain | The same tasks done in both versions | {{TODO: in progress}} |

## Known limits

- It is not finished, and there are no results yet.
- Watching a note being written takes longer than it appearing at once, so the animations need to stay short and skippable.
- A 3D interface is not automatically better; the task-time comparison is there to find out where it is worse.
- {{TODO: limits you already know about}}
