import { QuestionModel } from "../models/question.model.js";
import { ExperienceModel } from "../models/experience.model.js";

export const QuestionController = {
  /**
   * GET /api/questions
   * Query params: category, q, sort, limit, offset
   */
  async getQuestions(req, res, next) {
    try {
      const { category, q, sort, limit, offset } = req.query;

      const questions = await QuestionModel.findAll({
        category,
        q,
        sort,
        limit: limit ? parseInt(limit, 10) : 100,
        offset: offset ? parseInt(offset, 10) : 0,
      });

      res.status(200).json({
        success: true,
        data: questions,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/questions/:id
   * Returns question details along with all its submitted experiences
   */
  async getQuestionById(req, res, next) {
    try {
      const { id } = req.params;
      const question = await QuestionModel.findById(id);

      if (!question) {
        return res.status(404).json({
          success: false,
          message: "Question not found.",
        });
      }

      const experiences = await ExperienceModel.findByQuestionId(id);

      res.status(200).json({
        success: true,
        data: {
          ...question,
          experiences,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/questions
   * Body: { title, body, category, anonymous, authorName }
   */
  async createQuestion(req, res, next) {
    try {
      const { title, body, category, anonymous } = req.body;

      if (!title || title.trim().length < 10) {
        return res.status(400).json({
          success: false,
          message: "Question title must be at least 10 characters long.",
        });
      }

      if (!category) {
        return res.status(400).json({
          success: false,
          message: "A category shelf must be selected.",
        });
      }

      const isAnonymous = Boolean(anonymous);
      const authorId = req.user ? req.user.id : null;
      let authorName = "Guest reader";

      if (req.user) {
        authorName = req.user.name;
      } else if (req.body.authorName && req.body.authorName.trim()) {
        authorName = req.body.authorName.trim();
      }

      const question = await QuestionModel.create({
        title,
        body,
        category,
        authorId,
        authorName,
        anonymous: isAnonymous,
      });

      res.status(201).json({
        success: true,
        data: question,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * DELETE /api/questions/:id
   */
  async deleteQuestion(req, res, next) {
    try {
      const { id } = req.params;
      const question = await QuestionModel.findById(id);

      if (!question) {
        return res.status(404).json({
          success: false,
          message: "Question not found.",
        });
      }

      // Check author if authenticated
      if (question.authorId && req.user && question.authorId !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "You can only delete your own questions.",
        });
      }

      await QuestionModel.delete(id);

      res.status(200).json({
        success: true,
        message: "Question deleted successfully.",
      });
    } catch (err) {
      next(err);
    }
  },
};
