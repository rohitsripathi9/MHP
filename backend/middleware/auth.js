import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
    try {
        // Check for token in different formats
        const token = req.headers.token || 
                     req.headers.authorization?.replace('Bearer ', '') || 
                     req.headers['x-access-token'];

        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: "No authentication token found. Please login again." 
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Set userId directly in the request body
            if (typeof req.body === 'string') {
                req.body = JSON.parse(req.body);
            }
            
            if (!req.body) {
                req.body = {};
            }

            req.body.userId = decoded.id;
            req.userId = decoded.id;
            req.user = decoded;

            console.log("Auth middleware - User authenticated:", {
                userId: decoded.id,
                token: token.substring(0, 10) + '...' // Log only first 10 chars of token for security
            });
            console.log("Request body after auth:", req.body);

            next();
        } catch (error) {
            console.error("Token verification failed:", error);
            return res.status(401).json({ 
                success: false, 
                message: "Invalid or expired token. Please login again." 
            });
        }
    } catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Authentication error. Please try again." 
        });
    }
};

export default authMiddleware;
