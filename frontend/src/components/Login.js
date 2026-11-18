import React, { useState } from 'react';

const Login = ({ onLogin, erreur }) => {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, motDePasse);
  };

  return (
    <div className="login">
      <form className="formulaire" onSubmit={handleSubmit}>
        <h2>Connexion</h2>
        <div className="form-group">
          <label>Email :</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Mot de passe :</label>
          <input type="password" value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} required />
        </div>
        {erreur && <div className="error-message">{erreur}</div>}
        <button type="submit" className="btn btn-primary">Se connecter</button>
      </form>
    </div>
  );
};

export default Login;