# 🌳 ZenGrowth: The Mindful Focus Companion

[![Status](https://img.shields.io/badge/Status-In_Review-yellow.svg)]()
[![Platform](https://img.shields.io/badge/Platform-Microsoft_Edge-blue.svg)]()

> **Link to Edge Add-ons Store:** *[Coming Soon - Pending Microsoft Approval]*

## 📌 The Problem
Web browsers are designed for infinite exploration, which often leads to "time blindness" and digital hyperactivity. Standard website blockers are easily bypassed and fail to address the underlying psychological impulse to procrastinate. 

## 💡 The Solution
ZenGrowth is a local-only browser extension that replaces aggressive blocking with mindful friction and visual feedback. It bridges the gap between digital wellness and active productivity.

### Key Features
* **The Digital Bonsai (Real-time Feedback):** A persistent CSS-animated tree in the Edge Sidebar that grows when you focus on work and wilts when you visit distracting sites.
* **The Goal Mirror (Psychological Friction):** Intercepts visits to distracting sites with a 5-second overlay displaying the user's uploaded "Why" (a personal photo) and top 3 priorities (e.g., studying for an exam, building a portfolio).
* **Persistent Nudges (Time Awareness):** If the user bypasses the mirror, a center-screen intervention triggers every 60 seconds to quantify the exact amount of time wasted.
* **Tab Pressure Valve:** Monitors active tabs and alerts the user when they exceed their custom cognitive limit (e.g., 8 tabs), preventing digital clutter.

## 🛠️ Technical Architecture
* **Framework:** Manifest V3 (Chromium)
* **Languages:** Vanilla JavaScript, HTML5, pure CSS animations (No heavy UI libraries).
* **Storage:** `chrome.storage.local` (100% private, device-level storage. Zero external database calls).
* **Background Processing:** Utilizes `chrome.alarms` for lightweight, interval-based focus scoring to preserve CPU/battery life.

## 🔒 Privacy First
ZenGrowth respects user privacy by design. It does not track, store, or transmit browsing history or personal data to any external servers. Read the full [Privacy Policy](PRIVACY.md).

## 🚀 Installation (Developer Mode)
While waiting for the official store release, you can run ZenGrowth locally:
1. Download or clone this repository.
2. Open Microsoft Edge and navigate to `edge://extensions/`.
3. Toggle on **Developer mode** in the bottom left corner.
4. Click **Load unpacked** and select the `ZenGrowth` folder.
