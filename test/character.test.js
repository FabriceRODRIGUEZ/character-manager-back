// import chai from "chai"
// import chaiHttp from "chai-http"

// import Server from "../src/server.js"


// describe("Characters routes :", function() {

//     // Don't work with () => {}
//     this.timeout(5000)
//     chai.use(chaiHttp)
//     const expect = chai.expect
//     const server = new Server()
//     const app = server.app
//     let token
//     let id


//     before("Creation of the test user", (done) => {
//         chai.request(app).post("/signup")
//             .send({ username : "test", email: "test@gmail.com",
//                 password: "test1234", visibility: "private" })
//             .end((err, res) => {
//                 expect(err).to.be.null
//                 expect(res.status).to.equal(201)
//                 expect(res.body).to.deep.equal({ username: "test",
//                     email: "test@gmail.com", visibility: "private" })
//                 done()
//             })
//     })


//     before("Connexion of the test user", (done) => {
//         chai.request(app).post("/login")
//             .send({ user_id : "test", password: "test1234" })
//             .end((err, res) => {
//                 expect(err).to.be.null
//                 expect(res.status).to.equal(200)
//                 expect(res.text).to.exist
//                 token = res.text
//                 done()
//             })
//     })


//     describe("Route POST /characters :", () => {

//         it("Should create character with valid fields", (done) => {
//             chai.request(app).post("/characters")
//                 .set("authorization", `Bearer ${token}`)
//                 .send({ first_name : "(prénom)", last_name : "", gender : "M",
//                     work : "(titre)", actor : "", voice_actor : "",
//                     profile : "", comment : "", appreciation : "1" })
//                 .end((err, res) => {
//                     expect(err).to.be.null
//                     expect(res.status).to.equal(201)
//                     expect(res.body).to.be.an("object")
//                     done()
//                 })
//         })

//     })


//     describe("Route GET /characters :", () => {

//         it("Should return all characters with valid token", (done) => {
//             chai.request(app).get("/characters")
//                 .set("authorization", `Bearer ${token}`)
//                 .end((err, res) => {
//                     expect(err).to.be.null
//                     expect(res.status).to.equal(200)
//                     expect(res.body).to.be.an("array")
//                     expect(res.body.length).to.equal(1)
//                     id = res.body[0].id
//                     done()
//                 })
//         })

//     })


//     describe("Route GET /characters/:id :", () => {

//         it("Should return character with valid id", (done) => {
//             chai.request(app).get(`/characters/${id}`)
//                 .set("authorization", `Bearer ${token}`)
//                 .end((err, res) => {
//                     expect(err).to.be.null
//                     expect(res.status).to.equal(200)
//                     expect(res.body).to.be.an("object")
//                     expect(res.body.id).to.equal(id)
//                     done()
//                 })
//         })

//     })


//     describe("Route PATCH /characters/:id :", () => {

//         it("Should update character with valid id and fields", (done) => {
//             chai.request(app).patch(`/characters/${id}`)
//                 .set("authorization", `Bearer ${token}`)
//                 .send({ first_name : "(prénom)", last_name : "(nom)", gender : "F",
//                     work : "(titre)", actor : "(actrice)", voice_actor : "(doubleuse)",
//                     profile : "", comment : "(comment)", appreciation : "2" })
//                 .end((err, res) => {
//                     expect(err).to.be.null
//                     expect(res.status).to.equal(200)
//                     expect(res.body).to.be.an("object")
//                     done()
//                 })
//         })

//     })


//     describe("Route DELETE /characters/:id :", () => {

//         it("Should delete character with valid id", (done) => {
//             chai.request(app).delete(`/characters/${id}`)
//                 .set("authorization", `Bearer ${token}`)
//                 .end((err, res) => {
//                     expect(err).to.be.null
//                     expect(res.status).to.equal(204)
//                     expect(res.body).to.be.empty
//                     done()
//                 })
//         })

//     })


//     after("Suppression of the test user", (done) => {
//         chai.request(app).delete("/users")
//             .set("authorization", `Bearer ${token}`)
//             .end((err, res) => {
//                 expect(err).to.be.null
//                 expect(res.status).to.equal(204)
//                 done()
//             })
//     })

// })