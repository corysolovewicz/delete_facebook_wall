# 🧹 Facebook Post Cleaner

A Tampermonkey/Greasemonkey userscript that automatically scrolls your Facebook feed and removes your posts — either by **deleting** them or **removing your tag** — including support for dynamic content loading and hidden menu expansion.

---

## ⚙️ Features

- 🔄 **Infinite Scroll Support**: Scrolls down to load more posts.
- 🧠 **Dynamic DOM Awareness**: Handles Facebook's lazy loading and re-rendering.
- 🧽 **Automated Cleanup**:
  - Clicks each post’s `Actions for this post` menu
  - Deletes posts via **"Delete post"**
  - If delete not available, attempts to **"Remove tag"**
- 🔍 **Smart Expansion**: Clicks **"See X More"** entries to reveal hidden options.
- 💨 **Failsafe**: If no options are available, dismisses the modal cleanly with `Escape`.
- 🔘 **User Control**: Adds a floating "🧹 Clean Posts" button to your Facebook session.

---

## 🛠 Installation

1. Install a userscript manager:

   - [Tampermonkey (Chrome)](https://tampermonkey.net/?ext=dhdg&browser=chrome)
   - [Violentmonkey (Firefox)](https://addons.mozilla.org/en-US/firefox/addon/violentmonkey/)
   - [Greasemonkey (Firefox)](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/)

2. Install the script via:

   - [RAW GitHub Link](https://raw.githubusercontent.com/your-username/facebook-post-cleaner/main/cleaner.user.js) *(replace with actual path)*

3. Navigate to `facebook.com` and click the 🧹 **Clean Posts** button to begin.

---

## 🔐 Permissions

This script only runs on:

```javascript
// @match        https://www.facebook.com/*
```

It does not collect or transmit any data.

---

## ⚠️ Disclaimer

This tool is experimental. Facebook’s DOM is subject to change, and this script may break or require updates over time. Use at your own discretion.

---

## 📁 Repository Structure

```bash
.
├── cleaner.user.js   # The actual userscript
└── README.md         # This file
```

---

## 🧑‍💻 Author

Made with ❤️ by Cory Solovewicz

Contributions and forks welcome!
