import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Auth from './Routes/Auth.jsx'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import {  Routes, Route } from "react-router";


createRoot(document.getElementById('root')).render(
  <StrictMode>
       <BrowserRouter> 
       <Routes>
     <Route path="/" element={<App />} />
        <Route path="/auth" element={<Auth />} />
    </Routes>
     </BrowserRouter> 
  </StrictMode>,
)
