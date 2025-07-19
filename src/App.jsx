import Navbar from "./Components/Navbar";
import { resumes } from "./Constants";
import ResumeCard from "./Components/ResumeCard";

function App() {
  

  return (

    <main className="bg-[url('./images/bg-main.svg')] bg-cover ">

      <Navbar />


  
      <section className="main-section">
        <div className="page-heading">
           <h1>Track your Applications and Resume Ratings</h1>
           
            <h2>Review you Submissions and check AI powered Feedbacks</h2>

        </div>
       
      </section>

{resumes.length>0 &&(
      <div className="resumes-section">
         {resumes.map((resume)=>{

        return (
          <ResumeCard key={resume.id} resume={resume}/>
       
        )

      })}
      </div>)}



    
     
    
    </main>
   
  
     
   
  )
}

export default App;
