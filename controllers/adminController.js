const UserModel = require("../models/User");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const { createAuthToken } = require("../util/auth/jwt")

// Add Admin or User
const registerAdminUser = async (req, res) => {
    try {
        let validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            return res.status(422).json({
                error: validationErrors.array()[0],
                result: false,
            });
        };
        const { firstName, middleName, lastName, email, password, confirmPassword, userType, department } = req.body;

        // Email check
        const emailCheck = await UserModel.findOne({ email: req.body.email });
        if (emailCheck) {
            return res.status(500).json({
                msg: "Email already exist!",
                result: false
            })
        }
        else {
            if (password == confirmPassword) {
                // Hashing Password
                const hash = await bcrypt.hash(password, 12);

                // Adding Admin or User
                await UserModel.create({
                    firstName,
                    middleName,
                    lastName,
                    email,
                    userType,
                    department,
                    password: hash
                })

                const token = await createAuthToken(email, userType)

                return res.status(200).json({
                    msg: "User Created!",
                    result: true,
                    token
                })
            }
            else {
                return res.status(500).json({
                    msg: "Password does not match!",
                    result: false
                })
            }
        }
    }
    catch (err) {
        return res.status(500).json({
            msg: "Internal server error!",
            result: false
        })
    }
};

const updateAdminUser = async (req, res) => {
    try {
        let validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            return res.status(422).json({
                error: validationErrors.array()[0],
                result: false,
            });
        };

        const data = req.body;
        const { email } = req.body;

        const updateData = await UserModel.findOneAndUpdate({ email: email }, data, {
            new: true
        });

        if (updateData) {
            return res.status(200).json({
                msg: "User updated!",
                result: true,
                data: updateData
            })
        }

        else {
            return res.status(500).json({
                msg: "User not updated!",
                result: false
            })
        }
    }
    catch (err) {
        return res.status(500).json({
            msg: "Internal server error!",
            result: false
        })
    }
}

const viewAdminUser = async (req, res) => {
    try {
        let validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            return res.status(422).json({
                error: validationErrors.array()[0],
                result: false,
            });
        };

        const userData = await UserModel.findOne({ email: req.body.email },
            {
                password: 0,
            }
        );

        if (userData) {
            return res.status(200).json({
                msg: "User found!",
                result: true,
                data: userData
            })
        }
        else {
            return res.status(500).json({
                msg: "User not found!",
                result: false
            })
        }

    }
    catch (err) {
        return res.status(500).json({
            msg: "Internal server error!",
            result: false
        })
    }
}

module.exports = {
    registerAdminUser,
    updateAdminUser,
    viewAdminUser
}