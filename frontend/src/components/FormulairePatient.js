import React, { useState, useEffect } from 'react';

const vide = { nom: '', prenom: '', email: '', dateNaissance: '', sexe: 'Homme', telephone: '', adresse: '' };

const FormulairePatient = ({ patient, onAjouter, onModifier, onAnnuler }) => {
  const [formData, setFormData] = useState(vide);

  useEffect(() => {
    if (patient) {
      const { nom, prenom, email, dateNaissance, sexe, telephone, adresse } = patient;
      setFormData({ nom, prenom, email, dateNaissance, sexe, telephone, adresse });
    }
  }, [patient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (patient) onModifier(patient.idUtilisateur, formData);
    else onAjouter(formData);
  };

  return (
    <div className="formulaire">
      <h2>{patient ? 'Modifier le patient' : 'Nouveau patient'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Nom :</label>
            <input type="text" name="nom" value={formData.nom} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Prénom :</label>
            <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} required />
          </div>
        </div>
        <div className="form-group">
          <label>Email :</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Date de naissance :</label>
            <input type="date" name="dateNaissance" value={formData.dateNaissance} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Sexe :</label>
            <select name="sexe" value={formData.sexe} onChange={handleChange}>
              <option>Homme</option>
              <option>Femme</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Téléphone :</label>
            <input type="tel" name="telephone" value={formData.telephone} onChange={handleChange} placeholder="06..." />
          </div>
          <div className="form-group">
            <label>Adresse :</label>
            <input type="text" name="adresse" value={formData.adresse} onChange={handleChange} />
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">{patient ? 'Enregistrer' : 'Ajouter'}</button>
          <button type="button" className="btn btn-secondary" onClick={onAnnuler}>Annuler</button>
        </div>
      </form>
    </div>
  );
};

export default FormulairePatient;