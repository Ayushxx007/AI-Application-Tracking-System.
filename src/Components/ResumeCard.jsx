import React from 'react'
import { Link } from 'react-router-dom'

const ResumeCard = ({resume}) => {
  return (
    <Link className="resume-card animate-in fade-in duration-1000" to={`/resume/${resume.id}`}></Link>
   
  )
}

export default ResumeCard
