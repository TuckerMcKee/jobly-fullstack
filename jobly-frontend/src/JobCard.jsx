import React from "react";
import { useState, useContext, useEffect } from "react";
import AuthContext from "./AuthContext";
import JoblyApi from "./api";

const JobCard = ({job}) => {
    const [applied,setApplied] = useState(false);
    const user = useContext(AuthContext);

    const hasApplied = (jobId) => user.jobs.includes(jobId);

    useEffect(() => {
        setApplied(hasApplied(job.id))
    },[])
    
    const handleApply = async (e) => {
        const msg = await JoblyApi.postJobApp(user.username,job.id);
        console.log(msg)
        setApplied(true);
    };
    return (
        <>
            <h1>{job.title}</h1>
            <h3>{job.companyHandle}</h3>
            <span>Salary: {job.salary}</span>
            <span>Equity: {job.equity}</span>
            <button onClick={handleApply} disabled={applied}>{applied ? 'Applied' : 'Apply'}</button>
        </>
    ) 
}

export default JobCard;