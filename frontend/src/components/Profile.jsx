import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = ({ user, setUser}) =>  {
    
    const [error, setError] = useState("")
    const [changePassword, setChangePassword] = useState(false)
    const [password, setPassword] = useState("")

    const navigate = useNavigate()

    const handleSave = async() => {

        try {
            const token = localStorage.getItem("token")
            axios.put("/api/users/changingPassword",
                { password },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setPassword("")
            setChangePassword(false)
        }catch(err) {
            setError("Failed to change password.")
        }
    }


    const handleLogout = () => {
        localStorage.removeItem("token")
        setUser(null)
        navigate('/login')
    }

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen
        bg-[#011229]">
            {error && <p className="text-red-400 mb-4">{error}</p>}
            <button onClick={handleLogout} 
            className="fixed bottom-6 right-6
            bg-red-600 text-white 
            px-6 py-2 rounded-full hover:bg-red-800 shadow-lg 
             flex items-center justify-center">
            <span className="flex items-center justify-center h-full
            w-full pb-1">Logout</span>
            </button>

            <div className="max-w-md mx-auto mt-8 bg-gray-800 rounded-lg shadow-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Profile</h2>
            
            <div className="space-y-4 relative pb-16">
                <div>
                <label className="block text-gray-400 text-sm mb-1">Username</label>
                <p className="text-white text-lg">{user.username}</p>
                </div>
                
                <div>
                <label className="block text-gray-400 text-sm mb-1">Email</label>
                <p className="text-white text-lg">{user.email}</p>
                </div>
                
                <div>
                <label className="block text-gray-400 text-sm mb-1">Password</label>
                <p className="text-white text-lg">••••••••</p>
                </div>

                {!changePassword && (
                    <>
                <button onClick={() => 
                    setChangePassword(true)
                }
                 className="absolute right-4 bottom-4 bg-green-600
                text-white px-4 py-2 rounded-md hover:bg-green-800">
                    Change Password
                </button></>
                )}

                {changePassword && (
                    <>
                    <div>
                        <input type="text" value={password}
                        onChange={(e) => 
                            setPassword(e.target.value)
                        }
                        className="px-3 mt-3 w-full py-2 border rounded-md
                        outline-none text-white focus:ring-2 
                        focus:ring-blue-400 bg-gray-500"
                        placeholder="New Password..."
                          />
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleSave} className="flex-1 bg-blue-600 text-white
                        px-4 py-2 rounded-md hover:bg-blue-700">Save</button>
                        <button onClick={()=> setChangePassword(false)} className="flex-1 bg-gray-600 text-white
                        px-4 py-2 rounded-md hover:bg-gray-700">Cancel</button>
                    </div>
                    </>
                )}
            </div>
            </div>
            
        </div>
    )
}


export default Profile