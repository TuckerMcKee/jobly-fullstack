import React from "react";
import { useContext,useState } from "react";
import AuthContext from "./AuthContext";

const UserProfile = ({updateUser}) => {
    const user = useContext(AuthContext);
    const {password,firstName,lastName,email} = user;
    const INITIAL_FORM_DATA = {password,firstName,lastName,email};

    const [formData,setFormData] = useState(INITIAL_FORM_DATA);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(formData => ({
           ...formData,
            [name]: value
        }))
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateUser(user.username,formData);
    }
    return (
        <>
        <h1>{user.username}</h1>
        <form onSubmit={handleSubmit}>
            <input type='text' placeholder='password' name='password' value={formData.password} 
            onChange={handleChange}/>
            <input type='text' placeholder='firstName' name='firstName' value={formData.firstName} 
            onChange={handleChange}/>
            <input type='text' placeholder='lastName' name='lastName' value={formData.lastName} 
            onChange={handleChange}/>
            <input type='text' placeholder='email' name='email' value={formData.email} 
            onChange={handleChange}/>
            <button type='submit'>Save Changes</button>
        </form>
        </>
    ) 
}

export default UserProfile;