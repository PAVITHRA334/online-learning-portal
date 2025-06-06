const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  const token = req.header("Authorization");
  
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = decoded;
    next(); // Call next() to continue request
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token." });
  }
};

module.exports = authenticateUser;  // Ensure you are exporting a FUNCTION
