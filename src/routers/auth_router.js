import express from "express"
import autoBind from "auto-bind"

import AuthMiddleware from "../middlewares/auth_middleware.js"
import AuthValidator from "../validators/auth_validator.js"
import AuthController from "../controllers/auth_controller.js"


export default class AuthRouter {

    constructor(db) {
        autoBind(this)
        this.router = express.Router()
        const middleware = new AuthMiddleware()
        const validator = new AuthValidator(db)
        const controller = new AuthController(db)
        
        this.router.post("/signup", validator.validateSignup, controller.signup)
        this.router.post("/login", validator.validateLogin, controller.login)
        this.router.get("/me", middleware.authenticate, controller.getMe)
    }

}