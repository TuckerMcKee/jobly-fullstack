import React from "react";
import {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import JobCard from "./JobCard"
import JoblyApi from "./api";

const CompDetail = () => {
    const params = useParams();
    const companyHandle = params.handle;

    const [company,setCompany] = useState({jobs:[]});

    useEffect(() => {
        const getCompany = async () => {
            try {
                const company = await JoblyApi.getCompany(companyHandle);
                setCompany(company);
            } catch (e) {
                console.log(e)
            }
        }
        getCompany();
    },[])

    return (
        <>
        <h1>{company.name}</h1>
        <section>
            {company.jobs.map(j => {
                return <JobCard key={j.title + j.companyHandle + j.salary + j.equity} job={j}/>
            })}
        </section>
        </>
    )
}

export default CompDetail;