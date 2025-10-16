import React, { useState } from "react";
import "../../styles/GestionarLogin.css";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";

const GestionarLogin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "algo@gmail.com" && password === "123456") {
      setError("");
      alert("Login exitoso");
    } else {
      setError("Correo o contraseña incorrectos");
    }
  };

  return (
    <div >
      <Header />
      <div className="login-container">
        <div className="login-form">
          <h2>Iniciar Sesión</h2>
          <form onSubmit={handleLogin}>
            <label>Correo electrónico</label>
            <input
              type="email"
              placeholder="algo@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Contraseña</label>
            <input
              type="password"
              placeholder="*****"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <p className="error">{error}</p>}

            <button type="submit">Iniciar</button>
          </form>
          <p>
            ¿No tienes cuenta aún? <span className="crear-cuenta">Crear una cuenta</span>
          </p>
        </div>

        <div className="login-image">
          <img src="/assets/urban_layer.png" alt="Urban Layer" />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default GestionarLogin;