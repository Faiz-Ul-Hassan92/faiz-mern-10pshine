import React from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {useState, useEffect} from "react"

const Navbar = ({user, setUser}) => {
    const [search, setSearch] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        if(!user) return
        
        const delay = setTimeout(() => {
            navigate(search.trim() ? 
        `/?search=${encodeURIComponent(search)}` : "/")
        }, 170)
        
        return () => clearTimeout(delay)
    }, [search, navigate, user])


    useEffect(() => {
        setSearch("")
    }, [user])

    const handleLogout = () => {
        localStorage.removeItem("token")
        setUser(null)
        navigate('/login')
    }


     return( 
     <nav className="bg-gray-900 p-5 text-white shadow-lg">
     <div className="container mx-auto flex items-center justify-between">
     <Link to="/">
     <img src="../../public/10Pearls.svg" alt="10 Pearls" className="h-16 w-16" />
     </Link>
     { user && (
        <>
        <div  >
            <input type="text" value={search} onChange={(e) =>
                setSearch(e.target.value)
            } placeholder='Search notes..'
            className="w-full px-8 py-2 bg-gray-700 text-white
             rounded-full outline-none
            focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex items-center space-x-4">
            <span className="text-gray-300 font-medium">
                {user.username}</span>
            <button onClick={handleLogout} 
            className="bg-red-600 text-white 
            px-3 py-1 rounded-md hover:bg-red-700">
                Logout</button>
        </div>
        </>
     )}
     </div>
     </nav>
    )
}

export default Navbar;