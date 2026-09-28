import express from "express";
import {
  pilotCommit,
  pilotRun,
  pilotUndo,
  pilotBranch,
} from "../controllers/pilotController.js";
import { validateBody } from "../middleware/validate.js";

const router = express.Router();

router.post(
  "/pilot-commit",
  validateBody({
    intent: { maxLength: 1_000 },
    diff: { required: true, maxLength: 800_000 },
  }),
  pilotCommit
);
router.post(
  "/pilot-run",
  validateBody({ request: { required: true, maxLength: 1_000 } }),
  pilotRun
);
router.post(
  "/pilot-undo",
  validateBody({ reflog: { required: true, maxLength: 20_000 } }),
  pilotUndo
);
router.post(
  "/pilot-branch",
  validateBody({ description: { required: true, maxLength: 500 } }),
  pilotBranch
);

export default router;
