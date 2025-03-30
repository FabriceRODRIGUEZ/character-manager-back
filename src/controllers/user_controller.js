import autoBind from "auto-bind"

import User from "../models/user_model.js"


export default class UserController {

    constructor(db) {
        autoBind(this)
        this.db = db
    }

    async getAllUsers(_, res) {
        const users = await this.db.query(`
            SELECT *
            FROM Users
            ORDER BY username`)
        return res.status(200).json(users.rows)
    }

    async getUser(req, res) {
        const result = await this.db.query(`
            SELECT *
            FROM Users
            WHERE username = '${req.params.username}'`)
        return res.status(200).json(result.rows[0])
    }

    async addUser(req, res) {
        const user = new User(
            req.body.username,
            req.body.email,
            req.body.password,
            req.body.visibility
        )
        await this.db.query(`
            INSERT INTO Users (username, email, password, visibility) VALUES
            ('${user.username}', '${user.email}', '${user.password}', '${user.visibility}')`)
        return res.status(201).json(user)
    }

    async updateUser(req, res) {
        const user = "User updated"
        if (req.body.username) {
            await this.db.query(`
                UPDATE Users SET
                username = '${req.body.username}'
                WHERE username = '${req.params.username}'`)
        }
        if (req.body.email) {
            await this.db.query(`
                UPDATE Users SET
                email = '${req.body.email}'
                WHERE username = '${req.params.username}'`)
        }
        if (req.body.password) {
            await this.db.query(`
                UPDATE Users SET
                password = '${req.body.password}'
                WHERE username = '${req.params.username}'`)
        }
        if (req.body.visibility) {
            await this.db.query(`
                UPDATE Users SET
                visibility = '${req.body.visibility}'
                WHERE username = '${req.params.username}'`)
        }
        return res.status(200).json(user)
    }

    async deleteUser(req, res) {
        await this.db.query(`
            DELETE FROM Users
            WHERE username = '${req.params.username}'`)
        return res.status(204).send()
    }

}