const express = require('express');
const { getQuestions, getQuestion, createQuestion, createAnswer, updateQuestion, deleteQuestion, updateAnswer, deleteAnswer } = require('../controllers/forumController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', getQuestions);
router.post('/', requireAuth, createQuestion);
router.get('/:id', getQuestion);
router.put('/:id', requireAuth, updateQuestion);
router.delete('/:id', requireAuth, deleteQuestion);

router.post('/:id/answers', requireAuth, createAnswer);
router.put('/:id/answers/:answerId', requireAuth, updateAnswer);
router.delete('/:id/answers/:answerId', requireAuth, deleteAnswer);

module.exports = router;
