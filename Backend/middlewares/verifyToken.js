import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

const { verify } = jwt;

export const verifyToken = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // allow preflight requests to pass
      if (req.method === "OPTIONS") {
        return next();
      }

      const token =
        req.cookies?.token || req.headers.authorization?.split(" ")[1];

      if (!token) {
        return res.status(401).json({ message: "Please login first" });
      }

      const decodedToken = verify(token, process.env.SECRET_KEY);

      if (!allowedRoles.includes(decodedToken.role)) {
        return res.status(403).json({ message: "You are unauthorised" });
      }

      req.user = decodedToken;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};
