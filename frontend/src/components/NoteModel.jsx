import React from 'react';
import {useState, useEffect} from "react"
import axios from "axios"


//this NoteModal will function for both editing an already
//  made note and creating a new note 
const NoteModel = ({isOpen, onClose, note, onSave}) => {

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [error, setError] = useState("")

    useEffect(() => {
        setTitle(note ? note.title : "")
        setDescription(note? note.description : "")
        setError("")
    }, [note])


    const handleSubmit= async (e) => {
        e.preventDefault()

        try {

            const token = localStorage.getItem("token")
            if(!token) {
                setError("No Authentication token found. Please log in")
                return 
            }

            const payload = {title, description}
            const config = {headers:{ Authorization: `Bearer ${token}`}}
            if(note) {
                const {data} = await axios.put(`/api/notes/${note._id}`,
                    payload, config)
                    onSave(data)

            }else {
                const {data} = await axios.post("/api/notes",payload
                    ,config
                )
                onSave(data)
            }
            setTitle("")
            setDescription("")
            setError("")
            onClose()
        }catch(err) {
            console.log("Note save error")
            setError("Failed to save error")
        }
    }


    if(!isOpen) return null

    return(
        <div className="fixed inset-0 bg-black/30
        flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl
            w-full max-w-md"> 
                <h2 className="text-2xl font-semibld text-white mb-4">
                {note ? "Edit Note" : "Create Note"}
                </h2>
                {error && <p className="text-red-400 mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4 ">
                    <div>
                        <input type="text" value={title} 
                        onChange={(e) => {
                            setTitle(e.target.value)
                        }} placeholder='Enter Title'
                        className="w-full px-3 py-2 bg-gray-700
                        text-white border border-gray-600 
                        rounded-full outline-none focus:ring-2
                        focus:ring-blue-500"
                        required
                        />
                    </div>
                    <div>
                        <textarea type="text" 
                        value={description} 
                        onChange={(e) => {
                            setDescription(e.target.value)
                        }} placeholder='Description ... '
                        className="w-full px-3 py-2 bg-gray-700
                        text-white border border-gray-600 
                        rounded-lg outline-none focus:ring-2
                        focus:ring-blue-500"
                        rows={4}
                        required
                        />
                    </div>
                    <div className="flex space-x-2">
                        <button type="submit" 
                        className="bg-green-600 text-white
                        px-4 py-2
                        rounded-md hover:bg-green-700">
                        {note ? "Update": "Create"}
                        </button>
                        <button onClick={() => {
                            onClose()
                        }} 
                        type="button" 
                        className="bg-red-600 text-white
                        px-4 py-2
                        rounded-md hover:bg-red-800">
                        Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}


export default NoteModel