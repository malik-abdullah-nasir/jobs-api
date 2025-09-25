const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const authenticate = async (req, res, next) => {
    // Check Header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthenticatedError('Failed to authenticate.')
    }

    const token = authHeader.split(' ')[1]

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userID: payload.userID, name: payload.name };
        next()
    } catch (error) {
        throw new UnauthenticatedError("Unable to verify the token.");
    }

}

module.exports = authenticate