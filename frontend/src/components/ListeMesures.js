import React, { useState } from 'react';
import FormulaireMesure from './FormulaireMesure';
import { TYPES_MESURE } from '../models/Mesure';

const ListeMesures = ({ gestion, idPatient, peutSaisir, rafraichir }) => {
  const [mesureEdit, setMesureEdit] = useState(null);
  const [filtreType, setFiltreType] = useState('');
  const patient = gestion.getPatientParId(idPatient);
  const mesures = gestion.getMesuresPatient(idPatient).filter(m => !filtreType || m.typeMesure === filtreType);

  const ajouter = (d) => { gestion.ajouterMesure(idPatient, d); rafraichir(); };
  const modifier = (id, d) => { gestion.modifierMesure(id, d); setMesureEdit(null); rafraichir(); };
  const supprimer = (id) => {
    if (window.confirm('Supprimer cette mesure ?')) { gestion.supprimerMesure(id); rafraichir(); }
  };

  return (
    <div className="liste">
      <h2>Mesures de {patient ? patient.getNomComplet() : ''}</h2>
      {peutSaisir && (
        <FormulaireMesure mesure={mesureEdit} onAjouter={ajouter} onModifier={modifier} onAnnuler={() => setMesureEdit(null)} />
      )}
      <h3>Historique ({mesures.length})</h3>
      <div className="filtres">
        <select value={filtreType} onChange={(e) => setFiltreType(e.target.value)}>
          <option value="">Tous les types</option>
          {Object.keys(TYPES_MESURE).map(t => <option key={t}>{t}</option>)}
        </select>
      </div>
      {mesures.length === 0 ? (
        <div className="aucun"><p>Aucune mesure enregistrée</p></div>
      ) : (
        <table className="tableau">
          <thead>
            <tr><th>Date</th><th>Type</th><th>Valeur</th><th>Commentaire</th><th>État</th>{peutSaisir && <th>Actions</th>}</tr>
          </thead>
          <tbody>
            {mesures.map(m => (
              <tr key={m.idMesure} className={m.estAnormale() ? 'ligne-alerte' : ''}>
                <td>{new Date(m.dateMesure).toLocaleString('fr-FR')}</td>
                <td>{m.typeMesure}</td>
                <td>{m.valeur} {m.unite}</td>
                <td>{m.commentaire}</td>
                <td><span className={`badge ${m.estAnormale() ? 'statut-alerte' : 'statut-ok'}`}>{m.estAnormale() ? 'Anormale' : 'Normale'}</span></td>
                {peutSaisir && (
                  <td>
                    <button className="btn btn-secondary" onClick={() => setMesureEdit(m)}>Modifier</button>
                    <button className="btn btn-danger" onClick={() => supprimer(m.idMesure)}>Supprimer</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListeMesures;