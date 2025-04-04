import autoBind from "auto-bind"


export default class UserValidator {

    constructor(db) {
        this.db = db
        autoBind(this)
    }

    validateGetUser(req, res, next) {
        //

        next()
    }

    validateAddUser(req, res, next) {
        //

        next()
    }

    validateUpdateUser(req, res, next) {
        //

        next()
    }

    validateDeleteUser(req, res, next) {
        //

        next()
    }

}