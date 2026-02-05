import React from 'react';
import {useState, useEffect} from "react"
import axios from "axios"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'

const NoteModel = ({isOpen, onClose, note, onSave}) => {

    const [title, setTitle] = useState('')
    const [error, setError] = useState("")
    const [, setEditorUpdate] = useState(0)

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: {
                    HTMLAttributes: {
                        class: 'list-disc ml-4',
                    },
                },
                orderedList: {
                    HTMLAttributes: {
                        class: 'list-decimal ml-4',
                    },
                },
            }),
            Underline,
            TextStyle,
            Color
        ],
        content: '',
        editorProps: {
            attributes: {
                class: 'prose prose-sm focus:outline-none min-h-[200px] p-3',
            },
        },
        onUpdate: () => {
            setEditorUpdate(prev => prev + 1)
        },
        onSelectionUpdate: () => {
            setEditorUpdate(prev => prev + 1)
        }
    })

    useEffect(() => {
        setTitle(note ? note.title : "")
        if (editor && note?.description) {
            editor.commands.setContent(note.description)
        } else if (editor) {
            editor.commands.setContent('')
        }
        setError("")
    }, [note, editor])


    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!editor) return

        try {
            const token = localStorage.getItem("token")
            if(!token) {
                setError("No Authentication token found. Please log in")
                return 
            }

            const description = editor.getHTML()

            const payload = {title, description}
            const config = {headers:{ Authorization: `Bearer ${token}`}}
            
            if(note) {
                const {data} = await axios.put(`/api/notes/${note._id}`,
                    payload, config)
                onSave(data)
            } else {
                const {data} = await axios.post("/api/notes", payload, config)
                onSave(data)
            }
            
            setTitle("")
            editor.commands.clearContent()
            setError("")
            onClose()
        } catch(err) {
            console.log("Note save error", err)
            setError("Failed to save note")
        }
    }


    if(!isOpen) return null

    return(
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[80vh]">
                <h2 className="text-2xl font-semibold text-white mb-4">
                    {note ? "Edit Note" : "Create Note"}
                </h2>
                {error && <p className="text-red-400 mb-4">{error}</p>}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input 
                            type="text" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            placeholder='Enter Title'
                            className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 
                            rounded-full outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>


                    {editor && (
                        <div className="bg-gray-700 p-2 rounded-lg flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    editor.chain().focus().toggleBold().run()
                                    setEditorUpdate(prev => prev + 1)
                                }}
                                className={`px-3 py-1 rounded transition-colors ${
                                    editor.isActive('bold') ? 'bg-[#7d4dd3]' : 'bg-gray-600'
                                } text-white hover:bg-[#7d4dd3]`}
                            >
                                <strong>B</strong>
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    editor.chain().focus().toggleItalic().run()
                                    setEditorUpdate(prev => prev + 1)
                                }}
                                className={`px-3 py-1 rounded transition-colors ${
                                    editor.isActive('italic') ? 'bg-[#7d4dd3]' : 'bg-gray-600'
                                } text-white hover:bg-[#7d4dd3]`}
                            >
                                <em>I</em>
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    editor.chain().focus().toggleUnderline().run()
                                    setEditorUpdate(prev => prev + 1)
                                }}
                                className={`px-3 py-1 rounded transition-colors ${
                                    editor.isActive('underline') ? 'bg-[#7d4dd3]' : 'bg-gray-600'
                                } text-white hover:bg-[#7d4dd3]`}
                            >
                                <u>U</u>
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    editor.chain().focus().toggleStrike().run()
                                    setEditorUpdate(prev => prev + 1)
                                }}
                                className={`px-3 py-1 rounded transition-colors ${
                                    editor.isActive('strike') ? 'bg-[#7d4dd3]' : 'bg-gray-600'
                                } text-white hover:bg-[#7d4dd3]`}
                            >
                                <s>S</s>
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    editor.chain().focus().toggleBulletList().run()
                                    setEditorUpdate(prev => prev + 1)
                                }}
                                className={`px-3 py-1 rounded transition-colors ${
                                    editor.isActive('bulletList') ? 'bg-[#7d4dd3]' : 'bg-gray-600'
                                } text-white hover:bg-[#7d4dd3]`}
                            >
                                • List
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    editor.chain().focus().toggleOrderedList().run()
                                    setEditorUpdate(prev => prev + 1)
                                }}
                                className={`px-3 py-1 rounded transition-colors ${
                                    editor.isActive('orderedList') ? 'bg-[#633ab5]' : 'bg-gray-600'
                                } text-white hover:bg-[#7d4dd3]`}
                            >
                                1. List
                            </button>
                        </div>
                    )}
                    
                    
                    <div className=" bg-gray-900 rounded-lg text-white border-2 border-gray-600 min-h-[200px] max-h-[200px] overflow-y-auto">
                        <EditorContent editor={editor} />
                    </div>
                    
                    <div className="flex space-x-2">
                        <button 
                            type="submit" 
                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                        >
                            {note ? "Update": "Create"}
                        </button>
                        <button 
                            onClick={onClose} 
                            type="button" 
                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-800"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default NoteModel