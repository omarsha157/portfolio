---
title: One app, many worlds
slug: many-worlds
order: 2
status: In progress
tagline: "One set of features, many interfaces."
summary: "An experiment in presenting the same feature modules as different 3D scenes, such as a car cockpit, an office or a small town, chosen by a config file, with a plain 2D version generated from the same config."
description: "An in-progress experiment: one set of features presented as different 3D scenes from a config file, with a generated 2D version."
draft: true
---

## Problem

Different clients want the same features presented in very different ways. Rebuilding the interface for each one is slow and duplicates feature code. A 3D interface also has to work for people who can't or don't want to use it: screen readers, reduced motion, no WebGL, weak phones.

## My role

Architecture, the config format and the rules that keep scene code and feature code apart, testing on real devices, and running it.

## Approach

- **A world is a config file.** It lists the models, the camera positions and the hotspots that tie an object to a feature — the steering wheel, the desk drawer, the town hall.
- **Features don't know which world they're in.** Changing the world means writing a new config and adding models, not touching feature code.
- **2D comes from the same config.** Every hotspot also becomes an ordinary page section and link, so the 2D version is generated, not maintained by hand. It is used automatically when 3D can't run well.

## Measured result

Results coming. These will be measured, not estimated:

| Measure | How it will be measured | Result |
|---|---|---|
| Time to build a new world from a brief | Clock time from written brief to working world | {{TODO: in progress}} |
| Frame rate on a mid-range phone | {{TODO: which phone}}, in-browser frame timing | {{TODO: in progress}} |
| Task time, 3D vs 2D | The same tasks done in both versions | {{TODO: in progress}} |

## Honest limits

- It is not finished, and there are no results yet.
- A 3D interface is not automatically better; the task-time comparison is there to find out when it is worse.
- {{TODO: limits you already know about}}
