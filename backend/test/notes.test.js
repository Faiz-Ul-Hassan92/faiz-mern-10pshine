import axios from 'axios';
import app from '../app.js';
import { expect } from 'chai';
import Note from '../models/note.js';
import User from '../models/user.js';
import mongoose from 'mongoose';

let BaseURL = `http://localhost:${process.env.TEST_PORT}`

const registerFunction = async function() {
    return await axios.post(`${BaseURL}/api/users/register`, {
            username: "dummy",
            email: "i220818@nu.edu.pk",
            password: "testing"
        })
}

const createNote = async function(title, description, token) {
    return axios.post(`${BaseURL}/api/notes/`,
        {title,description},
        {headers: {Authorization: `Bearer ${token}`}}
    )
}




describe("Testing note CRUD operations", function() {
    let server
    let token

    before(async function() {
        await User.deleteMany({})
        await Note.deleteMany({})
        server = app.listen(process.env.TEST_PORT)
        const user = await registerFunction()
        token = user.data.token
    })

    beforeEach(async function() {
        await Note.deleteMany({})
    })

    after(function() {
        server.close()
    })


    it("Should fetch an empty string", async function() {
        const res = await axios.get(`${BaseURL}/api/notes/`, 
            {headers: {Authorization: `Bearer ${token}`}}
        )

        expect(res.data).to.be.an("array")
        expect(res.data).to.have.length(0)

    })

    it("Should create a note", async function() {
        const noteRes = await createNote("Haha", "No way", token)
        expect(noteRes.status).to.equal(201)
        expect(noteRes.data.title).to.equal("Haha")
        expect(noteRes.data.description).to.equal("No way")
    })


    it("Should fetch a note", async function() {
        await createNote("Haha", "No way", token)
        const res = await axios.get(`${BaseURL}/api/notes/`, 
            {headers: {Authorization: `Bearer ${token}`}}
        )

        expect(res.data).to.be.an("array")
        expect(res.data).to.have.length(1)
        expect(res.data[0].title).to.equal("Haha")

    })


    it("Should delete the note", async function() {

        const note = await createNote("deleteMe", "okay i will", token)

        const res = await axios.delete(`${BaseURL}/api/notes/${note.data._id}`, 
            {headers: {Authorization: `Bearer ${token}`}}
        )

        expect(res.data.message).to.equal("Note deleted")
    })



    


})


