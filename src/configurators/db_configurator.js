// import { Sequelize } from "sequelize"
// import dotenv from "dotenv"


// dotenv.config()

// export default class DbConfigurator {

//     constructor() {
//         this.sequelize = new Sequelize(
//             process.env.DB_NAME,
//             process.env.DB_USER,
//             process.env.DB_PASS, 
//             { host: "localhost",
//               dialect: "postgres",
//               logging : false }
//         )
//     }

//     getSequelize() {
//         return this.sequelize
//     }

//     async connect() {
//         try {
//             await this.sequelize.authenticate()
//         } catch (error) {
//             console.error("Unable to connect to the database :", error)
//         }
//     }

// }