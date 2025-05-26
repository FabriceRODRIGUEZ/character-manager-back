import autoBind from "auto-bind"

import Character from "../models/character.js"


export default class CharacterController {

    constructor(db) {
        autoBind(this)
        this.db = db
    }

    async getAllCharacters(_, res) {
        const result = await this.db.query(`SELECT * FROM Characters
            ORDER BY first_name`)
        return res.status(200).json(result.rows)
    }

    async getCharacters(req, res) {
        const filters = req.body
        const sortPorperty = req.params.sort_property
        const sortOrder = req.params.sort_order
        const offset = req.params.offset
        const result = await this.db.query(`SELECT * FROM Characters
            WHERE first_name LIKE '%${filters.first_name}%'
            AND last_name LIKE '%${filters.last_name}%'
            AND gender LIKE '%${filters.gender}%'
            AND work LIKE '%${filters.work}%'
            AND actor LIKE '%${filters.actor}%'
            AND voice_actor LIKE '%${filters.voice_actor}%'
            AND comment LIKE '%${filters.comment}%'
            AND appreciation = ${filters.appreciation}
            ORDER BY ${sortPorperty} ${(sortOrder == "ascendant") ? "ASC" : "DESC"}
            LIMIT 10 OFFSET ${offset}`)
        return res.status(200).json(result)
    }

    async getCharacter(req, res) {
        const result = await this.db.query(`SELECT * FROM Characters
            WHERE id = ${req.params.id}`)
        return res.status(200).json(result[0])
    }

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

    async deleteCharacter(req, res) {
        await this.db.query(`DELETE FROM Characters
            WHERE id = ${req.params.id}`)
        return res.status(204).send()
    }

}