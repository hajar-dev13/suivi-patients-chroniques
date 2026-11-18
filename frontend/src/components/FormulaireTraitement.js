import React, { useState } from 'react';

const FormulaireTraitement = ({ patients, onAjouter, onAnnuler }) => {
  const [formData, setFormData] = useState({
    idPatient: patients.length ? patients[0].idUtilisateur : '',
    medicament: '', posologie: '',
    dateDebut: new Date().toISOString().slice(0, 10), dateFin: '',
    frequenceRappel: 'Quotidien', heureRappel: '08:00'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'idPatient' ? Number(value) : value }));
  };

  const handleSubmit = (e) => { e.preventDefault(); onAjouter(formData); };

  return (
    <div className="formulaire">
      <h2>Prescrire un traitement</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Patient :</label>
          <select name="idPatient" value={formData.idPatient} onChange={handleChange} required>
            {patients.map(p => <option key={p.idUtilisateur} value={p.idUtilisateur}>{p.getNomComplet()}</option>)}
          </select>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Médicament :</label>
            <input type="text" name="medicament" value={formData.medicament} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Posologie :</label>
            <input type="text" name="posologie" value={formData.posologie} onChange={handleChange} placeholder="ex: 1 comprimé matin et soir" required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Début :</label>
            <input type="date" name="dateDebut" value={formData.dateDebut} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Fin :</label>
            <input type="date" name="dateFin" value={formData.dateFin} min={formData.dateDebut} onChange={handleChange} required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Fréquence du rappel :</label>
            <select name="frequenceRappel" value={formData.frequenceRappel} onChange={handleChange}>
              <option>Quotidien</option><option>Hebdomadaire</option><option>Unique</option>
            </select>
          </div>
          <div className="form-group">
            <label>Heure du rappel :</label>
            <input type="time" name="heureRappel" value={formData.heureRappel} onChange={handleChange} />
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Prescrire</button>
          <button type="button" className="btn btn-secondary" onClick={onAnnuler}>Annuler</button>
        </div>
      </form>
    </div>
  );
};

export default FormulaireTraitement;