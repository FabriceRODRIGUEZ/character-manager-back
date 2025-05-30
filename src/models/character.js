/**
 * A character of a user
 * @property {string} first_name
 * @property {string} last_name
 * @property {string} gender
 * @property {string} work
 * @property {string} actor
 * @property {string} voice_actor
 * @property {string} profile
 * @property {string} comment
 * @property {number} appreciation
 */
export default class Character {

    /**
     * Constructor of a character
     * @param {Object} body 
     */
    constructor(body) {
        /** @type {string} */
        this.first_name = body.first_name

        /** @type {string} */
        this.last_name = body.last_name

        /** @type {string} */
        this.gender = body.gender

        /** @type {string} */
        this.work = body.work

        /** @type {string} */
        this.actor = body.actor

        /** @type {string} */
        this.voice_actor = body.voice_actor

        /** @type {string} */
        this.profile = body.profile

        /** @type {string} */
        this.comment = body.comment

        /** @type {number} */
        this.appreciation = body.appreciation
    }

}