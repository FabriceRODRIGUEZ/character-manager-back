import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import bodyParser from "body-parser"
import autoBind from "auto-bind"

import DbConfigurator from "./configurators/db_configurator.js"
import AuthRouter from "./routers/auth_router.js"
import UserRouter from "./routers/user_router.js"
import CharacterRouter from "./routers/character_router.js"


/**
 * A server of the application
 * @property {Express} app
 */
export default class Server {

    /**
     * Constructor of the server
     */
    constructor() {
        autoBind(this)
        dotenv.config()

        /** @type {Express} */
        this.app = express()
        this.app.use(cors())
        this.app.use(bodyParser.json())

        const db_configurator = new DbConfigurator()
        db_configurator.connect()
        db_configurator.seed_database()

        const authRouter = new AuthRouter(db_configurator.db).router
        const userRouter = new UserRouter(db_configurator.db).router
        const characterRouter = new CharacterRouter(db_configurator.db).router

        this.app.use(authRouter)
        this.app.use(userRouter)
        this.app.use(characterRouter)
        this.app.use("*", (_, res) => {
            return res.status(404).send("Not found")
        })
    }

    /**
     * Starts the server by listening requests
     */
    start() {
        this.app.listen(process.env.PORT, () =>
            console.log(`Server started on port ${process.env.PORT}`)
        )
    }

}