// import { expect } from "chai"
// import sinon from "sinon"

// import fonctions from "../index.js"


// describe("Tests pour les fonctions :", () => {

//     describe("addition() :", () => {
//         it("doit retourner la somme de deux nombres", () => {
//             expect(fonctions.addition(1, 2)).equal(3)
//             expect(fonctions.addition(2, 1)).equal(3)
//         })
//     })

//     describe("calculateTotal() :", () => {
//         it("doit retourner le prix total", () => {
//             expect(fonctions.calculateTotal(10, 2)).equal(22)
//             expect(fonctions.calculateTotal(10, 0)).equal(0)
//             expect(fonctions.calculateTotal(0, 2)).equal(0)
//         })
//         it("doit appeler la fonction calculateTax()", () => {
//             const spy = sinon.spy(fonctions, "calculateTax")
//             fonctions.calculateTotal(10, 2)
//             expect(spy.calledOnce).equal(true)
//             spy.restore()
//         })
//     })

// })