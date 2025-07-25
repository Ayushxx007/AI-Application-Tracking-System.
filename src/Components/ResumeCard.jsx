import React from 'react'
import { Link } from 'react-router-dom'
import ScoreCircle from './ScoreCircle'

const ResumeCard = ({resume}) => {
  return (
    <Link className="resume-card animate-in fade-in duration-1000" to={`/resume/${resume.id}`}>

      <div className="resume-card-header">
         <div className="flex flex-col gap-2">
        <h2 className="text-black font-bold break-words">
          {resume.companyName}
        </h2>
        <h3 className="text-lg break-words text-gray-500">
          {resume.jobTitle}

        </h3>

      </div>
      <div className="flex-shrink-0">
        <ScoreCircle score={resume.feedback.overallScore} />

      </div>
      </div>
      <div className="gradient-border animate-in fade-in duration-1000">
        <div className="w-full h-full">
          <img  src={resume.imagePath} alt="resume" className=" object-cover object-top w-full h-[350px] max-sm:h-[200px]" />
        </div>



      </div>

     



    </Link>
   
  )
}

export default ResumeCard
