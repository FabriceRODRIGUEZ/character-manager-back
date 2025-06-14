import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import autoBind from "auto-bind"


/**
 * A validator for authentication requests
 */
export default class AuthValidator {

    /**
     * Constructor of the authentication validator
     * @param {Pool} db
     */
    constructor(db) {
        autoBind(this)
        this.db = db
    }

    /**
     * Validates a signup request
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @returns {Promise<Response>}
     */
    async validateSignup(req, res, next) {
        const fields = req.body

        // Checking fields presence
        if (!fields.username || !fields.email || !fields.password || !fields.visibility) {
            return res.status(400).send("Missing field(s)")
        }

        // Checking username availability
        let result = await this.db.query(`SELECT COUNT(*)
            FROM Users WHERE username = '${fields.username}'`)
        const usernameInDb = result.rows[0].count
        if (usernameInDb == 1) {
            return res.status(400).send("Username already exists")
        }

        // Checking email validity
        const emailPattern = new RegExp("^[a-z0-9\.]+@[a-z\.]+\.[a-z]+$")
        if (!emailPattern.test(fields.email)) {
            return res.status(400).send("Incorrect email structure")
        }

        // Checking email availability
        result = await this.db.query(`SELECT COUNT(*)
            FROM Users WHERE email = '${fields.email}'`)
        const emailInDb = result.rows[0].count
        if (emailInDb == 1) {
            return res.status(400).send("Email already used")
        }

        // Checking password length
        if (fields.password.length < 8) {
            return res.status(400).send("Password not long enough")
        }

        // Checking visibility value
        if (!["private", "public"].includes(fields.visibility)) {
            return res.status(400).send("Wrong visibility value")
        }

        next()
    }

    /**
     * Validates a login request
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @returns {Promise<Response>}
     */
    async validateLogin(req, res, next) {
        const fields = req.body

        // Checking fields presence
        if (!fields.user_id || !fields.password) {
            return res.status(400).send("Missing field(s)")
        }

        const emailPattern = new RegExp("^[a-z0-9\.]+@[a-z\.]+\.[a-z]+$")
        const userIdType = emailPattern.test(fields.user_id) ? "email" : "username"
        const result = await this.db.query(`SELECT * FROM Users
            WHERE ${userIdType} = '${fields.user_id}'`)

        // Checking user presence in db
        if (result.rows.length == 0) {
            return res.status(401).send("User does not exist")
        }

        const user = result.rows[0]

        // Checking password validity
        const isValidPassword = await bcrypt.compare(fields.password, user.password)
        if (!isValidPassword) {
            return res.status(401).send("Incorrect password")
        }

        next()
    }

    /**
     * Authenticates a request according to the JWT token
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @returns {Promise<Response>}
     */
    authenticate(req, res, next) {
        const token = req.headers.authorization.split(" ")[1]

        // Checking token presence
        if (!token) {
            return res.status(401).send("Token not provided")
        }
        
        // Checking token validity
        try { jwt.verify(token, process.env.TOKEN_SECRET) }
        catch (error) { return res.status(401).send("Invalid token") }
    
        req.user = jwt.decode(token).username
        
        next()
    }

}