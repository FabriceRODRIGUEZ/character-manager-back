import bcrypt from "bcrypt"
import autoBind from "auto-bind"


export default class LoginValidator {

    constructor(db) {
        this.db = db
        autoBind(this)
    }

    async validateLogin(req, res, next) {
        const fields = req.body

        if (!fields.userId || !fields.password) {
            return res.status(400).send("Missing field(s)")
        }

        const user = this.db.query(`SELECT * FROM Users WHERE username = '${fields.userId}'`).rows[0]
        // Check user

        const isValidPassword = await bcrypt.compare(fields.password, user.password)
        if (!isValidPassword) {
            return res.status(401).send("User or password incorrect")
        }

        next()
    }

}