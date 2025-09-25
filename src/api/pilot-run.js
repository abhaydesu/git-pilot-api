import { pilotRun } from "../controllers/pilotController.js";

export default async function handler(req, res) {
  try {
    await pilotRun(req, res);
  } catch (err) {
    console.error("Serverless wrapper error /api/pilot-run:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
