import dotenv from "dotenv"
import pg from "pg"


export default class DbConfigurator {

    constructor() {
        this.users_creation = `CREATE TABLE Users (
            username VARCHAR(20),
            email VARCHAR(50) NOT NULL UNIQUE,
            password TEXT NOT NULL,
            visibility VARCHAR(7) NOT NULL DEFAULT 'private',
            
            CONSTRAINT pk_users PRIMARY KEY(username),
            CONSTRAINT ck_users_visibility CHECK(visibility = 'private' OR visibility = 'public')
        )`

        this.characters_creation = `CREATE TABLE Characters (
            id SERIAL,
            owner VARCHAR(20),
            first_name VARCHAR(20) NOT NULL,
            last_name VARCHAR(20),
            gender CHAR(1) NOT NULL DEFAULT 'M',
            work TEXT NOT NULL,
            actor VARCHAR(50),
            voice_actor VARCHAR(50),
            profile TEXT,
            comment TEXT,
            appreciation INTEGER NOT NULL DEFAULT 1,
            
            CONSTRAINT pk_characters PRIMARY KEY(id),
            CONSTRAINT fk_characters FOREIGN KEY(owner) REFERENCES Users(username) ON DELETE CASCADE,
            CONSTRAINT uq_characters UNIQUE(owner, first_name, last_name, work),
            CONSTRAINT ck_characters_gender CHECK(gender = 'M' OR gender = 'F'),
            CONSTRAINT ck_characters_appreciation CHECK(appreciation IN (1, 2, 3))
        )`
    }

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
            await this.db.query(this.users_creation)
        } catch(error) {
            // TABLE ALREADY EXISTS
            if (error.code !== "42P07") {
                console.log(error)
            }
        }

        try {
            await this.db.query(this.characters_creation)
        } catch(error) {
            // TABLE ALREADY EXISTS
            if (error.code !== "42P07") {
                console.log(error)
            }
        }
    }

}