# IEEE Xtreme — University Scoreboard (React + Node)

I developed this scoreboard to manage IEEE Xtreme competition results within the university.
It supports team and member management, score tracking, challenge administration, and live ranking updates.

I built the interface with **React and Vite**, and implemented the API server with **Node.js**. The system stores data locally and separates the public scoreboard from the password-protected organizer dashboard.

## Key Features
- Manage teams, members, and scores.
- Create, activate, complete, and award challenges.
- Display live rankings and activity updates.
- Separate public viewer and organizer permissions.
- Store data locally in `server/data.json`.

## Quick Start

Requires Node.js 18 or later.

Set the organizer password before starting the server.

Windows (PowerShell):

    $env:ORGANIZER_PASSWORD="strong-password"; node server/server.cjs

macOS / Linux:

    ORGANIZER_PASSWORD="strong-password" node server/server.cjs

Then open http://localhost:3000 and select **Organizer login**. Users on the same network can open the host machine address to view the scoreboard.

## Development and Build

Requires Node.js 20.19+ or 22.12+.

    npm install
    ORGANIZER_PASSWORD=secret npm run server
    npm run dev

To create a production build:

    npm run build

## Deployment

The project includes a `render.yaml` configuration for deployment on Render.
Create a new Blueprint from this repository on Render, set the `ORGANIZER_PASSWORD` environment variable, and deploy. Render will build and run the complete application, including the API server.
