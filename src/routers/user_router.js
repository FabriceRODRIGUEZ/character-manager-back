import express from "express"
import autoBind from "auto-bind"

import UserController from "../controllers/user_controller.js"
import AuthMiddleware from "../middlewares/auth_middleware.js"


export default class UserRouter {

    constructor(db) {
        autoBind(this)
        this.router = express.Router()
        const controller = new UserController(db)
        const authMiddleware = new AuthMiddleware()
        
        this.router.get("/users", authMiddleware.authenticate, controller.getAllUsers)
        this.router.get("/users/:username", authMiddleware.authenticate, controller.getUserReq)
        this.router.post("/users", authMiddleware.authenticate, controller.addUserReq)
        this.router.patch("/users/:username", authMiddleware.authenticate, controller.updateUserReq)
        this.router.delete("/users/:username", authMiddleware.authenticate, controller.deleteUserReq)
    }

}