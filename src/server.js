// import dotenv from "dotenv"
// import express from "express"
// import cors from "cors"
// import bodyParser from "body-parser"

// import DbConfigurator from "./configurators/db-configurator.js"
// import { publicRouter } from "./routers/public-router.js"
// import { privateRouter } from "./routers/private-router.js"


// export default class Server {

//     start() {
//         dotenv.config()
//         const app = express()
//         new DbConfigurator().connect()

//         app.use(cors())
//         app.use(bodyParser.json())
//         app.use(publicRouter)
//         app.use(privateRouter)
//         app.use("*", (_, res) => {
//             return res.status(404).send("Not found")
//         })

//         app.listen(process.env.PORT, () => {
//             console.log(`Server started on port ${process.env.PORT}`)
//         })
//     }

// }