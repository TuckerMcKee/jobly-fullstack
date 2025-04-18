import { NavLink } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "./AuthContext";

const NavBar = ({logout}) => {

    const user = useContext(AuthContext);
    // console.log(Object.keys(user))
    if (user) return (
        <nav>
            <span>{user.username}</span>
            <NavLink to='/'>Home</NavLink>
            <NavLink to='/jobs'>Jobs</NavLink>
            <NavLink to='/companies'>Companies</NavLink>
            <NavLink to='/profile'>Profile</NavLink>
            <NavLink onClick={logout}>Logout</NavLink>
        </nav>
    )
    else return (
        <nav>
            <NavLink to='/'>Home</NavLink>
            <NavLink to='/login'>Login</NavLink>
            <NavLink to='/signup'>Sign Up</NavLink>
        </nav>
    )
}

export default NavBar;