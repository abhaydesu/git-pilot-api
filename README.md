<div align="center" display="inline">
  <img width="30" height="30" alt="logo" src="./public/logo-pilot.png" />
</div>

# Git Pilot API 

This is the backend API server that powers the <a href="https://www.npmjs.com/package/@abhaydesu/git-pilot">`git-pilot`</a> CLI tool. It handles the secure communication with AI models to generate Git commands and commit messages.


## ◼️ Purpose

The primary role of this API is to act as a secure intermediary between the <a href="https://github.com/abhaydesu/git-pilot-cli">`git-pilot-cli` </a> and the AI service (Google Gemini). This architecture ensures that the AI API keys are never exposed on a user's local machine.

## ◼️ Technology Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **AI Service:** Google Gemini API
* **Deployment:** Vercel

## ◼️ API Endpoints

The API exposes the following endpoints:

### 1. Generate Git Command
* **Route:** POST /api/git-command

* **Description:** Translates a user's natural language request into an executable Git command.

* **Request Body (JSON):**

    ```JSON

    {
    "request": "string"
    }
    ```
* **Success Response (200 - JSON):**

    ```JSON

    {
    "command": "string"
    }
    ```
### 2. Generate Commit Message

* **Route:** `POST /api/commit-message`
* **Description:** Analyzes a Git diff and a user's intent to generate a conventional commit message.
* **Request Body (JSON):**
  ```json
  {
    "intent": "string",
    "diff": "string"
  }
* **Success Response (200 - JSON):**

    ```JSON

    {
    "message": "string"
    }
    ```


### ◾ Deployment
    This API is designed for and deployed on Vercel.