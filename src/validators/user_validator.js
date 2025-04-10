import autoBind from "auto-bind"


export default class UserValidator {

    constructor(db) {
        this.db = db
        autoBind(this)
    }

    async validateUpdateUser(req, res, next) {
        const fields = req.body

        // Checking user presence in db
        this.#chekUserInDb(req, res)

        if (fields.username) {
            // Checking username availability
            const result = await this.db.query(`SELECT COUNT(*)
                FROM Users WHERE username = '${fields.username}'`)
            const usernameInDb = result.rows[0].count
            if (usernameInDb == 1) {
                return res.status(400).send("Username already exists")
            }
        }

        else if (fields.email) {
            // Checking email validity
            const emailPattern = new RegExp("^[a-z0-9\.]+@[a-z\.]+\.[a-z]+$")
            if (!emailPattern.test(fields.email)) {
                return res.status(400).send("Incorrect email structure")
            }

            // Checking email availability
            const result = await this.db.query(`SELECT COUNT(*)
                FROM Users WHERE email = '${fields.email}'`)
            const emailInDb = result.rows[0].count
            if (emailInDb == 1) {
                return res.status(400).send("Email already used")
            }
        }

        else if (fields.password) {
            // Checking password length
            if (fields.password.length < 8) {
                return res.status(400).send("Password not long enough")
            }
        }

        else if (fields.visibility) {
            // Checking visibility value
            if (!["private", "public"].includes(fields.visibility)) {
                return res.status(400).send("Wrong visibility value")
            }
        }

        else {
            return res.status(400).send("Missing field")
        }

        next()
    }

    async validateDeleteUser(req, res, next) {
        // Checking user presence in db
        await this.#chekUserInDb(req, res)

        next()
    }

    async #chekUserInDb(req, res) {
        const result = await this.db.query(`SELECT COUNT(*)
            FROM Users WHERE username = '${req.params.username}'`)
        const userInDb = result.rows[0].count
        if (userInDb == 0) {
            return res.status(400).send("User does not exist")
        }
    }

}