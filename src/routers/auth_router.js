import express from "express"
import autoBind from "auto-bind"

import AuthController from "../controllers/auth_controller.js"
import SignupValidator from "../validators/signup_validator.js"
import LoginValidator from "../validators//login_validator.js"
import AuthMiddleware from "../middlewares/auth_middleware.js"


export default class AuthRouter {

    constructor(db) {
        autoBind(this)
        this.router = express.Router()
        const controller = new AuthController(db)
        const signupValidator = new SignupValidator(db)
        const loginValidator = new LoginValidator(db)
        const authMiddleware = new AuthMiddleware()
        
        this.router.post("/signup", signupValidator.validateSignup, controller.signup)
        this.router.post("/login", loginValidator.validateLogin, controller.login)
        this.router.get("/me", authMiddleware.authenticate, controller.getMe)
    }

}