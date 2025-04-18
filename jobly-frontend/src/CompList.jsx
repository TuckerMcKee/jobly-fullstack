import React from "react";
import {useState, useEffect} from "react";
import CompCard from "./CompCard"
import JoblyApi from "./api";

const CompList = () => {
    const [companies,setCompanies] = useState([]);
    
    const INITIAL_STATE = {nameLike:''};
    
    const [formData,setFormData] = useState(INITIAL_STATE);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(formData => ({
           ...formData,
            [name]: value
        }))
    };
    
    const getCompsFilter = async () => {
        try {
            const c = await JoblyApi.getCompaniesByName(formData.nameLike);
            console.log(c)
            setCompanies(c);
        } catch (e) {
            console.log(e)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        getCompsFilter();
    }

    useEffect(() => {
        const getCompanies = async () => {
            try {
                const c = await JoblyApi.getCompanies();
                setCompanies(c);
            } catch (e) {
                console.log(e)
            }
        }
        getCompanies();
    },[]);

    return (
        <section>
            <form onSubmit={handleSubmit}>
                <input type='text' name='nameLike' value={formData.nameLike} onChange={handleChange} placeholder="search companies"/>
                <button type='submit'>Submit</button>
            </form>
            {companies.map(c => {
                return <CompCard key={c.handle} company={c}/>
            })}
        </section>
    )
}

export default CompList;