import React from "react";
import { Link } from "react-router";

const CompCard = ({company}) => {
    return (
        <Link to={`/companies/${company.handle}`}>
            <h1>{company.name}</h1>
            <p>{company.description}</p>
        </Link> 
    ) 
}

export default CompCard;