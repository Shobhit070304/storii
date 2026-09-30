import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { UserModel } from "../models/user.model.js";

const googleClient = new OAuth2Client(env.googleClientId);

export const AuthController = {
  /**
   * POST /api/auth/google
   * Verifies Google ID token, upserts user, returns Storii session JWT
   */
  async googleLogin(req, res, next) {
    try {
      const { credential } = req.body;
      if (!credential) {
        return res.status(400).json({
          success: false,
          message: "Missing Google ID token credential.",
        });
      }

      // Verify ID token with Google
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: env.googleClientId,
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        return res.status(400).json({
          success: false,
          message: "Invalid Google credential payload.",
        });
      }

      const { sub: googleId, email, name, picture } = payload;

      // Find or create/update user in PostgreSQL
      const user = await UserModel.upsertGoogleUser({
        googleId,
        email,
        name: name || email.split("@")[0],
        avatar: picture || null,
      });

      // Issue Storii JWT token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        env.jwtSecret,
        { expiresIn: env.jwtExpiresIn }
      );

      res.status(200).json({
        success: true,
        token,
        user,
      });
    } catch (error) {
      console.error("Google authentication error:", error);
      res.status(401).json({
        success: false,
        message: "Google authentication failed: " + (error.message || "Invalid token"),
      });
    }
  },

  /**
   * GET /api/auth/me
   * Returns current authenticated user
   */
  async getMe(req, res) {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  },

  /**
   * POST /api/auth/logout
   */
  async logout(req, res) {
    res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  },
};
