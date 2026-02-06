import React from "react"
import axios from "axios"
import { useState, useEffect } from "react"
import NoteModal from "./NoteModel"
import { useLocation } from "react-router-dom"

const Home = () => {
    const [notes, setNotes] = useState([])
    const [error, setError] =  useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editNote, setEditNote] = useState(null)
    const location = useLocation()


    const handleEdit = (note) => {
        setEditNote(note)
        setIsModalOpen(true)
    }

    const fetchNotes = async() => {
        try {
            const token = localStorage.getItem("token")
            if(!token) {
                setError("No authentication token found, Please log in")
                return
            }

            const searchParams = new URLSearchParams(location.search)
            const search = searchParams.get("search") || ""

            const {data} = await axios.get("/api/notes", {
                headers: {Authorization: `Bearer ${token}`}
            })


            const filteredNotes = search ? data.filter((note) => 
            note.title.toLowerCase().includes(search.toLowerCase()) 
            || note.description.toLowerCase().includes(search.toLowerCase())
            ) : data

            setNotes(filteredNotes)

            console.log(data)
        } catch(err) {
            setError(err.response?.data?.message || "Failed to fetch Notes")
            console.error("Error fetching notes:", err)
        }
    }


    const handleSaveNote =(newNote) => {
        if(editNote) {
            setNotes(notes.map((note)=> note._id === newNote._id ? newNote : note))
        } else {
            setNotes([...notes, newNote])
        }


        setEditNote(null)
        setIsModalOpen(false)
    }

    useEffect(() => {
        fetchNotes()
    }, [location.search])

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token")
            if(!token) {
                setError("Not Authorized, token not found. Please log in")
                return
            }
            await axios.delete(`/api/notes/${id}`, {
                headers: {Authorization: `Bearer ${token}`}
            })

            //have to update frontend too
            setNotes(notes.filter((note) => note._id !== id))
        } catch(err) {
            setError("Failed to delete note")
        }
    }


    return (<div className="container mx-auto px-4 py-8 min-h-screen
    bg-[#011229]">
        {error && <p className="text-red-400 mb-4">{error}</p>}
        <NoteModal isOpen={isModalOpen} onClose={() => {
            setIsModalOpen(false)
            setEditNote(null)
           }
        }

        note={editNote}
        onSave={handleSaveNote}
        />
        <button onClick={() => setIsModalOpen(true)} className="fixed bottom-6 right-6 w-14 h-14 
        bg-gray-800 text-white text-3xl rounded-full shadow-lg 
        hover:bg-gray-900 flex items-center justify-center">
            <span className="flex items-center justify-center h-full
            w-full pb-1">+</span>
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2
        gap-4">
            {notes.map((note) =>( 
                <div className="bg-[#1d324f] p-4 rounded-lg shadow-md flex flex-col h-[200px]" 
                key={note._id}>
                    <h3 className="text-lg font-md text-white font-bold mb-2">{note.title}</h3>
                    <div 
                    className="text-white mb-4 prose prose-invert max-w-none overflow-hidden flex-grow"
                    dangerouslySetInnerHTML={{__html: note.description}}
                    />

                    <div className="flex items-baseline space-x-2">
                    <button onClick={() => handleEdit(note)} className="bg-yellow-600 text-white
                    px-3 py-1 rounded-md hover:bg-yellow-700">Edit</button>
                    <button onClick={() => handleDelete(note._id)} className="bg-red-600 text-white
                    px-3 py-1 rounded-lg hover:bg-red-700">Delete</button>
                    <p className="text-sm text-white ml-auto">{new Date(note.updatedAt).toLocaleString()}
                    </p>
                    </div>
                </div>)
                )
                }
                </div>
                </div>
                )
}


export default Home