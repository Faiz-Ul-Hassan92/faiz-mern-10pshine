import Navbar from "./components/Navbar.jsx"
import {useState, useEffect} from "react"
import {Routes, Route, Navigate} from "react-router-dom"
import Login from "./components/Login.jsx"
import Register from "./components/Register.jsx"
import Home from "./components/Home.jsx"
import axios from "axios"
import Profile from "./components/Profile.jsx"
import ForgotPassword from "./components/forgotPassword.jsx"

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect( () => {
    const fetchUser =  async () => {
      try {
        const token = localStorage.getItem("token")
        if(!token) return
        const {data} = await axios.get("/api/users/profile", {
          headers: {Authorization: `Bearer ${token}`}
        })
        setUser(data)
      }catch (err) {
        localStorage.removeItem("token")
      } finally{
        setLoading(false) //unltil the user is loaded, I am displaying loading screen
      }
    }
    fetchUser()
  }, [])


  if(loading) {
    return (
      <div className="min-h-screen bg-[#1d324f] flex items-center
      justify-center" >
        <div className="text-xl text-white">
          Loading...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1d324f]">
      <Navbar user = {user} setUser={setUser}/>
      <Routes>
        <Route path="/login" 
        element={user ? <Navigate to ="/" /> : <Login setUser={setUser}/> } />
        <Route path="/register" 
        element={ user ? <Navigate to= "/" /> : <Register setUser={setUser}/>} />
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" /> } />
        <Route path="/profile" element={user ? <Profile user={user} setUser={setUser}/> : <Navigate to="/login" /> } />
        <Route path="/forgotPassword" element={ <ForgotPassword /> } />
      </Routes>
      </div>
  )
}

export default App
