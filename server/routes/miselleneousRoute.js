import { Router } from 'express';
import {
   contactUs,userStats
} from '../controllers/misellaneousPage.js';
import  {isAdmin,isLoggedIn}  from '../middleWares/userMiddleWare.js';
const router = Router();

// {{URL}}/api/v1/
router.route('/contact').post(contactUs);
router
  .route('/admin/stats/users')
  .get(isLoggedIn, isAdmin, userStats);
export default router;