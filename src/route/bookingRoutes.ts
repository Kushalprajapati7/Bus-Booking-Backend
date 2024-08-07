import express from 'express';
import authMiddlware from '../middleware/authMiddlware';
import authorize from '../middleware/roleBase';
import bookingController from '../controller/bookingController';


const router = express.Router();

router.post('/', authMiddlware.verifyToken, bookingController.bookSeat);

export default router;
