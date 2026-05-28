const prisma = require('../prisma');
const { searchSchema } = require('../validations/college');

const searchColleges = async (req, res) => {
  try {
    const query = searchSchema.parse(req.query);
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '10', 10);
    const skip = (page - 1) * limit;

    const where = {};

    if (query.q) {
      where.name = { contains: query.q, mode: 'insensitive' };
    }
    
    if (query.minFees || query.maxFees) {
      where.averageFees = {};
      if (query.minFees) where.averageFees.gte = parseInt(query.minFees, 10);
      if (query.maxFees) where.averageFees.lte = parseInt(query.maxFees, 10);
    }

    if (query.minRating) {
      where.rating = { gte: parseFloat(query.minRating) };
    }

    const [colleges, total] = await Promise.all([
      prisma.college.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { rating: 'desc' },
          { id: 'asc' }
        ]
      }),
      prisma.college.count({ where })
    ]);

    res.json({
      data: colleges,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    if (error.errors) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

const getCollegeDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const college = await prisma.college.findUnique({
      where: { id },
      include: {
        courses: true,
        placements: true,
        reviews: {
          include: {
            user: { select: { id: true, name: true } }
          }
        }
      }
    });

    if (!college) {
      return res.status(404).json({ error: "College not found" });
    }

    res.json(college);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
const predictColleges = async (req, res) => {
  try {
    const { exam, rank } = req.query;
    if (!exam || !rank) return res.status(400).json({ error: "Exam and rank required" });

    const rankNum = parseInt(rank, 10);

    const colleges = await prisma.college.findMany({
      where: {
        acceptedExam: { equals: exam, mode: 'insensitive' },
        cutoffRank: { gte: rankNum }
      },
      orderBy: [
        { rating: 'desc' },
        { id: 'asc' }
      ]
    });

    res.json(colleges);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { searchColleges, getCollegeDetails, predictColleges };
