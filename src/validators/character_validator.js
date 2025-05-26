import autoBind from "auto-bind"


export default class CharacterValidator {

    constructor(db) {
        this.db = db
        autoBind(this)
    }

    async validateAddCharacter(req, res, next) {
        //

        next()
    }

    async validateUpdateCharacter(req, res, next) {
        //

        next()
    }

    async validateDeleteCharacter(req, res, next) {
        //

        next()
    }

}