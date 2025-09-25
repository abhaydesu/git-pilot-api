import express from 'express';
import {
pilotCommit,
pilotRun,
pilotUndo,
pilotBranch
} from '../controllers/pilotController.js';


const router = express.Router();


router.post('/pilot-commit', pilotCommit);
router.post('/pilot-run', pilotRun);
router.post('/pilot-undo', pilotUndo);
router.post('/pilot-branch', pilotBranch);


export default router;