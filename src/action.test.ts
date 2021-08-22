import rewire from "rewire"
const action = rewire("./action")
const typeCast = action.__get__("typeCast")
// @ponicode
describe("typeCast", () => {
    test("0", () => {
        let callFunction: any = () => {
            typeCast(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})
