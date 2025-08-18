import jwt from "jsonwebtoken";
import { Token } from "../models/export.js";

class TokenService {
  static generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "15d",
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  static async saveToken(userId, refreshToken) {
    const tokenData = await Token.findOne({ where: { id_user: userId } });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }

    return await Token.create({ id_user: userId, refreshToken });
  }

  static async removeToken(refreshToken) {
    await Token.destroy({
      where: { refreshToken },
    });
  }

  static validateAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (error) {
      return null;
    }
  }

  static validateRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      return null;
    }
  }

  static async findToken(refreshToken) {
    return await Token.findOne({
      where: { refreshToken },
    });
  }
}

export { TokenService };
