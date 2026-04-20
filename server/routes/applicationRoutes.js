const express  = require('express');
const router = express.Router()

const { getApplications, createApplication, updateApplication, deleteApplication } = require('../controllers/applicationController');

const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getApplications);
router.post('/', authMiddleware, createApplication);
router.put('/:id', authMiddleware, updateApplication);
router.delete('/:id', authMiddleware, deleteApplication);

module.exports = router;