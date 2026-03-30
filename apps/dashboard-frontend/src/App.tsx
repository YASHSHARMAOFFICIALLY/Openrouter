"use client"
import type {App} from "app";
import "./index.css"
import {BrowserRouter,Route,Routes} from "react-router-dom"
import { LoginPage } from "./pages/Signin";
import { SignupPage } from "./pages/Signup";
import { Landing } from "./pages/Landing";
import { Dashboard } from "./pages/Dashbaord";
import { Suspense } from "react";



export function App(){
  return (
   <BrowserRouter>
   <Suspense fallback={<div></div>}>
        <Routes>
          <Route path="/" element={<Landing/>}/>
          <Route path="signup" element={<SignupPage/>}/>
          <Route path="signin" element={<LoginPage/>}/>
          <Route path="dashboard" element={<Dashboard/>}/>
        </Routes>
      </Suspense>
   </BrowserRouter>
  )

}
export default App;

