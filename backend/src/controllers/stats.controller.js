import { QuestionModel } from "../models/question.model.js";

export const StatsController = {
  /**
   * GET /api/stats
   * Returns archive totals: questions, experiences, and distinct contributors
   */
  async getStats(req, res, next) {
    try {
      const stats = await QuestionModel.getStats();
      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (err) {
      next(err);
    }
  },
};
