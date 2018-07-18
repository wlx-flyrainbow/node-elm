'use strict';

import express from 'express'
import Metting from '../controller/metting/metting'
const router = express.Router()

router.post('/addMetting', Metting.addMetting);
router.get('/getMetting', Metting.getMetting);
router.get('/getAll', Metting.getAllMetting);
router.post('/addSchedule', Metting.addSchedule);

export default router