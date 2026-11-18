import React from 'react';

const CartePatient = ({ patient, nbAnomalies, onEditer, onSupprimer, onVoirMesures }) => {
  const initiales = `${patient.prenom[0]}${patient.nom[0]}`;
  return (
    <div className="carte">
      <div className="carte-header">
        <span className="avatar">{initiales}</span>
        <h3>{patient.prenom} {patient.nom}</h3>
        {nbAnomalies > 0 && <span className="badge statut-alerte">{nbAnomalies} anomalie(s)</span>}
      </div>
      <div className="carte-details">
        <div className="detail"><span className="label">Âge :</span><span className="valeur">{patient.getAge()} ans</span></div>
        <div className="detail"><span className="label">Sexe :</span><span className="valeur">{patient.sexe}</span></div>
        <div className="detail"><span className="label">Email :</span><span className="valeur">{patient.email}</span></div>
        <div className="detail"><span className="label">Téléphone :</span><span className="valeur">{patient.telephone}</span></div>
        <div className="detail"><span className="label">Adresse :</span><span className="valeur">{patient.adresse}</span></div>
      </div>
      <div className="carte-actions">
        <button className="btn btn-success" onClick={() => onVoirMesures(patient.idUtilisateur)}>Mesures</button>
        <button className="btn btn-secondary" onClick={() => onEditer(patient)}>Modifier</button>
        <button className="btn btn-danger" onClick={() => onSupprimer(patient.idUtilisateur)}>Supprimer</button>
      </div>
    </div>
  );
};

export default CartePatient;