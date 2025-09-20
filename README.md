# Color Mixer

A powerful web-based color mixing and palette generation tool built with React, TypeScript, and Vite. Create beautiful color palettes, check accessibility, and export to various formats.

## Features

- Interactive color mixing with gradient stops
- Real-time color previews
- Accessibility checking with contrast ratios
- Smart color generation (harmonies, shades, tints)
- Export to multiple formats (CSS, Tailwind, SCSS, JSON, etc.)
- Keyboard shortcuts and productivity features
- In-app help and documentation
- Privacy-focused with local storage only

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion (animations)
- Zustand (state management)
- Chroma.js (color manipulation)
- html2canvas (export functionality)
- Lucide React (icons)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd color-mixer
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:e2e` - Run end-to-end tests

## Deployment

### Netlify

1. Connect your GitHub repository to Netlify
2. The `netlify.toml` configuration is already set up for automatic deployment
3. Deploy from the main branch or set up preview deployments

### Vercel

1. Connect your GitHub repository to Vercel
2. The `vercel.json` configuration is already set up
3. Deploy from the main branch with automatic deployments

### Manual Deployment

1. Build the project: `npm run build`
2. The `dist/` folder contains all files needed for deployment
3. Upload the contents of `dist/` to your hosting provider

## Privacy & Data

Color Mixer is designed with privacy in mind:

- **Local Storage Only**: All your palettes and preferences are stored locally in your browser
- **No External Tracking**: No data is sent to external servers
- **Analytics Opt-out**: You can disable analytics tracking at any time
- **Data Control**: Clear your data anytime through browser settings

Access the privacy notice in the app by clicking the help button and navigating to the privacy section.

## Project Structure

```text
src/
├── components/     # Reusable UI components
│   ├── HelpPanel.tsx      # In-app help and documentation
│   ├── PrivacyNotice.tsx  # Privacy information modal
│   └── ...
├── hooks/         # Custom React hooks
├── stores/        # Zustand state stores
├── utils/         # Utility functions
│   ├── analytics.ts       # Analytics tracking utilities
│   └── ...
├── types/         # TypeScript type definitions
└── App.tsx        # Main application component
```

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for detailed release notes and version history.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
