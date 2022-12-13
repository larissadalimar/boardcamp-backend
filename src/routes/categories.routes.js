import { Router } from "express";
import { create, getAll } from "../controllers/categories.controller.js";
import { categoryValidation } from "../middlewares/categoryValidation.middleware.js";

const router = Router();

router.post("/categories", categoryValidation, create);
router.get("/categories", getAll);

export default router;