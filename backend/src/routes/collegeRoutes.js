const express = require('express');
const { searchColleges, getCollegeDetails, predictColleges } = require('../controllers/collegeController');

const router = express.Router();

router.get('/predict', predictColleges);
router.get('/', searchColleges);
router.get('/:id', getCollegeDetails);

module.exports = router;
