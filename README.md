# Taikai

A full-stack web application for tournament bracket management geared towards kendo competitions.

## Features

- Single elimination tournament bracket generation
- Participant management with interactive drag-and-drop
- Match scoring and score tracking for the entire bracket
- Automatic bye match handling

## Tech Stack

**Frontend:** React (Vite) + Typescript, Zustand, TailwindCSS + Shadcn/ui, Tanstack Query, Vitest + React Testing Library

**Backend:** Node.js + Express + Typescript, PostgresSQL, Knex.js

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm
- PostgresSQL

### Installation

1. Clone the repository

```bash
git clone https://github.com/s3lven/taikai
cd taikai
```

2. Install dependencies

```bash
  # Install backend dependencies
  cd backend
  npm install

  #Install frontend dependencies
  cd ../frontend
  npm install
```

3. Setup environment

```bash
cd backend
cp .env.example .env
# Update .env with your connection string
```

4. Initialize database

```bash
cd backend
npm run migrate:latest
```

### Development

1. Start backend server

```bash
cd backend
npm run dev
```

2. Start frontend development server

```bash
cd frontend
npm run dev
```

## Roadmap

### Core Features Enhancement

- [ ] User authentication for bracket managers
  - [ ] Login and Signup flow with Google or Github
  - [ ] Users create and see their own tournaments
- [ ] User Interface Enhancement
  - [ ] Responsive design and potentially different interface for mobile devices
  - [ ] Snappier, intuitive score submission
  - [ ] Bracket Panel organization
  - [ ] Better results reporting

### Future Considerations

- [ ] Double Elimination bracket support
- [ ] Round Robin bracket support
- [ ] Portal for participant registration with Stripe
- [ ] Multi-language support
- [ ] Team matches with participant details and match types
- [ ] Mobile App development
- [ ] Bulk Import participants function
- [ ] Integrate WebSocket for live match updates for the editor or spectator view
