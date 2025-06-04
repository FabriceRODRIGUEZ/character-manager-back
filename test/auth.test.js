import chai from "chai"
import chaiHttp from "chai-http"

import Server from "../src/server.js"


describe("Authentication routes :", function() {

    // Don't work with () => {}
    this.timeout(5000)
    chai.use(chaiHttp)
    const expect = chai.expect
    const server = new Server()
    const app = server.app
    let testUserToken
    let otherUserToken


    before("Creation of another user", (done) => {
        chai.request(app).post("/signup")
            .send({ username : "other", email: "other@gmail.com",
                password: "test1234", visibility: "private" })
            .end((err, res) => {
                expect(err).to.be.null
                expect(res.status).to.equal(201)
                expect(res.body).to.deep.equal({ username: "other",
                    email: "other@gmail.com", visibility: "private" })
                done()
            })
    })


    before("Connexion of the test user", (done) => {
        chai.request(app).post("/login")
            .send({ user_id : "other", password: "test1234" })
            .end((err, res) => {
                expect(err).to.be.null
                expect(res.status).to.equal(200)
                expect(res.text).to.exist
                otherUserToken = res.text
                done()
            })
    })


    describe("Route POST /signup :", () => {

        it("Should not create user with missing fields", (done) => {
            chai.request(app).post("/signup")
                .send({ username : "test" })
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res.status).to.equal(400)
                    expect(res.text).to.equal("Missing field(s)")
                    done()
                })
        })

        it("Should not create user with unavailable username", (done) => {
            chai.request(app).post("/signup")
                .send({ username : "other", email: "test@gmail.com",
                    password: "test1234", visibility: "private" })
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res.status).to.equal(400)
                    expect(res.text).to.equal("Username already exists")
                    done()
                })
        })

        it("Should not create user with invalid email", (done) => {
            chai.request(app).post("/signup")
                .send({ username : "test", email: "@gmail.com",
                    password: "test1234", visibility: "private" })
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res.status).to.equal(400)
                    expect(res.text).to.equal("Incorrect email structure")
                    done()
                })
        })

        it("Should not create user with unavailable email", (done) => {
            chai.request(app).post("/signup")
                .send({ username : "test", email: "other@gmail.com",
                    password: "test1234", visibility: "private" })
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res.status).to.equal(400)
                    expect(res.text).to.equal("Email already used")
                    done()
                })
        })

        it("Should not create user with invalid password", (done) => {
            chai.request(app).post("/signup")
                .send({ username : "test", email: "test@gmail.com",
                    password: "test", visibility: "private" })
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res.status).to.equal(400)
                    expect(res.text).to.equal("Password not long enough")
                    done()
                })
        })

        it("Should not create user with invalid visibility", (done) => {
            chai.request(app).post("/signup")
                .send({ username : "test", email: "test@gmail.com",
                    password: "test1234", visibility: "visibility" })
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res.status).to.equal(400)
                    expect(res.text).to.equal("Wrong visibility value")
                    done()
                })
        })

        it("Should create user with valid fields", (done) => {
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

    })


    describe("Route POST /login :", () => {

        it("Should not connect user with missing fields", (done) => {
            chai.request(app).post("/login")
                .send({ user_id: "test" })
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res.status).to.equal(400)
                    expect(res.text).to.equal("Missing field(s)")
                    done()
                })
        })

        it("Should not connect user with invalid username", (done) => {
            chai.request(app).post("/login")
                .send({ user_id: "abc", password: "test1234" })
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res.status).to.equal(401)
                    expect(res.text).to.equal("User does not exist")
                    done()
                })
        })

        it("Should not connect user with invalid password", (done) => {
            chai.request(app).post("/login")
                .send({ user_id: "test", password: "123" })
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res.status).to.equal(401)
                    expect(res.text).to.equal("Incorrect password")
                    done()
                })
        })

        it("Should connect valid user with username", (done) => {
            chai.request(app).post("/login")
                .send({ user_id: "test", password: "test1234" })
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res.status).to.equal(200)
                    expect(res.text).to.exist
                    testUserToken = res.text
                    done()
                })
        })

        it("Should connect valid user with email", (done) => {
            chai.request(app).post("/login")
                .send({ user_id: "test@gmail.com", password: "test1234" })
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res.status).to.equal(200)
                    expect(res.text).to.exist
                    done()
                })
        })

    })


    describe("Route GET /me :", () => {

        // it("Should refuse acces without authorization header", (done) => {
        //     chai.request(app).get("/me")
        //         .end((err, res) => {
        //             expect(err).to.be.null
        //             expect(res.status).to.equal(401)
        //             expect(res.text).to.equal("Token not provided")
        //             done()
        //         })
        // })

        it("Should refuse acces without token", (done) => {
            chai.request(app).get("/me")
                .set("authorization", "Bearer ")
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res.status).to.equal(401)
                    expect(res.text).to.equal("Token not provided")
                    done()
                })
        })

        it("Should refuse acces with invalid token", (done) => {
            chai.request(app).get("/me")
                .set("authorization", "Bearer 123")
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res.status).to.equal(401)
                    expect(res.text).to.equal("Invalid token")
                    done()
                })
        })

        it("Should allow acces with valid token", (done) => {
            chai.request(app).get("/me")
                .set("authorization", `Bearer ${testUserToken}`)
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res.status).to.equal(200)
                    expect(res.text).to.equal("test")
                    done()
                })
        })

    })


    after("Suppression of the test user", (done) => {
        chai.request(app).delete("/users")
            .set("authorization", `Bearer ${testUserToken}`)
            .end((err, res) => {
                expect(err).to.be.null
                expect(res.status).to.equal(204)
                done()
            })
    })


    after("Suppression of the other user", (done) => {
        chai.request(app).delete("/users")
            .set("authorization", `Bearer ${otherUserToken}`)
            .end((err, res) => {
                expect(err).to.be.null
                expect(res.status).to.equal(204)
                done()
            })
    })

})