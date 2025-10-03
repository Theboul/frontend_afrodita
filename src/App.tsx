import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import GestionarCatalogo from "./pages/auth/gestionarCategoria";

function App() {
  return (
    <BrowserRouter>
      <Header />
      
      <GestionarCatalogo />

      <Footer />
    </BrowserRouter>
  );
}

export default App;
