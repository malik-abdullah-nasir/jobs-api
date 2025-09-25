const { StatusCodes } = require('http-status-codes');
const User = require('../models/User');
const { CustomAPIError, BadRequestError, UnauthenticatedError } = require('../errors');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs/dist/bcrypt');
require('dotenv').config()

const register = async (req, res) => {
    // Save User
    const user = await User.create({ ...req.body });

    // Generate the token
    const token = user.createJWT();

    // Send response with the tokenw
    res.json({ name: user.getName(), token })
}

const login = async (req, res) => {
    const { email, password } = req.body;

    // Validate in the controller
    if (!email || !password) {
        throw new BadRequestError("Please provide both the email and password.");
    }

    // Find the user
    const user = await User.findOne({ email });

    if (!user) {
        throw new UnauthenticatedError("No user with the provided email found.");
    }

    // Match the password
    const isMatched = await user.comparePassword(password);

    // Generating token, and returning response
    if (!isMatched) {
        throw new UnauthenticatedError("Incorrect Password.")
    }
    
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({isMatched, token});
}


module.exports = {
    register,
    login
}