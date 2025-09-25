import { pilotBranch } from "../controllers/pilotController.js";

export default async function handler(req, res) {
  try {
    await pilotBranch(req, res);
  } catch (err) {
    console.error("Serverless wrapper error /api/pilot-branch:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
