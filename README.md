<div align="center" display="inline">
  <img width="30" height="30" alt="logo" src="./public/logo.png" />
</div>

# Git Pilot API

This is the backend API server that powers the <a href="https://www.npmjs.com/package/@abhaydesu/git-pilot">`git-pilot`</a> CLI tool. It handles the secure communication with AI models to generate Git commands, commit messages, undo actions, and branch names.

## ◼️ Purpose

The primary role of this API is to act as a secure intermediary between the <a href="https://github.com/abhaydesu/git-pilot-cli">`git-pilot-cli` </a> and the AI service (Google Gemini). This architecture ensures that the AI API keys are never exposed on a user's local machine.

## ◼️ Technology Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **AI Service:** Google Gemini API
* **Deployment:** Vercel

## ◼️ Local Development

```bash
npm install
cp .env.example .env   # then set GEMINI_API_KEY
npm run dev            # http://localhost:3000, restarts on change
```

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `GEMINI_API_KEY` | yes | | Google Gemini API key |
| `GEMINI_MODEL` | no | `gemini-2.5-flash-lite` | Model used for all endpoints |
| `PORT` | no | `3000` | Port for `npm start` / `npm run dev` |

Other scripts: `npm test` (Gemini is mocked, no key needed), `npm run lint`, `npm run format`.
Point the CLI at your local server with `GIT_PILOT_API_URL=http://localhost:3000 git pilot run "show status"`.

## ◼️ Errors and Limits

* Request bodies are limited to 1 MB; `diff` to 800,000 characters, `intent` to 1,000, `request` to 1,000, `reflog` to 20,000 and `description` to 500.
* Invalid input returns `400` (`413` for oversized bodies) as `{ "error": "..." }`. Unexpected failures return `500` with a generic `{ "error": "Internal server error." }`.
* `pilot-run` only returns commands of the form `git <known-subcommand> ...` with no shell operators (`;`, `&&`, `|`, `$(...)`). Anything else comes back as `{ "command": "Error: ..." }`.

## ◼️ API Endpoints

The API exposes the following endpoints:

### 1. Generate Commit Message

* **Route:** `POST /api/pilot-commit`
* **Description:** Analyzes a Git diff and a user's intent to generate a conventional commit message.
* **Request Body (JSON):**

  ```json
  {
    "intent": "string",
    "diff": "string"
  }
  ```
* **Success Response (200 - JSON):**

  ```json
  {
    "message": "string"
  }
  ```

### 2. Generate Git Command

* **Route:** `POST /api/pilot-run`
* **Description:** Translates a user's natural language request into an executable, safe Git command.
* **Request Body (JSON):**

  ```json
  {
    "request": "string"
  }
  ```
* **Success Response (200 - JSON):**

  ```json
  {
    "command": "string"
  }
  ```

### 3. Undo Last Action

* **Route:** `POST /api/pilot-undo`
* **Description:** Suggests a safe Git command to undo the most recent significant action (merge, rebase, commit).
* **Request Body (JSON):**

  ```json
  {
    "reflog": "string"
  }
  ```
* **Success Response (200 - JSON):**

  ```json
  {
    "command": "string",
    "explanation": "string"
  }
  ```

### 4. Generate Branch Name

* **Route:** `POST /api/pilot-branch`
* **Description:** Converts a natural language description into a conventional, kebab-case Git branch name.
* **Request Body (JSON):**

  ```json
  {
    "description": "string"
  }
  ```
* **Success Response (200 - JSON):**

  ```json
  {
    "branchName": "string"
  }
  ```

### ◾ Deployment

This API is designed for and deployed on Vercel.
