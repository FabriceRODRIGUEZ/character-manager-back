import express, { Router } from "express"
import autoBind from "auto-bind"

import AuthValidator from "../validators/auth_validator.js"
import CharacterValidator from "../validators/character_validator.js"
import CharacterController from "../controllers/character_controller.js"


/**
 * A router for the characters
 */
export default class CharacterRouter {

    /**
     * Constructor of the character router
     * @param {Pool} db
     */
    constructor(db) {
        autoBind(this)

        /** @type {Router} */
        this.router = express.Router()
        const authValidator = new AuthValidator(db)
        const characterValidator = new CharacterValidator(db)
        const controller = new CharacterController(db)

        this.router.get("/characters", authValidator.authenticate, controller.getAllCharacters)
        this.router.get("/characters/:id", authValidator.authenticate, controller.getCharacter)
        this.router.post("/characters", authValidator.authenticate,
            characterValidator.validateAddCharacter, controller.addCharacter)
        this.router.patch("/characters/:id", authValidator.authenticate,
            characterValidator.validateUpdateCharacter, controller.updateCharacter)
        this.router.delete("/characters/:id", authValidator.authenticate,
            characterValidator.validateDeleteCharacter, controller.deleteCharacter)
    }

}