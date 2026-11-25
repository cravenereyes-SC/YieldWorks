# YieldWorks - Operations Management

Manage your Star Citizen salvage and mining operations efficiently with YieldWorks. Track profit, loss, work orders, crew, and auto-fill data from in-game screenshots.

## Features

### Work Order Management
- Track mining and salvage operations in real-time
- Monitor work order progress with live timers
- Record expenses, crew assignments, and yields

### 📸 Screenshot Auto-Fill (New!)
Automatically extract work order data from in-game screenshots using OCR:
- **Supported Data**: Location, refining process, duration, cost, current units, final yield
- **Technology**: Client-side OCR with Tesseract.js
- **Privacy**: All processing happens locally on your computer
- **Accuracy**: 90%+ for clean screenshots

**How to use**: Create a work order → Click "📷 Upload Screenshot" → Select your screenshot → Watch fields auto-populate!

See [SCREENSHOT_AUTOFILL_GUIDE.md](./SCREENSHOT_AUTOFILL_GUIDE.md) for detailed instructions.

## Folder structure

- index.html: Main app entry point
- public/: Static assets for images/icons/files
- src/styles/: Global and modular styles
- src/scripts/: App logic and modules
- src/components/: Reusable UI snippets/components
- src/pages/: Additional page templates

## Quick start

Option 1: Open index.html directly in your browser.

Note: Opening index.html directly will always open in a normal browser tab.

Option 2: Run a local static server (recommended).

Example with Python:

python -m http.server 5500

Then open:

http://localhost:5500

## Manufacturer HUD Themes

The app includes a Star Citizen-inspired theme system you can switch from the HUD Theme panel in the header.

Available manufacturer themes:

- RSI
- Drake Interplanetary
- Origin Jumpworks
- Aegis Dynamics
- Anvil Aerospace
- Crusader Industries
- MISC

Theme preference is saved automatically in your browser for the next launch.

Each manufacturer now includes its own HUD metric labels/values in the preview tiles for a more authentic cockpit flavor.

## HUD Visual Tuning Modal

Use the Visual Tuning button in the theme panel to open settings and adjust:

- Glow Intensity
- Scanline Strength

Changes apply live and are saved automatically per browser.

## One-click launch (tabless app window)

Double-click Click to open.cmd to:

- Start a local server on port 5500 (if not already running)
- Open Microsoft Edge in app window mode without tab bar

Optional: run from terminal with a custom port:

powershell -ExecutionPolicy Bypass -File .\launch-app.ps1 -Port 5600

## Documentation

- **[SCREENSHOT_AUTOFILL_GUIDE.md](./SCREENSHOT_AUTOFILL_GUIDE.md)** - User guide for screenshot auto-fill feature
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Technical overview and architecture
- **[CODE_EXAMPLES.md](./CODE_EXAMPLES.md)** - Code reference and integration examples
