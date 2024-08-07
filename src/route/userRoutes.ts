import { Router } from "express";
import authorize from "../middleware/roleBase";
import authMiddlware from "../middleware/authMiddlware";
import userConroller from "../controller/userConroller";
const router = Router();

router.get('/', authMiddlware.verifyToken, authorize(['admin']), userConroller.getAllUser)
router.delete('/:id', authMiddlware.verifyToken, authorize(['admin']), userConroller.deleteUser)
router.put('/:id', authMiddlware.verifyToken, authorize(['admin']), userConroller.updateUser)
router.get('/:id', authMiddlware.verifyToken, authorize(['admin']), userConroller.getUserById)
router.post('/', authMiddlware.verifyToken, authorize(['admin']), userConroller.addUser)


export default router;