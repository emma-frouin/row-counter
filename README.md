# Tricoti 🧶

Your knitting companion - track rows, stitches, and time across all your projects.

## Features

- **Multi-Project Support**: Create and manage multiple knitting projects
- **Flexible Counters**: Increase, decrease, or constant stitch modes
- **Pattern Row Tracking**: See both pattern position (1-6) and total row count
- **Smart Alerts**: Visual and audio alerts on increase/decrease rows
- **Project Timer**: Track how long you spend on each project
- **Always-Editable Notes**: Jot down notes that auto-save
- **Cloud Sync**: Sign in to access your projects from any device
- **Mobile-First**: Touch-friendly, responsive design

## How It Works

1. **Create a Project**: Name your project, add yarn info and pattern links
2. **Add Counters**: Set up increase/decrease/constant phases
3. **Count**: Tap "Row X Done" after completing each row
4. **Track Time**: Start/stop the timer to see how long projects take

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

## Project Structure

```
tricoti/
├─ public/              # Static files & PWA manifest
├─ src/
│  ├─ index.jsx         # App entry
│  ├─ app/              # Main shell + routing
│  ├─ screens/          # Auth, Projects, Counter screens
│  ├─ state/            # Counter logic
│  ├─ firebase/         # Auth & Firestore services
│  ├─ ui/               # Reusable components
│  ├─ styles/           # CSS files
│  └─ utils/            # Helpers (sound)
└─ tests/               # Unit tests
```

## Technologies

- React 18
- Vite
- Firebase (Auth + Firestore)
- Web Audio API
- PWA-ready
