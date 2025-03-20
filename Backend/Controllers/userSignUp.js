const userModel = require('../Model/userModel');
const bcrypt = require('bcrypt');

async function userSignUpController(req, res) {
    try {
        const { name, email, password,photo } = req.body;
console.log(req.body);  
        // Validate inputs
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }
        if (!password) {
            return res.status(400).json({ message: "Password is required" });
            // throw new error("Password is required");
        }

        // Check if email already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // Hash password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        // Create new user
        const payload = {
            name,
            role:"GENERAL",
            email,
            password: hashedPassword,
            photo,
           
        };

        const userData = new userModel(payload);
        const saveUser = await userData.save();
        console.log(payload);
        // Send success response
        res.status(200).json({
            message: "User created succeddssfully",
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
}

module.exports = userSignUpController;
