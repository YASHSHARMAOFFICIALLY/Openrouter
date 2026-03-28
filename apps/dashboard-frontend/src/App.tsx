"use client"
import type {App} from "app";
import "./index.css"
import {BrowserRouter,Route,Routes} from "react-router"
import { Signin } from "./pages/Signin";
import { Landing } from "./pages/Landing";
import { Dashboard } from "./pages/Dashbaord";
import { lazy, Suspense } from "react";
import { useState } from "react";



const BackgroundBeams = lazy(() =>
  import("./components/ui/background-beams").then((mod) => ({
    default: mod.BackgroundBeams,
  }))
);

const MorphingText = lazy(() =>
  import("./components/ui/morphing-text")
);


export function App(){


  return (
   <BrowserRouter>
   <Suspense fallback={<div></div>}>
        <Routes>
          <Route path="/" element={<Landing/>}/>
          <Route path="signup" element={<Signin/>}/>
          <Route path="signin" element={<Signin />}/>
          <Route path="dashboard" element={<Dashboard/>}/>
        </Routes>
      </Suspense>
   </BrowserRouter>
  )

}
export default App;

