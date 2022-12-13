import { Router } from "express";
import { create, getAll } from "../controllers/games.controller.js";
import { gameValidation } from "../middlewares/gameValidation.middleware.js";

const router = Router();

router.post("/games", gameValidation, create);
router.get("/games", getAll);

export default router;