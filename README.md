# Seibo Intern Task Board (MVP)

A simple React + Vite + Tailwind task board for coordinating Seibo interns.

## What this app includes

- Dashboard with task stats
- Task list + Kanban board
- Add/Edit/Delete tasks
- Filters by owner, category, priority, and status
- Basic handover tracker
- Basic social content tracker
- Local persistence with `localStorage`

## Tech stack

- React 19
- Vite 8
- Tailwind CSS 4

## Getting started

### 1) Install dependencies

```bash
npm install
```

### 2) Start development server

```bash
npm run dev
```

Then open the local URL printed by Vite (typically `http://localhost:5173`).

### 3) Run lint checks

```bash
npm run lint
```

### 4) Build for production

```bash
npm run build
```

### 5) Preview production build locally

```bash
npm run preview
```

## Notes

- This MVP is intentionally frontend-only.
- No backend, no login, no database.
- Data is stored in the browser via `localStorage`.

## Project scripts

- `npm run dev` – start dev server
- `npm run build` – create production build
- `npm run preview` – preview production build
- `npm run lint` – run ESLint
