const prisma = require('../prisma');

const getQuestions = async (req, res) => {
  try {
    const questions = await prisma.question.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true } },
        _count: { select: { answers: true } }
      }
    });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getQuestion = async (req, res) => {
  try {
    const question = await prisma.question.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { id: true, name: true } },
        answers: {
          include: { user: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'asc' }
        }
      }
    });
    if (!question) return res.status(404).json({ error: "Not found" });
    res.json(question);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const createQuestion = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ error: "Title and content required" });

    const question = await prisma.question.create({
      data: {
        title,
        content,
        userId: req.user.userId
      }
    });
    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const createAnswer = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: "Content required" });

    const answer = await prisma.answer.create({
      data: {
        content,
        questionId: req.params.id,
        userId: req.user.userId
      }
    });
    res.status(201).json(answer);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const { title, content } = req.body;
    const question = await prisma.question.findUnique({ where: { id: req.params.id } });
    if (!question) return res.status(404).json({ error: "Not found" });
    if (question.userId !== req.user.userId) return res.status(403).json({ error: "Forbidden" });

    const updated = await prisma.question.update({
      where: { id: req.params.id },
      data: { title, content }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const question = await prisma.question.findUnique({ where: { id: req.params.id } });
    if (!question) return res.status(404).json({ error: "Not found" });
    if (question.userId !== req.user.userId) return res.status(403).json({ error: "Forbidden" });

    await prisma.question.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateAnswer = async (req, res) => {
  try {
    const { content } = req.body;
    const answer = await prisma.answer.findUnique({ where: { id: req.params.answerId } });
    if (!answer) return res.status(404).json({ error: "Not found" });
    if (answer.userId !== req.user.userId) return res.status(403).json({ error: "Forbidden" });

    const updated = await prisma.answer.update({
      where: { id: req.params.answerId },
      data: { content }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteAnswer = async (req, res) => {
  try {
    const answer = await prisma.answer.findUnique({ where: { id: req.params.answerId } });
    if (!answer) return res.status(404).json({ error: "Not found" });
    if (answer.userId !== req.user.userId) return res.status(403).json({ error: "Forbidden" });

    await prisma.answer.delete({ where: { id: req.params.answerId } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getQuestions, getQuestion, createQuestion, createAnswer, updateQuestion, deleteQuestion, updateAnswer, deleteAnswer };
