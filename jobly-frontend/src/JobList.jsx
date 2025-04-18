import React from "react";
import {useState, useEffect} from "react";
import JobCard from "./JobCard"
import JoblyApi from "./api";
import AuthContext from "./AuthContext";




const JobList = () => {
    const [jobs,setJobs] = useState([]);
    const INITIAL_STATE = {titleLike:''};
    const [formData,setFormData] = useState(INITIAL_STATE);
    // const user = useContext(AuthContext);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(formData => ({
           ...formData,
            [name]: value
        }))
    };
    const getJobsFilter = async () => {
        try {
            const j = await JoblyApi.getJobsByTitle(formData.titleLike);
            console.log(j)
            setJobs(j);
        } catch (e) {
            console.log(e)
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        getJobsFilter();
    }

    useEffect(() => {
        const getJobs = async () => {
            try {
                const jobs = await JoblyApi.getJobs();
                setJobs(jobs);
            } catch (e) {
                console.log(e)
            }
        }
        getJobs();
    },[])

    return (
        <section>
            <form onSubmit={handleSubmit}>
                <input type='text' name='titleLike' value={formData.titleLike} onChange={handleChange} placeholder="search jobs"/>
                <button type='submit'>Submit</button>
            </form>
            {jobs.map(j => {
                return<JobCard key={j.title + j.companyHandle + j.salary + j.equity} job={j}/>
            })}
        </section>
    )
}

export default JobList;