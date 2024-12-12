// middleware/admin.js
const User = require('../models/User');

const isAdmin = async (req, res, next) => {
  const user = await User.findOne({ username: req.user.username });
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }
  next();
};

module.exports = isAdmin;
