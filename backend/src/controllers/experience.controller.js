import { ExperienceModel } from "../models/experience.model.js";
import { QuestionModel } from "../models/question.model.js";

export const ExperienceController = {
  /**
   * GET /api/questions/:questionId/experiences
   */
  async getExperiences(req, res, next) {
    try {
      const { questionId } = req.params;
      const experiences = await ExperienceModel.findByQuestionId(questionId);

      res.status(200).json({
        success: true,
        data: experiences,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/questions/:questionId/experiences
   * Body: { body, context, anonymous, authorName }
   */
  async createExperience(req, res, next) {
    try {
      const { questionId } = req.params;
      const { body, context, anonymous } = req.body;

      if (!body || body.trim().length < 10) {
        return res.status(400).json({
          success: false,
          message: "Please write a bit more about your experience (minimum 10 characters).",
        });
      }

      // Check if question exists
      const question = await QuestionModel.findById(questionId);
      if (!question) {
        return res.status(404).json({
          success: false,
          message: "The question you are answering does not exist.",
        });
      }

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Please sign in to share an experience.",
        });
      }

      const isAnonymous = Boolean(anonymous);
      const authorId = req.user.id;
      const authorName = req.user.name || "Anonymous";

      const experience = await ExperienceModel.create({
        questionId,
        body,
        context,
        authorId,
        authorName,
        anonymous: isAnonymous,
      });

      res.status(201).json({
        success: true,
        data: experience,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * DELETE /api/experiences/:id
   */
  async deleteExperience(req, res, next) {
    try {
      const { id } = req.params;
      const experience = await ExperienceModel.findById(id);

      if (!experience) {
        return res.status(404).json({
          success: false,
          message: "Experience not found.",
        });
      }

      if (
        experience.authorId &&
        req.user &&
        experience.authorId !== req.user.id
      ) {
        return res.status(403).json({
          success: false,
          message: "You can only delete your own experiences.",
        });
      }

      await ExperienceModel.delete(id);

      res.status(200).json({
        success: true,
        message: "Experience removed successfully.",
      });
    } catch (err) {
      next(err);
    }
  },
};
