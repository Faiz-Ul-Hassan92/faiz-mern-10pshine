import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios"

const resetPassword = () => {  

    
    const [error, setError] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [passwordChanged, setPasswordChanged] = useState(false)

    const navigate = useNavigate()
    const { token } = useParams()

    const handlePasswordChanged = async () => {

        try {
            


            await axios.post(`/api/users/resetPassword/${token}`,
                {newPassword}
            )

            setPasswordChanged(true)
            
            setTimeout(() => {
                navigate('/login')
            }, 2000);
        }catch(err) {
                if(err.response) {
                    setError(err.response.data.message)
                } else {
                setError("System Error")
            }
        }
    }


    return (
    <div className="container mx-auto max-w-md mt-10 p-6 bg-white 
    rounded-lg shadow-md space-y-4">
        <h2 className="text-2xl font-semibold mb-6 text-center">
            Enter Password
        </h2>
        {error && <p className="text-red-500 mb-4 text-center">
            {error}
        </p>}

            <div>
                
                <input type="password" value={newPassword} onChange={(e) =>
                setNewPassword(e.target.value) } placeholder= "Password" 
                className="w-full px-3 py-2 border rounded-md
                outline-none focus:ring-2 focus:ring-blue-400"
                required 
                />
            </div>


            <button onClick={handlePasswordChanged} 
            className="w-full bg-green-500 text-white py-2 rounded-md
            hover:bg-green-700">Change Password</button>

        {passwordChanged   && (
            <>
                <p className="text-red-500 mt-4 text-center">
                Password Change Successful, Redirecting to login...
                </p>
            </>
        )

        }
 
    </div> 
    )
}

export default resetPassword