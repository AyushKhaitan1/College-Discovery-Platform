const express = require('express');
const { getSavedItems, saveCollege, unsaveCollege, saveComparison, unsaveComparison, updateProfile } = require('../controllers/userController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// All user routes require authentication
router.use(requireAuth);

router.put('/profile', updateProfile);
router.get('/saved', getSavedItems);
router.post('/saved/colleges', saveCollege);
router.delete('/saved/colleges/:id', unsaveCollege);
router.post('/saved/comparisons', saveComparison);
router.delete('/saved/comparisons/:id', unsaveComparison);

module.exports = router;
