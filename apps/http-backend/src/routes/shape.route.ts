import { Router } from "express";
import { authMiddleware } from "../middleware/jwtAuth";
import { createShape } from "../controllers/shape.controllers";

const router: Router = Router();

router.post("/shape", authMiddleware, createShape)

export default router;