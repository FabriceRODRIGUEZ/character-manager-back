import express from "express"
import autoBind from "auto-bind"

import UserController from "../controllers/user_controller.js"


export default class UserRouter {

    constructor(db) {
        autoBind(this)
        this.router = express.Router()
        const controller = new UserController(db)
        
        this.router.get("/users", controller.getAllUsers)
        this.router.get("/users/:username", controller.getUser)
        this.router.post("/users", controller.addUser)
        this.router.patch("/users/:username", controller.updateUser)
        this.router.delete("/users/:username", controller.deleteUser)
    }

}