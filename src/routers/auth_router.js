import express, { Router } from "express"
import autoBind from "auto-bind"

import AuthValidator from "../validators/auth_validator.js"
import AuthController from "../controllers/auth_controller.js"


/**
 * A router for the authentication
 */
export default class AuthRouter {

    /**
     * Constructor of the authentication router
     * @param {Pool} db
     */
    constructor(db) {
        autoBind(this)

        /** @type {Router} */
        this.router = express.Router()
        const validator = new AuthValidator(db)
        const controller = new AuthController(db)

        this.router.post("/signup", validator.validateSignup, controller.signup)
        this.router.post("/login", validator.validateLogin, controller.login)
        this.router.get("/me", validator.authenticate, controller.getMe)
    }

}