import React, { useState, useEffect } from 'react';
import { TYPES_MESURE } from '../models/Mesure';

const FormulaireMesure = ({ mesure, onAjouter, onModifier, onAnnuler }) => {
  const [formData, setFormData] = useState({ typeMesure: 'Glycémie', valeur: '', commentaire: '' });

  useEffect(() => {
    if (mesure) setFormData({ typeMesure: mesure.typeMesure, valeur: mesure.valeur, commentaire: mesure.commentaire });
  }, [mesure]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mesure) onModifier(mesure.idMesure, { ...formData, unite: TYPES_MESURE[formData.typeMesure] });
    else onAjouter(formData);
    setFormData({ typeMesure: 'Glycémie', valeur: '', commentaire: '' });
  };

  return (
    <div className="formulaire">
      <h2>{mesure ? 'Modifier la mesure' : 'Nouvelle mesure'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Type :</label>
            <select name="typeMesure" value={formData.typeMesure} onChange={handleChange}>
              {Object.keys(TYPES_MESURE).map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Valeur ({TYPES_MESURE[formData.typeMesure]}) :</label>
            <input type="number" step="0.01" name="valeur" value={formData.valeur} onChange={handleChange} required />
          </div>
        </div>
        <div className="form-group">
          <label>Commentaire :</label>
          <input type="text" name="commentaire" value={formData.commentaire} onChange={handleChange} />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">{mesure ? 'Enregistrer' : 'Ajouter'}</button>
          {mesure && <button type="button" className="btn btn-secondary" onClick={onAnnuler}>Annuler</button>}
        </div>
      </form>
    </div>
  );
};

export default FormulaireMesure;