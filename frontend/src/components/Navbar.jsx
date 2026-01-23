import React from 'react'
import {Link, useNavigate,useLocation} from 'react-router-dom'
import {useState, useEffect} from "react"

const Navbar = ({user, setUser}) => {

    const [search, setSearch] = useState("")
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        if(!user || location.pathname !== '/') return
        
        const delay = setTimeout(() => {
            navigate(search.trim() ? 
        `/?search=${encodeURIComponent(search)}` : "/")
        }, 170)
        
        return () => clearTimeout(delay)
    }, [search, navigate, user, location.pathname])


    useEffect(() => {
        setSearch("")
    }, [user])


     return( 
     <nav className="bg-[#633ab5] p-2 text-white shadow-lg">
     <div className="container mx-auto flex items-center justify-between">
     <Link to="/">
     <img src="/10Pearls.svg" alt="10 Pearls" className="ml-4 h-18 w-18" />
     </Link>
     { user && (
        <>
        {
           location.pathname === '/' && (
            <div className="ml-108">
                <input type="text" value={search} onChange={(e) =>
                    setSearch(e.target.value)
                } placeholder='Search notes..'
                className="w-full px-8 py-2 bg-[#1d324f] text-white
                rounded-full outline-none
                focus:ring-2 focus:ring-blue-500" />
            </div>
           )
        }
        <div className="mr-4 flex items-center space-x-4">

            <Link to="/profile"
             className="flex flex-col items-center
            hover:opacity-80 transition-opacity" >
                
                <img src="/profile.svg" alt="Profile"
                className="h-12 w-12" />
                <span className="text-[#011229] font-medium">
                {user.username}</span>
                
            </Link>
        </div>
        </>
     )}
     </div>
     </nav>
    )
}

export default Navbar;