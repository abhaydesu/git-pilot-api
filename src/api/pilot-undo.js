import { pilotUndo } from "../controllers/pilotController.js";

export default async function handler(req, res) {
  try {
    await pilotUndo(req, res);
  } catch (err) {
    console.error("Serverless wrapper error /api/pilot-undo:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
