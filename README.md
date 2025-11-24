# Row Counter

A simple, focused knitting row counter web app.

## Features

- **Setup Flow**: Configure your knitting pattern (increase/decrease mode, current stitches, frequency)
- **Row Counter**: Track your rows with automatic cycling
- **Smart Alerts**: Visual and audio alerts when you reach increase/decrease rows
- **Persistent Storage**: Your progress is saved automatically to localStorage
- **Mobile-First**: Touch-friendly, responsive design

## How It Works

1. **Setup**: Tell the app:
   - Are you increasing or decreasing stitches?
   - How many stitches do you currently have?
   - Every how many rows do you increase/decrease?

2. **Count**: 
   - Tap "Row X Done" after completing each row
   - The counter cycles from 1 to your frequency (e.g., 1→2→...→8→1)
   - On the adjustment row, you'll see a warning banner and hear a beep
   - Stitches automatically adjust when you complete the adjustment row

3. **Reset**: Change your setup anytime with "Reset & Change Setup"

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development

```bash
npm run dev
```

Opens the app at http://localhost:3000

### Build for Production

```bash
npm run build
```

### Run Tests

```bash
npm run test
```

## Project Structure

```
row-counter/
├─ public/              # Static files
├─ src/
│  ├─ index.js         # App entry
│  ├─ app/             # Main shell + routing
│  ├─ screens/         # Setup & Counter screens
│  ├─ state/           # Pure counter logic
│  ├─ storage/         # localStorage wrapper
│  ├─ ui/              # Reusable components
│  ├─ styles/          # CSS files
│  └─ utils/           # Helpers (sound)
└─ tests/              # Unit tests
```

## Technologies

- React 18 (function components + hooks)
- Vite (build tool)
- Web Audio API (for beep sounds)
- localStorage (for persistence)

