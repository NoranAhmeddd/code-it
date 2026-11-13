# Code It

A competitive programming and learning platform: practice problems,
live contests, learning paths, and communities.

## Structure
- `frontend/`: React + TypeScript + Vite + Tailwind
- `backend/`: Go REST API and judge workers
- `docs/`: spec, API contract, architecture

## Run the frontend
    cd frontend
    npm install
    npm run dev

## Run the backend
    cd backend
    go run ./cmd/api

## Roadmap
- [ ] Frontend with mock data
- [ ] Go REST API (auth, problems, submissions)
- [ ] Judge system
- [ ] Live contests via WebSocket
