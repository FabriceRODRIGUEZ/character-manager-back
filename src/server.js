import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import bodyParser from "body-parser"

import DbConfigurator from "./configurators/db_configurator.js"
import AuthRouter from "./routers/auth_router.js"
import UserRouter from "./routers/user_router.js"


export default class Server {

    start() {
        const app = express()
        const db_configurator = new DbConfigurator()
        db_configurator.connect()
        db_configurator.seed_database()

        dotenv.config()
        app.use(cors())
        app.use(bodyParser.json())

        const authRouter = new AuthRouter(db_configurator.db).router
        const userRouter = new UserRouter(db_configurator.db).router
        app.use(authRouter)
        app.use(userRouter)
        app.use("*", (_, res) => {
            return res.status(404).send("Not found")
        })

        app.listen(process.env.PORT, () =>
            console.log(`Server started on port ${process.env.PORT}`)
        )
    }

}