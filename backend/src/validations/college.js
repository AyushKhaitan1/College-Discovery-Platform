const { z } = require('zod');

const searchSchema = z.object({
  q: z.string().optional(),
  page: z.string().regex(/^\d+$/).optional(),
  limit: z.string().regex(/^\d+$/).optional(),
  minFees: z.string().regex(/^\d+$/).optional(),
  maxFees: z.string().regex(/^\d+$/).optional(),
  minRating: z.string().optional(),
});

module.exports = { searchSchema };
