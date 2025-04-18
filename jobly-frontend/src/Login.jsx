// import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";

const Login = ({login}) => {
    const [formData,setFormData] = useState({username:'',password:''});

    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(formData => ({
           ...formData,
            [name]: value
        }))
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.username && formData.password) {
            login(formData.username,formData.password);
            navigate('/')
        }

        else alert('username and password required')
    }
    return (
        <>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
            <input type='text' placeholder='username' name='username' value={formData.username} 
            onChange={handleChange}/>
            <input type='text' placeholder='password' name='password' value={formData.password} 
            onChange={handleChange}/>
            <button type='submit'>Submit</button>
        </form>
        </>
    ) 
}

export default Login;