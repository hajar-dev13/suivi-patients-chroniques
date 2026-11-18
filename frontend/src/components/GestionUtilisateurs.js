import React, { useState } from 'react';

const GestionUtilisateurs = ({ gestion, utilisateur, rafraichir }) => {
  const vide = { nom: '', prenom: '', email: '', motDePasse: '', role: 'PATIENT' };
  const [form, setForm] = useState(vide);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const ajouter = (e) => {
    e.preventDefault();
    gestion.ajouterUtilisateur({ ...form, dateNaissance: '', sexe: 'Homme', telephone: '', adresse: '' });
    setForm(vide);
    rafraichir();
  };
  const supprimer = (id) => {
    if (window.confirm('Supprimer cet utilisateur et toutes ses données ?')) { gestion.supprimerUtilisateur(id); rafraichir(); }
  };
  const changerRole = (id, role) => { gestion.changerRole(id, role); rafraichir(); };

  return (
    <div className="liste">
      <h2>Utilisateurs et rôles ({gestion.getUtilisateurs().length})</h2>
      <div className="formulaire">
        <h2>Nouvel utilisateur</h2>
        <form onSubmit={ajouter}>
          <div className="form-row">
            <div className="form-group"><label>Nom :</label><input name="nom" value={form.nom} onChange={handleChange} required /></div>
            <div className="form-group"><label>Prénom :</label><input name="prenom" value={form.prenom} onChange={handleChange} required /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Email :</label><input type="email" name="email" value={form.email} onChange={handleChange} required /></div>
            <div className="form-group"><label>Mot de passe :</label><input type="password" name="motDePasse" value={form.motDePasse} onChange={handleChange} required /></div>
          </div>
          <div className="form-group">
            <label>Rôle :</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="PATIENT">Patient</option><option value="MEDECIN">Médecin</option><option value="ADMIN">Administrateur</option>
            </select>
          </div>
          <div className="form-actions"><button type="submit" className="btn btn-primary">Ajouter</button></div>
        </form>
      </div>
      <table className="tableau">
        <thead><tr><th>Nom</th><th>Email</th><th>Rôle</th><th>Créé le</th><th>Actions</th></tr></thead>
        <tbody>
          {gestion.getUtilisateurs().map(u => (
            <tr key={u.idUtilisateur}>
              <td>{u.getNomComplet()}</td>
              <td>{u.email}</td>
              <td>
                <select value={u.role} disabled={u.idUtilisateur === utilisateur.idUtilisateur} onChange={(e) => changerRole(u.idUtilisateur, e.target.value)}>
                  <option value="PATIENT">Patient</option><option value="MEDECIN">Médecin</option><option value="ADMIN">Administrateur</option>
                </select>
              </td>
              <td>{new Date(u.dateCreation).toLocaleDateString('fr-FR')}</td>
              <td>
                <button className="btn btn-danger" disabled={u.idUtilisateur === utilisateur.idUtilisateur} onClick={() => supprimer(u.idUtilisateur)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GestionUtilisateurs;