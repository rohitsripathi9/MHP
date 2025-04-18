import jwt from 'jsonwebtoken';

const adminCredentials = {
    email: 'admin@mhp.com',
    password: 'admin123'
};

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === adminCredentials.email && password === adminCredentials.password) {
            const token = jwt.sign(
                { id: 'admin', role: 'admin' },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            return res.json({
                success: true,
                message: "Admin login successful",
                token
            });
        }

        return res.status(401).json({
            success: false,
            message: "Invalid credentials"
        });
    } catch (error) {
        console.error("Admin login error:", error);
        return res.status(500).json({
            success: false,
            message: "Error during login"
        });
    }
};

export { adminLogin }; 