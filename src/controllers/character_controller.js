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
    }

    /**
     * Returns all the characters of a user
     * @param {Response} res
     * @returns {Promise<Response>}
     */
    async getAllCharacters(_, res) {
        const result = await this.db.query(`SELECT * FROM Characters
            ORDER BY first_name ASC`)
        return res.status(200).json(result.rows)
    }

    /**
     * Returns a selection of characters
     * @param {Request} req
     * @param {Response} res
     * @returns {Promise<Response>}
     */
    async getCharacters(req, res) {
        const sortPorperty = req.query.sort_property
        const sortOrder = req.query.sort_order
        const result = await this.db.query(`SELECT * FROM Characters
            WHERE first_name LIKE '%${req.query.first_name}%'
            AND gender LIKE '%${req.query.gender}%'
            AND work LIKE '%${req.query.work}%'
            ${(req.query.appreciation) ? `AND appreciation = ${req.query.appreciation}` : ""}
            ORDER BY ${sortPorperty} ${(sortOrder == "ascendant") ? "ASC" : "DESC"}
            ${(sortPorperty != "first_name") ? ", first_name ASC" : ""}`)
        return res.status(200).json(result.rows)
    }

    /**
     * Returns a character according to its id
     * @param {Request} req
     * @param {Response} res
     * @returns {Promise<Response>}
     */
    async getCharacter(req, res) {
        const result = await this.db.query(`SELECT * FROM Characters
            WHERE id = ${req.params.id}`)
        return res.status(200).json(result.rows[0])
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
            (DEFAULT, '${req.user}',
            ${(! character.first_name) ? "NULL" : `'${character.first_name}'`},
            ${(! character.last_name) ? "NULL" : `'${character.last_name}'`},
            ${(! character.gender) ? "NULL" : `'${character.gender}'`},
            ${(! character.work) ? "NULL" : `'${character.work}'`},
            ${(! character.actor) ? "NULL" : `'${character.actor}'`},
            ${(! character.voice_actor) ? "NULL" : `'${character.voice_actor}'`},
            ${(! character.profile) ? "NULL" : `'${character.profile}'`},
            ${(! character.comment) ? "NULL" : `'${character.comment}'`},
            ${(! character.appreciation) ? "NULL" : `${character.appreciation}`})`)
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
            first_name = ${(! character.first_name) ? "NULL" : `'${character.first_name}'`},
            last_name = ${(! character.last_name) ? "NULL" : `'${character.last_name}'`},
            gender = ${(! character.gender) ? "NULL" : `'${character.gender}'`},
            work = ${(! character.work) ? "NULL" : `'${character.work}'`},
            actor = ${(! character.actor) ? "NULL" : `'${character.actor}'`},
            voice_actor = ${(! character.voice_actor) ? "NULL" : `'${character.voice_actor}'`},
            profile = ${(! character.profile) ? "NULL" : `'${character.profile}'`},
            comment = ${(! character.comment) ? "NULL" : `'${character.comment}'`},
            appreciation = ${(! character.appreciation) ? "NULL" : `${character.appreciation}`}
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