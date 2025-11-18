# My Blog App — Server

This repository contains the backend API for the My Blog App. The server is a Node.js + Express application that provides CRUD endpoints for blogs and writers and persists data to MongoDB (Atlas).

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Setup & Run](#setup--run)
- [API Overview](#api-overview)
- [Database](#database)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License & Contact](#license--contact)

---

## Overview

The `server/` folder implements a RESTful API used by the frontend (`client/`). It follows a modular structure (controllers, services, models) with centralized error handling.

Use this README to configure, run, and deploy the server locally or to production.

## Features

- Create, read, update, and delete blog posts
- Create, read, update, and delete writers/authors
- Clear separation of concerns (controllers, services, models)
- Centralized error middleware
- MongoDB Atlas integration

## Tech Stack

- Node.js
- Express
- MongoDB (Atlas)
- npm

## Repository Structure

Key files and folders (inside `server/`):

- `server.js` — server entry (may also use `src/app.js`)
- `package.json` — npm scripts and dependencies
- `src/`
  - `app.js` — Express app configuration
  - `config/` — DB & configuration helpers
  - `domains/` — feature folders (`blog`, `writer`) with controllers, services, models
  - `routes/` — route definitions
  - `middlewares/` — error handler, other middleware
- `.env` — local environment variables (do NOT commit)

## Prerequisites

- Node.js v16+ (recommended)
- npm (or yarn)
- MongoDB Atlas account (or a running MongoDB instance)
- Git

## Environment Variables

Create a `.env` file in the `server/` folder. Example variables:

```
MONGO_URI=mongodb+srv://<USER>:<PASSWORD>@<CLUSTER>.mongodb.net/<DBNAME>?retryWrites=true&w=majority
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

Notes:

- Replace `<USER>`, `<PASSWORD>`, `<CLUSTER>`, and `<DBNAME>` with your Atlas credentials.
- Keep `.env` out of version control. Remove duplicate or stray lines if present.

## Setup & Run

Open a bash terminal (Windows: `bash.exe`) and run the following commands.

1. Install dependencies for the server:

```bash
cd server
npm install
```

2. Start the server

If `package.json` defines a dev script (e.g., `dev` using `nodemon`) use:

```bash
npm run dev
```

Or start directly with Node:

```bash
npm start
# or
node server.js
```

3. Start the client (from project root if a `client/` exists):

```bash
cd ../client
npm install
npm start
```

Adjust ports and scripts according to the `package.json` files in each folder.

## API Overview

Routes are defined under `src/routes`. Typical endpoints (update paths if your implementation differs):

- Blogs

  - `GET /api/blogs` — list blogs
  - `GET /api/blogs/:id` — get blog by id
  - `POST /api/blogs` — create a blog
  - `PUT /api/blogs/:id` — update a blog
  - `DELETE /api/blogs/:id` — delete a blog

- Writers
  - `GET /api/writers`
  - `GET /api/writers/:id`
  - `POST /api/writers`
  - `PUT /api/writers/:id`
  - `DELETE /api/writers/:id`

Example: create a blog with `curl` (adjust host/port):

```bash
curl -X POST http://localhost:3000/api/blogs \
	-H "Content-Type: application/json" \
	-d '{"title":"My post","content":"Hello world","authorId":"<writerId>"}'
```

Check `src/routes` to confirm exact prefixes and route files.

## Database

- Ensure your Atlas user has read/write permissions and your network access settings allow the server's IP (or set to allow from anywhere for development).
- The server reads the connection string from `MONGO_URI`.

## Deployment

General steps:

1. Configure production environment variables on your host (e.g., `MONGO_URI`, `PORT`, `NODE_ENV`, `FRONTEND_URL`).
2. Build frontend (if deploying together):

```bash
cd client
npm run build
```

3. Deploy server to a Node hosting service (Render, Heroku, DigitalOcean App Platform, etc.).
4. Point the frontend to the deployed API URL and update CORS/allowed origins.

If using Render, put `MONGO_URI` in the service's environment variables and use the `npm start` script.

## Troubleshooting

- Server fails to start: check `MONGO_URI` and that MongoDB Atlas allows connections from your IP.
- Duplicate entries in `.env`: remove any duplicate `MONGO_URI` or stray URLs; keep only valid `KEY=VALUE` lines.
- Check `server/src/middlewares/errorHandler.js` for how errors are returned to the client.

## Contributing

- Fork the repository and create a feature branch.
- Run the server and client locally and ensure changes are working.
- Open a PR with a clear description and testing notes.



_Last updated: 2025-11-18_
