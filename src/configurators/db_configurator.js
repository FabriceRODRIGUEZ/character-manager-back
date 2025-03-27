import dotenv from "dotenv"
import pg from "pg"

import {users_creation, characters_creation} from "./creation_queries.js"


export default class DbConfigurator {

    connect() {
        dotenv.config()
        console.log(`Using database ${process.env.DB_NAME}`)
        this.db = new pg.Pool({
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: process.env.DB_NAME
        })
    }

    async seed_database() {
        console.log("Seeding database...")
        try {
            await this.db.query(users_creation)
        } catch(error) {
            // TABLE ALREADY EXISTS (https://www.postgresql.org/docs/8.2/errcodes-appendix.html)
            if (error.code !== "42P07") {
                console.log(error)
            }
        }
        try {
            await this.db.query(characters_creation)
        } catch(error) {
            // TABLE ALREADY EXISTS (https://www.postgresql.org/docs/8.2/errcodes-appendix.html)
            if (error.code !== "42P07") {
                console.log(error)
            }
        }
    }

}

// - - -

// module.exports = async (userAccountService, carService) => {
//     return new Promise(async (resolve, reject) => {
//         console.log("Seeding database...")
//         try {
//             await userAccountService.dao.db.query("CREATE TABLE useraccount(id SERIAL PRIMARY KEY, displayname TEXT NOT NULL, login TEXT NOT NULL, password TEXT NOT NULL)")
//             await carService.dao.db.query(`CREATE TABLE car (id SERIAL PRIMARY KEY, make TEXT, model TEXT, 
//                                         isrunning BOOLEAN, price NUMERIC, builddate DATE,
//                                         useraccount_id INTEGER REFERENCES useraccount(id))`)
//             resolve()
//         }catch(e)  {
//             if (e.code === "42P07") { // TABLE ALREADY EXISTS https://www.postgresql.org/docs/8.2/errcodes-appendix.html
//                 resolve()
//             } else {
//                 console.log(e)
//                 reject(e)
//             }
//         }
//     })
// }

// module.exports = class BaseDAO {
//     constructor(db, tablename) {
//         this.db = db
//         this.tablename = tablename
//     }
//     delete(id) {
//         return this.db.query(`DELETE FROM ${this.tablename} WHERE id=$1`, [id])
//     }
//     getById(id) {
//         return new Promise((resolve, reject) =>
//             this.db.query(`SELECT * FROM ${this.tablename} WHERE id=$1`, [ id ])
//                 .then(res => resolve(res.rows[0]) )
//                 .catch(e => reject(e)))
//     }
// }

// - - -

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