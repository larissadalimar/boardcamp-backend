import Router from 'express';
import { create, find, getAll, update } from '../controllers/customers.controller.js';
import customerValidation from '../middlewares/customerValidation.middleware.js';

const router = Router();

router.get("/customers", getAll);
router.get("/customers/:id", find);
router.post("/customers", customerValidation, create);
router.put("/customers/:id", customerValidation, update);

export default router;