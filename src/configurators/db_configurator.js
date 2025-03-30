import dotenv from "dotenv"
import pg from "pg"

import { users_creation } from "./creation_queries.js"
import { characters_creation } from "./creation_queries.js"


export default class DbConfigurator {

    connect() {
        dotenv.config()
        console.log("Connecting database...")
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
            // TABLE ALREADY EXISTS
            if (error.code !== "42P07") {
                console.log(error)
            }
        }
        try {
            await this.db.query(characters_creation)
        } catch(error) {
            // TABLE ALREADY EXISTS
            if (error.code !== "42P07") {
                console.log(error)
            }
        }
    }

}