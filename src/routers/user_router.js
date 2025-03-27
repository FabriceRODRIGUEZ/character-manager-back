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

// - - -

// export default userRouter = express.Router()
// const controller = new UserController(db)

// userRouter.get("/users", controller.getAllUsers)
// userRouter.get("/users/:username", controller.getUser)
// userRouter.post("/users", controller.addUser)
// userRouter.patch("/users/:username", controller.updateUser)
// userRouter.delete("/users/:username", controller.deleteUser)