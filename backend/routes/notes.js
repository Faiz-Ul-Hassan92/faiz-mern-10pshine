import express from 'express';
import Note from '../models/note.js';
import { protect } from '../middleware/auth.js';


const router = express.Router();


//user notes to display 
router.get('/', protect, async (req, res) => {
    try {
        const notes = await Note.find({createdBy: req.user._id})
        res.status(200).json(notes)
    } catch(err) {
       console.error("Getting user notes error :", err)
       res.status(500). json({message: "Server error"})
    }
}) 



//create a node route
router.post("/", protect, async (req, res) => {
    const {title, description} = req.body

    try {   
        if(!title || !description) {
            return res.status(400).json({message: "Please fill all the fields"})
        }
        const note = await Note.create({
            title, description, createdBy: req.user._id
        })
        res.status(201).json(note)
    } catch(err) {
        res.status(500).json({message: "Server error"})
    }

})




//get a specific note
    //this is a dynamic parameter
router.get("/:id", protect, async(req, res) => {
    try {
        const note = await Note.findById(req.params.id)
        if(!note) {
            return res.status(404).json({message: "Note not found"})
        }

        res.status(200).json(note)
    }catch (err) {
        res.status(500).json({message: "Server error"})
    }
})




//update a note
router.put("/:id", protect, async (req, res) => {

    const { title, description} = req.body
    try {
        const note = await Note.findById(req.params.id)
        if(!note) {
            return res.status(404).json({message: "Note not found"})
        }

        if(note.createdBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({message: "Not Authorized"})
        }

        note.title = title || note.title
        note.description = description || note.description

        const updatedNote = await note.save();
        res.json(updatedNote)


    }catch (err) {
        res.status(500).json({message: "Server error"})
    }
})


//Delete note route

router.delete("/:id", protect, async (req, res) => {
    try {
        const note = await Note.findById(req.params.id)
        if(!note) {
            return res.status(404).json({message: "Note not found"})
        }

        if(note.createdBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({message: "Not Authorized"})
        }

        await note.deleteOne()
        res.json({message: "Note deleted"})
    } catch (err) {
        res.status(500).json({message: "Server error"})
    }
})


export default router;