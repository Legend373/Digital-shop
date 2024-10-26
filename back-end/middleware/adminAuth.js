import jwt from "jsonwebtoken";
const adminAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.json({ success: false, msg: "Not authorized login again" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.json({ success: false, msg: 'Not Authorized Login Again ' })
        }
        next();
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, msg: error.message });
    }
}
export default adminAuth
