import { QuestionModel } from "../models/question.model.js";
import { ExperienceModel } from "../models/experience.model.js";

export const UserController = {
  /**
   * GET /api/users/me/contributions
   * Fetches questions and experiences for the currently authenticated user
   * (or demo user if guest)
   */
  async getMyContributions(req, res, next) {
    try {
      // Use logged in user ID if available, or default to demo user "user_me"
      const authorId = req.user ? req.user.id : "user_me";

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
