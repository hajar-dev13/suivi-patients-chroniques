import React from 'react';

const telecharger = (contenu, nom) => {
  const lien = document.createElement('a');
  lien.href = URL.createObjectURL(new Blob([contenu], { type: 'text/csv;charset=utf-8' }));
  lien.download = nom;
  lien.click();
};

const Statistiques = ({ gestion, utilisateur }) => {
  const s = gestion.getStatistiques(utilisateur);
  const estPatient = utilisateur.role === 'PATIENT';

  const items = estPatient ? [
    ['Mesures saisies', s.mesures, 'total'],
    ['Mesures anormales', s.anomalies, 'alerte'],
    ['Traitements actifs', s.traitementsActifs, 'ok'],
    ['Consultations à venir', s.consultationsAVenir, 'info']
  ] : [
    ['Patients', s.patients, 'total'],
    ['Mesures', s.mesures, 'info'],
    ['Anomalies', s.anomalies, 'alerte'],
    ['Traitements actifs', s.traitementsActifs, 'ok'],
    ['Demandes en attente', s.consultationsEnAttente, 'info'],
    ['Utilisateurs', s.utilisateurs, 'total']
  ];

  return (
    <div className="statistiques">
      <h2>Tableau de bord</h2>
      <div className="stats-grid">
        {items.map(([label, valeur, classe]) => (
          <div key={label} className={`stat-item ${classe}`}>
            <div className="stat-valeur">{valeur}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>
      {!estPatient && (
        <div className="export-actions">
          <button className="btn btn-secondary" onClick={() => telecharger(gestion.exporterCSV('patients'), 'patients.csv')}>
            Exporter les patients (Excel)
          </button>
          <button className="btn btn-secondary" onClick={() => telecharger(gestion.exporterCSV('mesures'), 'mesures.csv')}>
            Exporter les mesures (Excel)
          </button>
          <button className="btn btn-primary" onClick={() => window.print()}>Exporter en PDF</button>
        </div>
      )}
    </div>
  );
};

export default Statistiques;