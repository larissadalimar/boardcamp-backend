import Router from 'express';
import { create, deleteRental, getAll, returnRental } from '../controllers/rentals.controller.js';
import deleteRentalValidation from '../middlewares/deleteRentalValidation.middleware.js';
import rentalValidation from '../middlewares/rentalValidation.middleware.js';
import returnRentalValidation from '../middlewares/returnRentalValidation.middleware.js';

const router = Router();

router.get("/rentals", getAll);
router.post("/rentals", rentalValidation, create);
router.post("/rentals/:id/return", returnRentalValidation, returnRental);
router.delete("/rentals/:id", deleteRentalValidation, deleteRental);

export default router;