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
        const fields = req.body

        // Checking fields presence
        if (!fields.first_name || !fields.gender || !fields.work || !fields.appreciation) {
            return res.status(400).send("Missing field(s)")
        }

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