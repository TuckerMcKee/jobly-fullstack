import { useContext } from "react";
import { Navigate, Outlet } from "react-router";
import AuthContext from "./AuthContext";

const AuthRoute = () => {
    const user = useContext(AuthContext);
    if (!user) return <Navigate to='/'/>
    else return <Outlet />
}

export default AuthRoute;