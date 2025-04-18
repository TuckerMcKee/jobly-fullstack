import React from "react";
import AuthContext from "./AuthContext";
import { useContext } from "react";

const Home = () => {
    const user = useContext(AuthContext);
    if (!user) return (
        <h1>Jobly</h1>
    ) 
    else return (
        <h1>Welcome, {user.firstName}</h1>
    )
}

export default Home;