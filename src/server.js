import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import bodyParser from "body-parser"
import autoBind from "auto-bind"

import DbConfigurator from "./configurators/db_configurator.js"
import AuthRouter from "./routers/auth_router.js"
import UserRouter from "./routers/user_router.js"


export default class Server {

    constructor() {
        autoBind(this)
        dotenv.config()
        this.app = express()
        this.app.use(cors())
        this.app.use(bodyParser.json())

        const db_configurator = new DbConfigurator()
        db_configurator.connect()
        db_configurator.seed_database()

        const authRouter = new AuthRouter(db_configurator.db).router
        const userRouter = new UserRouter(db_configurator.db).router
        this.app.use(authRouter)
        this.app.use(userRouter)
        this.app.use("*", (_, res) => {
            return res.status(404).send("Not found")
        })
    }

    start() {
        this.app.listen(process.env.PORT, () =>
            console.log(`Server started on port ${process.env.PORT}`)
        )
    }

}