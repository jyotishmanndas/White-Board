import { Router } from "express";
import { createRoom } from "../controllers/room.controllers";
import { authMiddleware } from "../middleware/jwtAuth";


const router: Router = Router();

router.post("/create", authMiddleware, createRoom);

export default router;