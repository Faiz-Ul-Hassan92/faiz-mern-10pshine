import axios from 'axios';
import app from '../app.js';
import { expect } from 'chai';
import User from "../models/user.js"

let BaseURL = `http://localhost:${process.env.TEST_PORT}`

const registerFunction = async function() {
    return await axios.post(`${BaseURL}/api/users/register`, {
            username: "dummy",
            email: "i220818@nu.edu.pk",
            password: "testing"
        })
}

describe("User route testing", function() {
    let server
    



    before(function() {
        server = app.listen(process.env.TEST_PORT)
    })

    beforeEach(async function() {
        await User.deleteMany({})
    })

    after(function() {
        server.close()
    })

    it("Should register a user", async function() {
        const res = await registerFunction()

        expect(res.status).to.equal(201)
        expect(res.data).to.have.property("token")
        expect(res.data.email).to.equal("i220818@nu.edu.pk")
        expect(res.data.username).to.equal("dummy")
    })

    it("Should not let same email register again", async function() {
        await registerFunction()

        try {
            await registerFunction()
        } catch(err) {
         expect(err.response.status).to.equal(400)
         expect(err.response.data.message).to.equal("User already exists")
        }


    })


    it("Should let a simple login pass", async function() {
        await registerFunction()

        const res = await axios.post(`${BaseURL}/api/users/login`, {
            email:"i220818@nu.edu.pk",
            password:"testing"
        })

        expect(res.status).to.equal(200)
        expect(res.data).to.have.property("token")
    })


})