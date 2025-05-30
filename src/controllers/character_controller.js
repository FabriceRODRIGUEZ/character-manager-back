import autoBind from "auto-bind"

import Character from "../models/character.js"


/**
 * A character controller
 * @property {Pool} db
 * @property {string} columnsList
 */
export default class CharacterController {

    /**
     * Constructor of the class
     * @param {Pool} db
     */
    constructor(db) {
        autoBind(this)
        this.db = db
        this.columnsList = `first_name, last_name, gender, work,
            actor, voice_actor, profile, comment, appreciation`
    }

    /**
     * Returns all the characters of a user
     * @param {Response} res
     * @returns {Promise<Response>}
     */
    async getAllCharacters(_, res) {
        const result = await this.db.query(`SELECT ${this.columnsList}
            FROM Characters
            ORDER BY first_name`)
        return res.status(200).json(result.rows)
    }

    /**
     * Returns a selection of characters
     * @param {Request} req
     * @param {Response} res
     * @returns {Promise<Response>}
     */
    async getCharacters(req, res) {
        const filters = req.body
        const sortPorperty = req.params.sort_property
        const sortOrder = req.params.sort_order
        const offset = req.params.offset
        const result = await this.db.query(`SELECT ${this.columnsList}
            FROM Characters
            WHERE first_name LIKE '%${filters.first_name}%'
            AND last_name LIKE '%${filters.last_name}%'
            AND gender = '${filters.gender}'
            AND work LIKE '%${filters.work}%'
            AND actor LIKE '%${filters.actor}%'
            AND voice_actor LIKE '%${filters.voice_actor}%'
            AND comment LIKE '%${filters.comment}%'
            AND appreciation = ${filters.appreciation}
            ORDER BY ${sortPorperty} ${(sortOrder == "ascendant") ? "ASC" : "DESC"}
            LIMIT 10 OFFSET ${offset}`)
        return res.status(200).json(result)
    }

    /**
     * Returns a character according to its id
     * @param {Request} req
     * @param {Response} res
     * @returns {Promise<Response>}
     */
    async getCharacter(req, res) {
        const result = await this.db.query(`SELECT ${this.columnsList}
            FROM Characters
            WHERE id = ${req.params.id}`)
        return res.status(200).json(result[0])
    }

    /**
     * Adds a character to the database
     * @param {Request} req
     * @param {Response} res
     * @returns {Promise<Response>}
     */
    async addCharacter(req, res) {
        const character = new Character(req.body)
        await this.db.query(`INSERT INTO Characters VALUES
            (DEFAULT, '${req.user}', '${character.first_name}',
            '${character.last_name}', '${character.gender}',
            '${character.work}', '${character.actor}',
            '${character.voice_actor}', '${character.profile}',
            '${character.comment}', ${character.appreciation})`)
        return res.status(201).json(character)
    }

    /**
     * Updates a character in the database
     * @param {Request} req
     * @param {Response} res
     * @returns {Promise<Response>}
     */
    async updateCharacter(req, res) {
        const character = new Character(req.body)
        await this.db.query(`UPDATE Characters SET
            first_name = '${character.first_name}',
            last_name = '${character.last_name}',
            gender = '${character.gender}',
            work = '${character.work}',
            actor = '${character.actor}',
            voice_actor = '${character.voice_actor}',
            profile = '${character.profile}',
            comment = '${character.comment}',
            appreciation = ${character.appreciation}
            WHERE id = ${req.params.id}`)
        return res.status(200).json(character)
    }

    /**
     * Deletes a character in the database
     * @param {Request} req
     * @param {Response} res
     * @returns {Promise<Response>}
     */
    async deleteCharacter(req, res) {
        await this.db.query(`DELETE FROM Characters
            WHERE id = ${req.params.id}`)
        return res.status(204).send()
    }

}