import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Default admin credentials (in production, these should be stored securely in a database)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login attempt:', { username, password }); // Debug log

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      // Create JWT token
      const token = jwt.sign(
        { username: ADMIN_CREDENTIALS.username },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        token,
        message: 'Login successful'
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred'
    });
  }
});

export default router; 