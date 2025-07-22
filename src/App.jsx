import Navbar from "./Components/Navbar";
import { resumes } from "./Constants";
import ResumeCard from "./Components/ResumeCard";
import {usePuterStore} from "./lib/puter.js";
import React from 'react'
import {useEffect} from "react";
import {useNavigate} from "react-router";

function App() {
  
const {auth,init}=usePuterStore();

    useEffect(() => { init(); }, [init])
  
  const navigate=useNavigate();

  useEffect(()=>{
    if(!auth.isAuthenticated){
      navigate("/auth?next=/");

    }

  },[auth.isAuthenticated]);



  return (

    <main className="bg-[url('./images/bg-main.svg')] bg-cover ">

      <Navbar />

      

     


  
      <section className="main-section">

        <div className="page-heading py-16">
           <h1>Track your Applications and Resume Ratings</h1>
           
            <h2>Review you Submissions and check AI powered Feedbacks</h2>

        </div>
       
     

{resumes.length>0 &&(
      <div className="resumes-section">
         {resumes.map((resume)=>{

        return (
          <ResumeCard key={resume.id} resume={resume}/>
       
        )

      })}
      </div>)}

 </section>

    
     
    
    </main>
   
  
     
   
  )
}

export default App;
