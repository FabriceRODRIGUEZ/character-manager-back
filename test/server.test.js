import chai from "chai"
import chaiHttp from "chai-http"

import Server from "../src/server.js"


describe("API tests :", function() {

    // this.timeout(5000)
    chai.use(chaiHttp)
    const expect = chai.expect
    const server = new Server()
    const app = server.app
    let token = ""

    before("Creation of the test user", (done) => {
        chai.request(app).post("/signup")
            .send({ username : "test", email: "test@gmail.com",
                password: "test1234", visibility: "private" })
            .end((err, res) => {
                expect(err).to.be.null
                expect(res.status).to.equal(201)
                expect(res.body).to.deep.equal({ username: "test",
                    email: "test@gmail.com", visibility: "private" })
                done()
            })
    })

    before("Connexion of the test user", (done) => {
        chai.request(app).post("/login")
            .send({ user_id : "test", password: "test1234" })
            .end((err, res) => {
                expect(err).to.be.null
                expect(res.status).to.equal(200)
                expect(res.body.token).to.exist
                token = res.body.token
                done()
            })
    })

    // describe("Route /signup :", () => {

    //     //

    // })

    // describe("Route /login :", () => {

    //     //

    // })

    describe("Route /me :", () => {

        it("Should allow acces with valid token", (done) => {
            chai.request(app).get("/me")
                .set("authorization", `Bearer ${token}`)
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res.status).to.equal(200)
                    expect(res.body).to.equal("test")
                    done()
                })
        })

        it("Should refuse acces without token", (done) => {
            chai.request(app).get("/me")
                .set("authorization", `Bearer `)
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res.status).to.equal(401)
                    expect(res.body).to.equal("Token not provided")
                    done()
                })
        })

        it("Should refuse acces with invalid token", (done) => {
            chai.request(app).get("/me")
                .set("authorization", `Bearer 123`)
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res.status).to.equal(401)
                    expect(res.body).to.equal("Invalid token")
                    done()
                })
        })

    })

    // describe("Route / :", () => {

    //     //

    // })

    after("Suppression of the test user", (done) => {
        chai.request(app).delete("/users/test")
            .set("authorization", `Bearer ${token}`)
            .end((err, res) => {
                expect(err).to.be.null
                expect(res.status).equal(204)
                done()
            })
    })

})