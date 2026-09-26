# Drea AI ✨

An AI creation studio for writing, image generation, image editing, and resume feedback, all in one authenticated workspace.

## Features

- Generate articles and blog titles
- Generate images and choose whether to publish them to the Community
- Remove image backgrounds and selected objects
- Review PDF resumes with AI-generated feedback
- Browse and like Community creations
- Search and filter Dashboard creations
- Download generated text and images
- Delete individual or multiple creations
- Remove stored Cloudinary assets when their creation is deleted

## Tech Stack

|       Area      |              Technologies                |
| --------------- | ---------------------------------------- |
| Client          | React, Vite, Tailwind CSS, React Router  |
| Authentication  | Clerk                                    |
| Server          | Node.js, Express                         |
| Database        | Neon Postgres                            |
| Image storage   | Cloudinary                               |
| AI services     | Google Gemini API, Cloudflare Workers AI |

## Project Structure

```text
client/   React application
server/   Express API
```

## Requirements

- Node.js and npm
- Neon Postgres database
- Clerk application
- Cloudinary account
- Gemini API key
- Cloudflare account with Workers AI access

## Setup

Install the client and server dependencies in separate terminals:

```bash
cd client
npm install
```

```bash
cd server
npm install
```

Create local environment files from the examples:

- `client/.env` based on `client/.env.example`
- `server/.env` based on `server/.env.example`

Fill them with your own credentials. Never commit real `.env` files or secret values.

### Server environment

```env
DATABASE_URL=your_neon_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GEMINI_API_KEY=your_gemini_api_key
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
PORT=3000
```

### Client environment

```env
VITE_BASE_URL=http://localhost:3000
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

If the `creations` table already exists, run this migration once in Neon to support Cloudinary cleanup:

```sql
ALTER TABLE creations
ADD COLUMN IF NOT EXISTS cloudinary_public_id TEXT;
```

## Run Locally

Start the server:

```bash
cd server
npm run server
```

In a second terminal, start the client:

```bash
cd client
npm run dev
```

Vite displays the client URL in the terminal.

## Scripts

### Client

|       Command     | Description                       |
| ----------------- | --------------------------------- |
| `npm run dev`     | Start the Vite development server |
| `npm run build`   | Build the client for production   |
| `npm run preview` | Preview the production build      |
| `npm run lint`    | Run ESLint                        |

### Server

|      Command     |        Description          |
| ---------------- | --------------------------- |
| `npm run server` | Start the API using Nodemon |
| `npm start`      | Start the API using Node.js |

## Security

Keep credentials in local environment files or your deployment provider's secret manager. Environment example files should contain placeholders only, never real keys or passwords.

