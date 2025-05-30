import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import autoBind from "auto-bind"

import User from "../models/user.js"


/**
 * A user controller
 * @property {Pool} db
 */
export default class UserController {

    /**
     * Constructor of the class
     * @param {Pool} db
     */
    constructor(db) {
        autoBind(this)
        this.db = db
    }

    /**
     * Returns all the users in the database
     * @param {Response} res
     * @returns {Promise<Response>}
     */
    async getAllUsers(_, res) {
        const result = await this.db.query(`SELECT username, email, visibility
            FROM Users ORDER BY username`)
        return res.status(200).json(result.rows)
    }

    /**
     * Returns a user accord to its username
     * @param {Request} req
     * @param {Response} res
     * @returns {Promise<Response>}
     */
    async getUserReq(req, res) {
        const result = await this.db.query(`SELECT username, email, visibility
            FROM Users WHERE username = '${req.params.username}'`)
        return res.status(200).json(result.rows[0])
    }

    /**
     * Returns a user according to its username
     * @param {string} username
     * @returns {Object{username, email, visibility}}
     */
    async getUser(username) {
        const result = await this.db.query(`SELECT username, email, visibility
            FROM Users WHERE username = '${username}'`)
        return result.rows[0]
    }

    /**
     * Adds a user to the database
     * @param {Request} req
     * @param {Response} res
     * @returns {Promise<Response>}
     */
    async addUserReq(req, res) {
        const user = new User(req.body.username, req.body.email,
            req.body.password, req.body.visibility)
        await this.db.query(`INSERT INTO Users (username, email, password, visibility) VALUES
            ('${user.username}', '${user.email}', '${user.password}', '${user.visibility}')`)
        user.password = null
        return res.status(201).json(user)
    }

    /**
     * Adds a user to the database
     * @param {User} user
     * @returns {Promise<Response>}
     */
    async addUser(user) {
        await this.db.query(`INSERT INTO Users (username, email, password, visibility) VALUES
            ('${user.username}', '${user.email}', '${user.password}', '${user.visibility}')`)
    }

    /**
     * Updates a user in the database
     * @param {Request} req
     * @param {Response} res
     * @returns {Promise<Response>}
     */
    async updateUser(req, res) {
        const user = await this.getUser(req.user)
        if (req.body.username) {
            await this.db.query(`UPDATE Users SET
                username = '${req.body.username}'
                WHERE username = '${req.user}'`)
            const token = this.#generateToken({ username: user.username })
            user.username = req.body.username
            user.token = token
        }
        if (req.body.email) {
            await this.db.query(`UPDATE Users SET
                email = '${req.body.email}'
                WHERE username = '${req.user}'`)
            user.email = req.body.email
        }
        if (req.body.password) {
            const passwordHash = bcrypt.hashSync(req.body.password, 10)
            await this.db.query(`UPDATE Users SET
                password = '${passwordHash}'
                WHERE username = '${req.user}'`)
        }
        if (req.body.visibility) {
            await this.db.query(`UPDATE Users SET
                visibility = '${req.body.visibility}'
                WHERE username = '${req.user}'`)
            user.visibility = req.body.visibility
        }
        return res.status(200).json(user)
    }

    /**
     * Deletes a user in the database
     * @param {Request} req
     * @param {Response} res
     * @returns {Promise<Response>}
     */
    async deleteUser(req, res) {
        await this.db.query(`DELETE FROM Users
            WHERE username = '${req.user}'`)
        return res.status(204).send()
    }

    /**
     * Generates a JWT token
     * @private
     * @param {Object{username}} payload
     * @returns {string}
     */
    #generateToken(payload) {
        return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: "1d" })
    }

}