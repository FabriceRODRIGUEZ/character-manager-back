import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import autoBind from "auto-bind"

import User from "../models/user.js"
import UserController from "../controllers/user_controller.js"


/**
 * An authentication controller
 * @property {Pool} db
 */
export default class AuthController {

    /**
     * Constructor of the class
     * @param {Pool} db
     */
    constructor(db) {
        autoBind(this)
        this.db = db
    }

    /**
     * Signs up a user
     * @param {Request} req
     * @param {Response} res
     * @returns {Promise<Response>}
     */
    async signup(req, res) {
        const user = new User(req.body.username, req.body.email,
            req.body.password, req.body.visibility)
        user.password = bcrypt.hashSync(user.password, 10)
        await new UserController(this.db).addUser(user)
        return res.status(201).json({
            "username": user.username,
            "email": user.email,
            "visibility": user.visibility
        })
    }

    /**
     * Logs in a user and sends a JWT token
     * @param {Request} req
     * @param {Response} res
     * @returns {Promise<Response>}
     */
    async login(req, res) {
        const emailPattern = new RegExp("^[a-z0-9\.]+@[a-z\.]+\.[a-z]+$")
        const userIdType = emailPattern.test(req.body.user_id) ? "email" : "username"
        const result = await this.db.query(`SELECT * FROM Users
            WHERE ${userIdType} = '${req.body.user_id}'`)
        const user = result.rows[0]
        const token = this.#generateToken({ username: user.username })
        return res.status(200).send(token)
    }

    /**
     * Returns the authentified user
     * @param {Request} req
     * @param {Response} res
     * @returns {Promise<Response>}
     */
    async getMe(req, res) {
        return res.status(200).send(req.user)
    }

    /**
     * Generate a JWT token
     * @private
     * @param {Object{username}} payload
     * @returns {string}
     */
    #generateToken(payload) {
        return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: "1d" })
    }

}