import Navbar from "./components/Navbar.jsx"
import {useState, useEffect} from "react"
import {Routes, Route, Navigate} from "react-router-dom"
import Login from "./components/Login.jsx"
import Register from "./components/Register.jsx"
import Home from "./components/Home.jsx"
import axios from "axios"

function App() {
  const [user, setUser] = useState(null)


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
      }
    }
    fetchUser()
  }, [])

  return (
    <div className="min-h-screen bg-gray-500">
      <Navbar user = {user}/>
      <Routes>
        <Route path="/login" 
        element={user ? <Navigate to ="/" /> : <Login setUser={setUser}/> } />
        <Route path="/register" 
        element={ user ? <Navigate to= "/" /> : <Register setUser={setUser}/>} />
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" /> } />
      </Routes>
      </div>
  )
}

export default App
