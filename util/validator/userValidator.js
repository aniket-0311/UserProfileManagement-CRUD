const {body,param} = require("express-validator");
const {ObjectId} = require("mongoose").Types;

exports.registerUser = [
    body("firstName").not().isEmpty().withMessage("firstName required!"),
    body("lastName").not().isEmpty().withMessage("lastName required!"),
    body("email").not().isEmpty().withMessage("email required!"),
    body("password").not().isEmpty().withMessage("password  required!"),
    body("confirmPassword").not().isEmpty().withMessage("confirmPassword required!"),
];



