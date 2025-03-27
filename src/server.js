import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import bodyParser from "body-parser"

import DbConfigurator from "./configurators/db_configurator.js"
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

        // app.use(publicRouter)
        // app.use(privateRouter)
        const userRouter = new UserRouter(db_configurator.db).router
        app.use(userRouter)
        app.use("*", (_, res) => {
            return res.status(404).send("Not found")
        })

        app.listen(process.env.PORT, () =>
            console.log(`Server started on port ${process.env.PORT}`)
        )
    }

}