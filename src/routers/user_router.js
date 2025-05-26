import express from "express"
import autoBind from "auto-bind"

import AuthValidator from "../validators/auth_validator.js"
import UserValidator from "../validators/user_validator.js"
import UserController from "../controllers/user_controller.js"


export default class UserRouter {

    constructor(db) {
        autoBind(this)
        this.router = express.Router()
        const authValidator = new AuthValidator(db)
        const userValidator = new UserValidator(db)
        const controller = new UserController(db)
        
        this.router.get("/users", authValidator.authenticate, controller.getAllUsers)

        this.router.get("/users/:username", authValidator.authenticate, controller.getUserReq)
        
        this.router.post("/users", authValidator.authenticate, controller.addUserReq)
        
        this.router.patch("/users/:username", authValidator.authenticate,
            userValidator.validateUpdateUser, controller.updateUser)
        
        this.router.delete("/users/:username", authValidator.authenticate,
            userValidator.validateDeleteUser, controller.deleteUser)
    }

}