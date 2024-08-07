import express from 'express';
import routesController from '../controller/routesController';
import authMiddlware from '../middleware/authMiddlware';
import authorize from '../middleware/roleBase';


const router = express.Router();

router.post('/', authMiddlware.verifyToken, authorize(['admin']), routesController.addRoute);
router.get('/', authMiddlware.verifyToken, authorize(['admin']), routesController.getAllRoutes);
router.get('/:id', authMiddlware.verifyToken, authorize(['admin']), routesController.getRouteById);
router.put('/:id', authMiddlware.verifyToken, authorize(['admin']), routesController.updateRoute);
router.delete('/:id', authMiddlware.verifyToken, authorize(['admin']), routesController.deleteRoute);

export default router;
