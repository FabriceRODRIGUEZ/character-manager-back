import chai from "chai"
import chaiHttp from "chai-http"

import Server from "../src/server.js"


describe("Server routes :", function() {

    // Don't work with () => {}
    this.timeout(5000)
    chai.use(chaiHttp)
    const expect = chai.expect
    const server = new Server()
    const app = server.app


    describe("Invalid routes :", () => {

        it("Should refuse acces to invalid route", (done) => {
            chai.request(app).get("/")
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res.status).to.equal(404)
                    expect(res.text).to.equal("Not found")
                    done()
                })
        })

        it("Should refuse acces to invalid route", (done) => {
            chai.request(app).get("/abc")
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res.status).to.equal(404)
                    expect(res.text).to.equal("Not found")
                    done()
                })
        })

    })

})