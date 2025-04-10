import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import autoBind from "auto-bind"

import User from "../models/user.js"
import UserController from "../controllers/user_controller.js"


export default class AuthController {

    constructor(db) {
        this.db = db
        autoBind(this)
    }

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

    async login(req, res) {
        const emailPattern = new RegExp("^[a-z0-9\.]+@[a-z\.]+\.[a-z]+$")
        const userIdType = emailPattern.test(req.body.user_id) ? "email" : "username"
        const result = await this.db.query(`SELECT * FROM Users
            WHERE ${userIdType} = '${req.body.user_id}'`)
        const user = result.rows[0]
        const token = this.#generateToken({ username: user.username })
        return res.status(200).send(token)
    }

    async getMe(req, res) {
        return res.status(200).send(req.user)
    }

    #generateToken(payload) {
        return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: "1d" })
    }

}