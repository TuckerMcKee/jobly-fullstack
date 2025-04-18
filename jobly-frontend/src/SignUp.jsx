import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";

const SignUp = ({signup}) => {
    const INITIAL_FORM_DATA = {username:'',password:'',firstName:'',lastName:'',email:''};

    const [formData,setFormData] = useState(INITIAL_FORM_DATA);

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
        for (let val of Object.values(formData)) {
            if (!val) {
                alert('All fields required');
                return
            }
        }
        signup(formData);
        navigate('/');
    }
    return (
        <>
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit}>
            <input type='text' placeholder='username' name='username' value={formData.username} 
            onChange={handleChange}/>
            <input type='text' placeholder='password' name='password' value={formData.password} 
            onChange={handleChange}/>
            <input type='text' placeholder='firstName' name='firstName' value={formData.firstName} 
            onChange={handleChange}/>
            <input type='text' placeholder='lastName' name='lastName' value={formData.lastName} 
            onChange={handleChange}/>
            <input type='text' placeholder='email' name='email' value={formData.email} 
            onChange={handleChange}/>
            <button type='submit'>Submit</button>
        </form>
        </>
    ) 
}

export default SignUp;