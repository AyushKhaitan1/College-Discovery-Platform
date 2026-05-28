const { z } = require('zod');

const saveCollegeSchema = z.object({
  collegeId: z.string().uuid("Invalid College ID")
});

const saveComparisonSchema = z.object({
  collegeIds: z.array(z.string().uuid("Invalid College ID")).min(2).max(3)
});

module.exports = { saveCollegeSchema, saveComparisonSchema };
