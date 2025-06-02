import express, { Router } from "express"
import autoBind from "auto-bind"

import AuthValidator from "../validators/auth_validator.js"
import UserValidator from "../validators/user_validator.js"
import UserController from "../controllers/user_controller.js"


/**
 * A router for the users
 */
export default class UserRouter {

    /**
     * Constructor of the user router
     * @param {Pool} db
     */
    constructor(db) {
        autoBind(this)

        /** @type {Router} */
        this.router = express.Router()
        const authValidator = new AuthValidator(db)
        const userValidator = new UserValidator(db)
        const controller = new UserController(db)
        
        this.router.get("/users", authValidator.authenticate, controller.getAllUsers)
        // this.router.get("/users/:username", authValidator.authenticate, controller.getUserReq)
        // this.router.post("/users", authValidator.authenticate, controller.addUserReq)
        this.router.patch("/users", authValidator.authenticate,
            userValidator.validateUpdateUser, controller.updateUser)
        this.router.delete("/users", authValidator.authenticate,
            userValidator.validateDeleteUser, controller.deleteUser)
    }

}