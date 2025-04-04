import express from "express"
import autoBind from "auto-bind"

import AuthMiddleware from "../middlewares/auth_middleware.js"
import UserValidator from "../validators/user_validator.js"
import UserController from "../controllers/user_controller.js"


export default class UserRouter {

    constructor(db) {
        autoBind(this)
        this.router = express.Router()
        const middleware = new AuthMiddleware()
        const validator = new UserValidator(db)
        const controller = new UserController(db)
        
        this.router.get("/users", middleware.authenticate, controller.getAllUsers)
        this.router.get("/users/:username", middleware.authenticate,
            validator.validateGetUser, controller.getUserReq)
        this.router.post("/users", middleware.authenticate,
            validator.validateAddUser, controller.addUserReq)
        this.router.patch("/users/:username", middleware.authenticate,
            validator.validateUpdateUser, controller.updateUserReq)
        this.router.delete("/users/:username", middleware.authenticate,
            validator.validateDeleteUser, controller.deleteUserReq)
    }

}