# OWL Prototype - Claude Code Setup

## Project Overview
A React + TypeScript prototype using shadcn/ui components with a greyscale Tailwind theme. Optimized for rapid iteration and efficient collaboration with Claude Code.

## Tech Stack
- **Framework**: React 19 + TypeScript
- **Build**: Vite 5
- **Styling**: Tailwind CSS 4 + PostCSS
- **UI Components**: shadcn/ui
- **Icons**: lucide-react

## Project Structure
```
src/
├── components/ui/        # shadcn/ui components
├── lib/utils.ts         # Utility functions (cn for class merging)
├── App.tsx              # Main app component
├── index.css            # Global styles + CSS variables
└── main.tsx             # Entry point
```

## Commands
- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Adding shadcn/ui Components

Copy component files from shadcn/ui registry into `src/components/ui/`. Each component is self-contained with:
- Radix UI primitives for accessibility
- CVA for styling variants
- Tailwind CSS for styling
- TypeScript definitions

Example: Button, Card, Dialog, Select, etc.

## CSS Variables (Greyscale Theme)

The greyscale theme uses neutral greys for all colors:
- `--background`: Light/dark background
- `--foreground`: Text color
- `--primary`: Primary action color (dark grey)
- `--secondary`: Secondary elements
- `--muted`: Muted text/backgrounds
- `--border`: Border colors
- `--input`: Input field backgrounds
- `--ring`: Focus ring color

Light mode uses light backgrounds with dark text. Dark mode inverts.

## Development Tips
1. Run `npm run dev` and test components in browser
2. Use Tailwind utility classes directly; avoid custom CSS when possible
3. Components should be functional and simple—no unnecessary abstractions
4. Type all props with TypeScript
5. Use `cn()` utility to merge Tailwind class names safely

## Claude Code Workflow
- Ask me to add components from shadcn/ui registry
- Request specific features for components
- Make UI changes and test in dev server
- I'll handle imports, types, and styling

## Notes
- No ESLint currently (can add if needed)
- Greyscale theme is configured in `src/index.css`—customize CSS variables there
- All dependencies are production-ready
