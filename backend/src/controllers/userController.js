const prisma = require('../prisma');
const { saveCollegeSchema, saveComparisonSchema } = require('../validations/user');

const getSavedItems = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: {
        savedColleges: true,
        savedComparisons: true
      }
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      savedColleges: user.savedColleges,
      savedComparisons: user.savedComparisons
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const saveCollege = async (req, res) => {
  try {
    const { collegeId } = saveCollegeSchema.parse(req.body);
    
    await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        savedColleges: {
          connect: { id: collegeId }
        }
      }
    });

    res.json({ message: "College saved successfully" });
  } catch (error) {
    if (error.errors) return res.status(400).json({ error: error.errors[0].message });
    res.status(500).json({ error: "Internal server error" });
  }
};

const unsaveCollege = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        savedColleges: {
          disconnect: { id }
        }
      }
    });

    res.json({ message: "College removed from saved list" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const saveComparison = async (req, res) => {
  try {
    const { collegeIds } = saveComparisonSchema.parse(req.body);
    
    const comparison = await prisma.savedComparison.create({
      data: {
        userId: req.user.userId,
        collegeIds
      }
    });

    res.status(201).json({ message: "Comparison saved successfully", comparison });
  } catch (error) {
    if (error.errors) return res.status(400).json({ error: error.errors[0].message });
    res.status(500).json({ error: "Internal server error" });
  }
};

const unsaveComparison = async (req, res) => {
  try {
    await prisma.savedComparison.delete({
      where: { id: req.params.id }
    });
    res.json({ message: "Comparison unsaved" });
  } catch (error) {
    res.status(500).json({ error: "Failed to unsave comparison" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });

    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data: { name }
    });

    res.json({ message: "Profile updated successfully", name: user.name });
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile" });
  }
};

module.exports = { getSavedItems, saveCollege, unsaveCollege, saveComparison, unsaveComparison, updateProfile };
