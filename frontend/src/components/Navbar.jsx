import React from 'react'
import {Link} from 'react-router-dom'

const Navbar = ({user}) => {
     return( 
     <nav className="bg-gray-900 p-4 text-white shadow-lg">
     <div className="container mx-auto flex items-center justify-between">
     <Link to="/">Notes App
     </Link>
     { user && (
        <>
        <div>
            <span>{user.username}</span>
            <button>Logout</button>
        </div>
        </>
     )}
     </div>
     </nav>
    )
}

export default Navbar;