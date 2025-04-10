import bcrypt from "bcrypt"
import autoBind from "auto-bind"

import User from "../models/user.js"


export default class UserController {

    constructor(db) {
        autoBind(this)
        this.db = db
    }

    async getAllUsers(_, res) {
        const result = await this.db.query(`SELECT username, email, visibility
            FROM Users ORDER BY username`)
        return res.status(200).json(result.rows)
    }

    async getUserReq(req, res) {
        const result = await this.db.query(`SELECT username, email, visibility
            FROM Users WHERE username = '${req.params.username}'`)
        return res.status(200).json(result.rows[0])
    }

    async getUser(username) {
        const result = await this.db.query(`SELECT username, email, visibility
            FROM Users WHERE username = '${username}'`)
        return result.rows[0]
    }

    async addUserReq(req, res) {
        const user = new User(req.body.username, req.body.email,
            req.body.password, req.body.visibility)
        await this.db.query(`INSERT INTO Users (username, email, password, visibility) VALUES
            ('${user.username}', '${user.email}', '${user.password}', '${user.visibility}')`)
        user.password = null
        return res.status(201).json(user)
    }

    async addUser(user) {
        await this.db.query(`INSERT INTO Users (username, email, password, visibility) VALUES
            ('${user.username}', '${user.email}', '${user.password}', '${user.visibility}')`)
    }

    async updateUserReq(req, res) {
        const user = await this.getUser(req.params.username)
        if (req.body.username) {
            await this.db.query(`UPDATE Users SET
                username = '${req.body.username}'
                WHERE username = '${req.params.username}'`)
            user.username = req.body.username
        }
        if (req.body.email) {
            await this.db.query(`UPDATE Users SET
                email = '${req.body.email}'
                WHERE username = '${req.params.username}'`)
            user.email = req.body.email
        }
        if (req.body.password) {
            const passwordHash = bcrypt.hashSync(req.body.password, 10)
            await this.db.query(`UPDATE Users SET
                password = '${passwordHash}'
                WHERE username = '${req.params.username}'`)
        }
        if (req.body.visibility) {
            await this.db.query(`UPDATE Users SET
                visibility = '${req.body.visibility}'
                WHERE username = '${req.params.username}'`)
            user.visibility = req.body.visibility
        }
        return res.status(200).json(user)
    }

    async deleteUserReq(req, res) {
        await this.db.query(`DELETE FROM Users
            WHERE username = '${req.params.username}'`)
        return res.status(204).send()
    }

    async deleteUser(username) {
        await this.db.query(`DELETE FROM Users
            WHERE username = '${username}'`)
    }

}