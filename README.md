# TaskFlow – React + Vite + Tailwind + shadcn/ui

A small task manager built for the class challenge.

## Run it

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually http://localhost:5173).

## Stack
- Vite + React 18
- Tailwind CSS v4 (`@tailwindcss/vite`)
- shadcn/ui components (Button, Input, Card, Badge) in `src/components/ui`
- React Router (`useNavigate`)

## Where each hook is used

| Hook | File | Purpose |
|------|------|---------|
| `useState` | Login.jsx, Dashboard.jsx | input text, tasks list, filter, dark mode, user |
| `useEffect` | Login.jsx | if already logged in, skip to dashboard |
| `useEffect` | Dashboard.jsx | guard page, save tasks, update tab title, dark mode class |
| `useNavigate` | Login.jsx, Dashboard.jsx, NotFound.jsx | go to `/dashboard`, back to `/`, home from 404 |

## Pages
- `/` Login – enter a name
- `/dashboard` – add, complete, delete, filter tasks (saved in localStorage)
- anything else – 404

## Adding more shadcn components
```bash
npx shadcn@latest add dialog
```
(`components.json` is already configured.)
