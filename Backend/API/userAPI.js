import jwt from 'jsonwebtoken';

export const verifyToken = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // Get token from cookies (since you're using httpOnly cookies)
      const token = req.cookies.token;
      
      if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
      }
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Check if user has required role
      if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ 
          message: `Access denied. ${decoded.role} role not authorized.` 
        });
      }
      
      // Attach user info to request
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};
