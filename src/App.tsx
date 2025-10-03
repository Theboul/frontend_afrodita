import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import GestionarLogin from "./pages/Login";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";

function App() {
 return (
  <div>
    <Header />
   <GestionarLogin />
    <Footer />  
  </div>
);
}

export default App;
