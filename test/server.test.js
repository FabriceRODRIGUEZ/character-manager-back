import chai from "chai"
import chaiHttp from "chai-http"
import { expect } from "chai"

import Server from "../src/server.js"


describe("API tests :", () => {

    // this.timeout(5000)
    chai.use(chaiHttp)
    const server = new Server()
    const app = server.app
    const token = ""

    before((done) => {
        // Creation of the test user
        chai.request(app).post("/signup")
            .send({ username : "test", email: "test@gmail.com",
                password: "test1234", visibility: "private" })
            .end((_, res) => {
                expect(res.status).equal(201)
                done()
            })

        // Connexion of the test user
        //
    })

    // Test
    it("", (done) => {
        //
    })

    after((done) => {
        // Suppression of the test user
        chai.request(app).delete("/users/test").send()
            .end((_, res) => {
                expect(res.status).equal(204)
                done()
            })
    })

})