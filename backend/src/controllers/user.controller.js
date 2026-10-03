import { QuestionModel } from "../models/question.model.js";
import { ExperienceModel } from "../models/experience.model.js";

export const UserController = {
  /**
   * GET /api/users/me/contributions
   * Fetches questions and experiences for the currently authenticated user
   */
  async getMyContributions(req, res, next) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required to view contributions.",
        });
      }

      const authorId = req.user.id;

      const [questions, answers] = await Promise.all([
        QuestionModel.findByAuthorId(authorId),
        ExperienceModel.findByAuthorId(authorId),
      ]);

      res.status(200).json({
        success: true,
        data: {
          questions,
          answers,
        },
      });
    } catch (err) {
      next(err);
    }
  },
};
