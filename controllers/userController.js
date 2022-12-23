const UserModel = require("../models/User");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const { createAuthToken } = require("../util/auth/jwt")

// Add User
const newUser = async (req, res) => {
    try {
        let validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            return res.status(422).json({
                error: validationErrors.array()[0],
                result: false,
            });
        };
        const { firstName, middleName, lastName, email, password, confirmPassword, department } = req.body;

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
                let userType = "USER"
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
        console.log(err)
        return res.status(500).json({
            msg: "Internal server error!",
            result: false
        })
    }
};

// Update User
const updateUser = async (req, res) => {
    try {
        let validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            return res.status(422).json({
                error: validationErrors.array()[0],
                result: false,
            });
        };

        const payload = req.body;
        const { email } = req.body;

        const userData = await UserModel.findOne({ email: email },{password:0});
        if(userData.userType == 'ADMIN'){
            return res.status(500).json({
                msg:"Access Denied!",
                result: false
            })
        }
        else{
            const updatedData = await UserModel.findOneAndUpdate({email:email},payload,{new:true});
            if (updatedData) {
                return res.status(200).json({
                    msg: "User updated!",
                    result: true,
                    data: updatedData
                })
            }
    
            else {
                return res.status(500).json({
                    msg: "User not updated!",
                    result: false
                })
            }
        }
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            msg: "Internal server error!",
            result: false
        })
    }
}

// View User
const viewUser = async (req, res) => {
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
        if(userData.userType == "ADMIN"){
            return res.status(500).json({
                msg:"Access Denied!",
                result: false
            })
        }
        else{
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
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            msg: "Internal server error!",
            result: false
        })
    }
}

module.exports = {
    newUser,
    updateUser,
    viewUser
}