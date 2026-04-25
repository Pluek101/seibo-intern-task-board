# Seibo Intern Task Platform (MVP v1)

This is a lightweight Trello-style task management MVP for Seibo summer interns.
It is designed to be simple, clear, and easy for non-technical users.

## Purpose

Makoto requested a practical intern task board where interns can:
- share what they are working on,
- track progress clearly,
- and hand over work smoothly.

This first MVP keeps only essential features.

## Tech stack

- React + Vite
- Tailwind CSS
- Frontend only
- `localStorage` for data persistence

## Scope of this MVP

The app has 4 sections:
1. Task Board (To Do / In Progress / Blocked / Done)
2. Interns List
3. Handover Tracker
4. LinkedIn / SNS Tracker

## How to run locally

### 1) Install dependencies

```bash
npm install
```

### 2) Start development server

```bash
npm run dev
```

Open the local URL shown in the terminal (usually `http://localhost:5173`).

### 3) Lint

```bash
npm run lint
```

### 4) Build

```bash
npm run build
```

## Data storage

- Task data is stored in browser `localStorage`.
- No backend, no login, no database.
- Clearing browser storage will reset saved tasks.

## Notes

- This is **MVP v1** intended for quick internal review.
- The design intentionally avoids over-engineering.
