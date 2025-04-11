import chai from "chai"
import chaiHttp from "chai-http"

import Server from "../src/server.js"


describe("API tests :", function() {

    this.timeout(5000)
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
                expect(res.text).to.exist
                token = res.text
                done()
            })
    })

    describe("Route POST /signup :", () => {

        it("Should create user with valid fields", (done) => {
            chai.request(app).post("/signup")
                .send({ username : "test1", email: "test1@gmail.com",
                    password: "test1234", visibility: "private" })
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res.status).to.equal(201)
                    expect(res.body).to.deep.equal({ username: "test1",
                        email: "test1@gmail.com", visibility: "private" })
                    done()
                })
        })

        it("Should not create user with missing fields", (done) => {
            chai.request(app).post("/signup")
                .send({ username : "test2" })
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res.status).to.equal(400)
                    expect(res.text).to.equal("Missing field(s)")
                    done()
                })
        })

        it("Should not create user with unavailable username", (done) => {
            chai.request(app).post("/signup")
                .send({ username : "test1", email: "test2@gmail.com",
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
                .send({ username : "test2", email: "@gmail.com",
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
                .send({ username : "test2", email: "test1@gmail.com",
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
                .send({ username : "test2", email: "test2@gmail.com",
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
                .send({ username : "test2", email: "test2@gmail.com",
                    password: "test1234", visibility: "visibility" })
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res.status).to.equal(400)
                    expect(res.text).to.equal("Wrong visibility value")
                    done()
                })
        })

    })

    describe("Route POST /login :", () => {

        it("Should connect valid user with username", (done) => {
            chai.request(app).post("/login")
                .send({ user_id: "test", password: "test1234" })
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res.status).to.equal(200)
                    expect(res.text).to.exist
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

    })

    describe("Route GET /me :", () => {

        it("Should allow acces with valid token", (done) => {
            chai.request(app).get("/me")
                .set("authorization", `Bearer ${token}`)
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res.status).to.equal(200)
                    expect(res.text).to.equal("test")
                    done()
                })
        })

        it("Should refuse acces without token", (done) => {
            chai.request(app).get("/me")
                .set("authorization", `Bearer `)
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res.status).to.equal(401)
                    expect(res.text).to.equal("Token not provided")
                    done()
                })
        })

        it("Should refuse acces with invalid token", (done) => {
            chai.request(app).get("/me")
                .set("authorization", `Bearer 123`)
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res.status).to.equal(401)
                    expect(res.text).to.equal("Invalid token")
                    done()
                })
        })

    })

    describe("Route GET /users :", () => {

        it("Should return all users with valid token", (done) => {
            chai.request(app).get("/users")
                .set("authorization", `Bearer ${token}`)
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res.status).to.equal(200)
                    expect(res.body).to.be.an("array")
                    expect(res.body.length).to.equal(2)
                    done()
                })
        })

        it("Should not return all users without token", (done) => {
            chai.request(app).get("/users")
                .set("authorization", `Bearer `)
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res.status).to.equal(401)
                    expect(res.text).to.equal("Token not provided")
                    done()
                })
        })

        it("Should not return all users with invalid token", (done) => {
            chai.request(app).get("/users")
                .set("authorization", `Bearer abc`)
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res.status).to.equal(401)
                    expect(res.text).to.equal("Invalid token")
                    done()
                })
        })

    })

    describe("Route PATCH /users/:username :", () => {

        it("Should update username with valid token", (done) => {
            chai.request(app).patch("/users/test1")
                .set("authorization", `Bearer ${token}`)
                .send({ username: "user1" })
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res.status).to.equal(200)
                    expect(res.body.username).to.equal("user1")
                    expect(res.body.email).to.equal("test1@gmail.com")
                    expect(res.body.visibility).to.equal("private")
                    expect(res.body.token).to.exist
                    done()
                })
        })

        it("Should update email with valid token", (done) => {
            chai.request(app).patch("/users/user1")
                .set("authorization", `Bearer ${token}`)
                .send({ email: "user1@gmail.com" })
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res.status).to.equal(200)
                    expect(res.body).to.deep.equal({ username: "user1",
                        email: "user1@gmail.com", visibility: "private" })
                    done()
                })
        })

        it("Should update password with valid token", (done) => {
            chai.request(app).patch("/users/user1")
                .set("authorization", `Bearer ${token}`)
                .send({ password: "11235813" })
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res.status).to.equal(200)
                    expect(res.body).to.deep.equal({ username: "user1",
                        email: "user1@gmail.com", visibility: "private" })
                    done()
                })
        })

        it("Should update visibility with valid token", (done) => {
            chai.request(app).patch("/users/user1")
                .set("authorization", `Bearer ${token}`)
                .send({ visibility: "public" })
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res.status).to.equal(200)
                    expect(res.body).to.deep.equal({ username: "user1",
                        email: "user1@gmail.com", visibility: "public" })
                    done()
                })
        })

        // Without token

        // Invalid token

        // Erreurs

    })

    describe("Route DELETE /users/:username :", () => {

        it("Should delete user with valid token", (done) => {
            chai.request(app).delete("/users/user1")
                .set("authorization", `Bearer ${token}`)
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res.status).to.equal(204)
                    expect(res.body).to.be.empty
                    done()
                })
        })

        it("Should not delete user without token", (done) => {
            chai.request(app).delete("/users/user1")
                .set("authorization", `Bearer `)
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res.status).to.equal(401)
                    expect(res.text).to.equal("Token not provided")
                    done()
                })
        })

        it("Should not delete user with invalid token", (done) => {
            chai.request(app).delete("/users/user1")
                .set("authorization", `Bearer 123`)
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res.status).to.equal(401)
                    expect(res.text).to.equal("Invalid token")
                    done()
                })
        })

        it("Should not delete user with invalid username", (done) => {
            chai.request(app).delete("/users/user2")
                .set("authorization", `Bearer ${token}`)
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res.status).to.equal(400)
                    expect(res.text).to.equal("User does not exist")
                    done()
                })
        })

    })

    // Routes characters

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

    after("Suppression of the test user", (done) => {
        chai.request(app).delete("/users/test")
            .set("authorization", `Bearer ${token}`)
            .end((err, res) => {
                expect(err).to.be.null
                expect(res.status).to.equal(204)
                done()
            })
    })

})