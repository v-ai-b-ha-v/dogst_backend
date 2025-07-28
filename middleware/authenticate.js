
const admin = require('../config/firebase');

const authenticate = async (req, res, next) => {
    try {

        const header = req.headers.authorization;
        if (!header || !header.startsWith('Bearer ')) {

            return res.status(401).json({ error: 'No token provided' });

        }

        const token = header.split(' ')[1];

        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();


    } catch (err) {
        console.error('Token verification failed:', err.message);
        res.status(403).json({ error: 'Invalid or expired token' });
    }
};

module.exports =  authenticate;
