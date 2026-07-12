import express from 'express';
import { getFuelEfficiencyReport, getOperationalCostReport, getRoiReport } from '../controllers/report.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';
import { ROLES } from '../utils/constants.js';

const router = express.Router();

const reportAuditors = [ROLES.ADMIN, ROLES.FLEET_MANAGER, ROLES.FINANCIAL_ANALYST];

router.get('/fuel-efficiency', authenticateToken, authorizeRoles(...reportAuditors), getFuelEfficiencyReport);
router.get('/operational-cost', authenticateToken, authorizeRoles(...reportAuditors), getOperationalCostReport);
router.get('/roi', authenticateToken, authorizeRoles(...reportAuditors), getRoiReport);

export default router;
