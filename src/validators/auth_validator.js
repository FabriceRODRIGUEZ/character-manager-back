import bcrypt from "bcrypt"
import autoBind from "auto-bind"


export default class AuthValidator {

    constructor(db) {
        this.db = db
        autoBind(this)
    }

    validateSignup(req, res, next) {
        const user = req.body

        if (!user.username || !user.email || !user.password || !user.visibility) {
            return res.status(400).send("Missing field(s)")
        }

        // Check username

        const emailPattern = new RegExp("^(\w+)@(\w+)\.(\w+)$")
        if (emailPattern.test(user.password)) {
            return res.status(400).send("Incorrect email structure")
        }

        // Check email

        const userInDb = this.db.query(`SELECT COUNT(*) FROM Users WHERE email = '${user.email}'`)
        if (userInDb == 1) {
            res.status(400).send("Email already used")
        }

        if (user.password.length < 8) {
            return res.status(400).send("The password must contain at least 8 characters")
        }

        // Check visibility

        next()
    }

    async validateLogin(req, res, next) {
        const fields = req.body

        if (!fields.user_id || !fields.password) {
            return res.status(400).send("Missing field(s)")
        }

        const result = await this.db.query(`SELECT * FROM Users
            WHERE username = '${fields.user_id}'`)
        const user = result.rows[0]
        // Check user

        const isValidPassword = await bcrypt.compare(fields.password, user.password)
        if (!isValidPassword) {
            return res.status(401).send("User or password incorrect")
        }

        next()
    }

}