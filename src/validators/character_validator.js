import autoBind from "auto-bind"

/**
 * A validator for character requests
 */
export default class CharacterValidator {

    /**
     * Constructor of the character validator
     * @param {Pool} db
     */
    constructor(db) {
        autoBind(this)
        this.db = db
    }

    /**
     * Validates an add character request
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @returns {Promise<Response>}
     */
    async validateAddCharacter(req, res, next) {
        //

        next()
    }

    /**
     * Validates an edit character request
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @returns {Promise<Response>}
     */
    async validateUpdateCharacter(req, res, next) {
        //

        next()
    }

    /**
     * Validates a delete character request
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @returns {Promise<Response>}
     */
    async validateDeleteCharacter(req, res, next) {
        //

        next()
    }

}