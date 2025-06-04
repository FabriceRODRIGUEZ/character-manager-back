import chai from "chai"
import chaiHttp from "chai-http"

import Server from "../src/server.js"


describe("Users routes :", function() {

    // Don't work with () => {}
    this.timeout(5000)
    chai.use(chaiHttp)
    const expect = chai.expect
    const server = new Server()
    const app = server.app
    let token


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
                expect(res.text).to.exist
                token = res.text
                done()
            })
    })


    describe("Route GET /users :", () => {

        it("Should not return all users without token", (done) => {
            chai.request(app).get("/users")
                .set("authorization", "Bearer ")
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res.status).to.equal(401)
                    expect(res.text).to.equal("Token not provided")
                    done()
                })
        })

        it("Should not return all users with invalid token", (done) => {
            chai.request(app).get("/users")
                .set("authorization", "Bearer abc")
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res.status).to.equal(401)
                    expect(res.text).to.equal("Invalid token")
                    done()
                })
        })

        it("Should return all users with valid token", (done) => {
            chai.request(app).get("/users")
                .set("authorization", `Bearer ${token}`)
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res.status).to.equal(200)
                    expect(res.body).to.be.an("array")
                    expect(res.body.length).to.equal(1)
                    done()
                })
        })

    })


    describe("Route PATCH /users :", () => {

        it("Should update username with valid token", (done) => {
            chai.request(app).patch("/users")
                .set("authorization", `Bearer ${token}`)
                .send({ username: "other" })
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res.status).to.equal(200)
                    expect(res.body.username).to.equal("other")
                    expect(res.body.email).to.equal("test@gmail.com")
                    expect(res.body.visibility).to.equal("private")
                    expect(res.body.token).to.exist
                    token = res.body.token
                    done()
                })
        })

        it("Should update email with valid token", (done) => {
            chai.request(app).patch("/users")
                .set("authorization", `Bearer ${token}`)
                .send({ email: "other@gmail.com" })
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res.status).to.equal(200)
                    expect(res.body).to.deep.equal({ username: "other",
                        email: "other@gmail.com", visibility: "private" })
                    done()
                })
        })

        it("Should update password with valid token", (done) => {
            chai.request(app).patch("/users")
                .set("authorization", `Bearer ${token}`)
                .send({ password: "12345678" })
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res.status).to.equal(200)
                    expect(res.body).to.deep.equal({ username: "other",
                        email: "other@gmail.com", visibility: "private" })
                    done()
                })
        })

        it("Should update visibility with valid token", (done) => {
            chai.request(app).patch("/users")
                .set("authorization", `Bearer ${token}`)
                .send({ visibility: "public" })
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res.status).to.equal(200)
                    expect(res.body).to.deep.equal({ username: "other",
                        email: "other@gmail.com", visibility: "public" })
                    done()
                })
        })

    })


    describe("Route DELETE /users :", () => {

        it("Should not delete user without token", (done) => {
            chai.request(app).delete("/users")
                .set("authorization", "Bearer ")
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res.status).to.equal(401)
                    expect(res.text).to.equal("Token not provided")
                    done()
                })
        })

        it("Should not delete user with invalid token", (done) => {
            chai.request(app).delete("/users")
                .set("authorization", "Bearer 123")
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res.status).to.equal(401)
                    expect(res.text).to.equal("Invalid token")
                    done()
                })
        })

        it("Should delete user with valid token", (done) => {
            chai.request(app).delete("/users")
                .set("authorization", `Bearer ${token}`)
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res.status).to.equal(204)
                    expect(res.body).to.be.empty
                    done()
                })
        })

    })

})