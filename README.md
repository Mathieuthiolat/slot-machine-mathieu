# 🎰 Slot Machine - PixiJS

Basic slot machine game built with JavaScript (ES6) and PixiJS v8.

## 🚀 Features

- 5x3 reel grid using PixiJS
- Dynamic asset preloader with loading percentage
- Random spin system
- Multiline win display with scaling to fit viewport
- Responsive canvas (resizes with window)

## 📁 Project Structure

Project organized into small, focused modules to separate rendering, game logic, and configuration.

```
src/
├── classes/
│   ├── ReelGrid.js        # Reel rendering & logic
│   ├── WinCalculator.js   # Payline evaluation
│   └── Preloader.js       # Asset loading system
├── config/
│   ├── bands.js           # Reel definitions
│   ├── assets.js          # Assets definitions
│   ├── paylines.js        # Payline patterns
│   └── paytable.js        # Payout rules
└── main.js                # App entry point
```

## 🛠️ Tech Stack

- JavaScript (ES6)
- PixiJS v8

## 📦 Installation

```bash
npm install
npm run dev
```
