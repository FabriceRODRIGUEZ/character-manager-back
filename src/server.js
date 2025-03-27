import dotenv from "dotenv"
import express from "express"

import DbConfigurator from "./configurators/db_configurator.js"


export default class Server {

    start() {
        dotenv.config()
        const app = express()

        const db_configurator = new DbConfigurator()
        db_configurator.connect()
        db_configurator.seed_database()

        app.listen(process.env.PORT, () =>
            console.log(`Server started on port ${process.env.PORT}`)
        )
    }

}

// - - -

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

// - - -

// const pg = require('pg')
// const express = require('express')
// const bodyParser = require('body-parser')
// const cors = require('cors')
// const morgan = require('morgan')
// require('dotenv').config();

// const CarService = require("./services/car")
// const UserAccountService = require("./services/useraccount")

// const app = express()
// app.use(bodyParser.urlencoded({ extended: false })) // application/x-www-form-urlencoded
// app.use(bodyParser.json()) // application/json
// app.use(cors())
// app.use(morgan('combined')); // toutes les requêtes HTTP dans le log du serveur

// const port = process.env.PORT || 3333;
// const dsn = process.env.CONNECTION_STRING

// console.log(`Using database ${dsn}`)
// const db = new pg.Pool({ connectionString:  dsn})

// const carService = new CarService(db)
// const userAccountService = new UserAccountService(db)
// const jwt = require('./jwt')(userAccountService)
// require('./api/car')(app, carService, jwt)
// require('./api/useraccount')(app, userAccountService, jwt)

// const seedDatabase = async () => require('./datamodel/seeder')(userAccountService, carService)
// if (require.main === module) {
//     seedDatabase().then( () =>
//         app.listen(port, () =>
//             console.log(`Listening on the port ${port}`)
//         )
//     )
// }
// module.exports= { app, seedDatabase, userAccountService }