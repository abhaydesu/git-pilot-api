import { pilotCommit } from "../controllers/pilotController.js";

export default async function handler(req, res) {
  try {
    // forward to the controller (which expects req, res)
    await pilotCommit(req, res);
  } catch (err) {
    console.error("Serverless wrapper error /api/pilot-commit:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
