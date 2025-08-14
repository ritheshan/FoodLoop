import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  console.log('✅ Auth middleware reached');
 
    const token = req.header('Authorization');
    
    if (!token) return res.status(401).json({ error: 'Access denied' });

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        req.user = decoded;
        console.log('Authenticated User:', req.user);  // Debugging line
        next();
    } catch (err) {
        res.status(400).json({ error: 'Invalid token' });
    }
};

export const isAdmin = (req, res, next) => {
  const token = req.header('Authorization');
    
  if (!token) return res.status(401).json({ error: 'Access denied' });
  try {
      const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        req.user = decoded;
      // Ensure the user is authenticated and role is available
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admins only.' });
      }
      next(); // Proceed if user is admin
    } catch (error) {
      console.error('Admin check failed:', error);
      return res.status(500).json({ error: 'Server error during admin check.' });
    }
  };
  