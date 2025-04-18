import { useState, useEffect} from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import JoblyApi from './api'
import './App.css'
import JobList from './JobList'
import CompList from './CompList'
import CompDetail from './CompDetail'
import Login from './Login'
import SignUp from './SignUp'
import UserProfile from './UserProfile'
import Home from './Home'
import NavBar from './NavBar'
import AuthContext from './AuthContext'
import AuthRoute from './AuthRoute'
import { jwtDecode } from "jwt-decode";


const getUserData = async (token) => {
  try {
    const decoded = jwtDecode(token);
    const user = await JoblyApi.getUser(decoded.username);
    return user
  } catch (e) {
    // console.log(e)
  }
  
}

function App() {
  const [user,setUser] = useState(null);
  const [token,setToken] = useState(null);

  const login = async (username,password) => {
    try {
      const token = await JoblyApi.userLogin(username,password);
      console.log(token)
      JoblyApi.token = token;
      localStorage.setItem('token',token)
      setToken(token);
      setUser(await getUserData(token));
    } catch (e) {
      // console.log(e)
    }
  }
  
  const signUp = async ({username,password,firstName,lastName,email}) => {
    try {
      const token = await JoblyApi.userSignUp(username,password,firstName,lastName,email);
      JoblyApi.token = token;
      localStorage.setItem('token',token)
      setToken(token);
      setUser(await getUserData(token));
    } catch (e) {
      // console.log(e)
    }
  }

  const updateUser = async (username,data) => {
    try {
      setUser(await JoblyApi.patchUser(username,data));
    } catch (e) {
      // console.log(e)
    }
  }

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setUser(await getUserData(token));
      } catch (e) {
        console.log(e)
      }
    }
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      JoblyApi.token = storedToken;
      setToken(storedToken);
      fetchUser();
    }
  },[token]);

  return (
    <>
    <BrowserRouter>
    <AuthContext.Provider value={user}>
    <NavBar logout={logout}/>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route element={<AuthRoute />}>
          <Route path='/companies' element={<CompList />}/>
          <Route path='/companies/:handle' element={<CompDetail />}/>
          <Route path='/jobs' element={<JobList />}/>
          <Route path='/profile' element={<UserProfile updateUser={updateUser}/>}/>
        </Route>
        <Route path='/login' element={<Login login={login}/>}/>
        <Route path='/signup' element={<SignUp signup={signUp}/>}/>
      </Routes>
      </AuthContext.Provider>
    </BrowserRouter>
    </>
  )
}

export default App
