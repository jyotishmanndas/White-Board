import { Router } from "express";
import { createRoom, joinRoom } from "../controllers/room.controllers";
import { authMiddleware } from "../middleware/jwtAuth";

const router: Router = Router();

router.post("/create", authMiddleware, createRoom);
router.post("/joinroom", authMiddleware, joinRoom);

export default router;