import type {App} from "app";
import "./index.css"
import {BrowserRouter,Route,Routes} from "react-router"
import { Signin } from "./pages/Signin";
import { Landing } from "./pages/Landing";
import { Dashboard } from "./pages/Dashbaord";


export function App(){
  return (
   <BrowserRouter>
    <Routes>
      <Route path ={"/"} element = {<Landing/>}/>
      <Route path ={"signup"} element = {<Signin/>}/>
      <Route path = {"signin"} element = {<Signin />}/>
      <Route path = {"dashboard"} element = {<Dashboard/>}/>


    </Routes>
   
   </BrowserRouter>
  )

}
export default App;

