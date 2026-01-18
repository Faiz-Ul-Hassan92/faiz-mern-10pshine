import React, { useState } from "react";
import axios from "axios";


const forgotPassword = () => { 

    const [email, setEmail] =  useState("")
    const [error, setError] = useState('')
    const [emailSent, setEmaiSent] = useState(false)

    const handleEmailSent = async () => {

        setError("")

        if(!emailSent) {
            try {
                await axios.post("/api/users/forgetPassword", {email})
                setEmaiSent(true)
            } catch(err) {
                if(err.response) {
                    setError(err.response.data.message)
                } else {
                setError("System Error")}
            }
        }
    }


    return (
    <div className="container mx-auto max-w-md mt-10 p-6 bg-white 
    rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">
            Change Password
        </h2>
        {error && <p className="text-red-500 mb-4 text-center">
            {error}
        </p>}

        
            <div className="space-y-4 mb-4">
                <input type="email" value={email} onChange={(e) =>
                 !emailSent && setEmail(e.target.value) } placeholder= "Email" 
                className="w-full px-3 py-2 border rounded-md
                outline-none focus:ring-2 focus:ring-blue-400"
                required 
                />
            </div>


            <button onClick={handleEmailSent} className="w-full bg-green-500 text-white py-2 rounded-md
            hover:bg-green-700">Send Email</button>
 
        {emailSent   && (
            <>
                <p className="text-red-500 mt-4 text-center">
                 Check your Inbox
                </p>
            </>
        )

        }
    </div> 
    )
}

export default forgotPassword 