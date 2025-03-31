import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import autoBind from "auto-bind"

import User from "../models/user_model.js"
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
        await new UserController(db).addUser(user)
        const token = this.#generateToken({ username: user.username })
        return res.status(201).json(token)
    }

    async login(req, res) {
        const user = await new UserController(db).getUser(req.body.user_id).rows[0]
        const token = this.#generateToken({ username: user.username })
        return res.status(200).json(token)
    }

    async logout(_, res) {
        //
        return res.status(200).send()
    }

    async getMe(req, res) {
        return res.status(200).json(req.user)
    }

    #generateToken(payload) {
        return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: "1d" })
    }

}