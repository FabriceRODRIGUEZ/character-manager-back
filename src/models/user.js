/**
 * A user of the application
 * @property {string} username
 * @property {string} email
 * @property {string} password
 * @property {string} visibility
 */
export default class User {

    /**
     * Constructor of a user
     * @param {string} username
     * @param {string} email
     * @param {string} password
     * @param {string} visibility
     */
    constructor(username, email, password, visibility) {
        /** @type {string} */
        this.username = username

        /** @type {string} */
        this.email = email

        /** @type {string} */
        this.password = password

        /** @type {string} */
        this.visibility = visibility
    }

}