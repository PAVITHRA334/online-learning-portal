const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      console.error("❌ No token provided in request!");
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Decoded Token:", decoded);

    const user = await User.findById(decoded.id);
    if (!user) {
      console.error("❌ User not found in database!");
      return res.status(401).json({ error: "User not found" });
    }

    req.user = { id: user._id }; // Set user ID
    console.log("✅ Authenticated User:", req.user);
    
    next();
  } catch (error) {
    console.error("🚨 Auth Error:", error.message);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = authenticateUser;
