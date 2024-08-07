import express from 'express';
import authMiddlware from '../middleware/authMiddlware';
import authorize from '../middleware/roleBase';
import busController from '../controller/busController';


const router = express.Router();

router.post('/', authMiddlware.verifyToken, authorize(['admin']), busController.addBus);
router.get('/', authMiddlware.verifyToken, authorize(['admin']), busController.getAllBuses);
router.get('/search', authMiddlware.verifyToken, authorize(['admin']), busController.getBusBySearch);
router.get('/:id', authMiddlware.verifyToken, authorize(['admin']), busController.getBusById);
router.put('/:id', authMiddlware.verifyToken, authorize(['admin']), busController.updateBus);
router.delete('/:id', authMiddlware.verifyToken, authorize(['admin']), busController.deleteBus);

export default router;
