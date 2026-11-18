import React, { useState } from 'react';
import FormulaireTraitement from './FormulaireTraitement';

const ListeTraitements = ({ gestion, utilisateur, rafraichir }) => {
  const [showForm, setShowForm] = useState(false);
  const estMedecin = utilisateur.role === 'MEDECIN';
  const traitements = estMedecin ? gestion.getTraitements() : gestion.getTraitementsPatient(utilisateur.idUtilisateur);

  const ajouter = (d) => {
    gestion.ajouterTraitement({ ...d, idMedecin: utilisateur.idUtilisateur });
    setShowForm(false);
    rafraichir();
  };
  const terminer = (id) => { gestion.terminerTraitement(id); rafraichir(); };
  const supprimer = (id) => {
    if (window.confirm('Supprimer ce traitement et ses rappels ?')) { gestion.supprimerTraitement(id); rafraichir(); }
  };
  const declencher = (idRappel) => { gestion.declencherRappel(idRappel); rafraichir(); };

  return (
    <div className="liste">
      <h2>{estMedecin ? 'Traitements prescrits' : 'Mes traitements'} ({traitements.length})</h2>
      {estMedecin && !showForm && (
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>Prescrire un traitement</button>
      )}
      {showForm && <FormulaireTraitement patients={gestion.getPatients()} onAjouter={ajouter} onAnnuler={() => setShowForm(false)} />}

      {traitements.length === 0 ? (
        <div className="aucun"><p>Aucun traitement</p></div>
      ) : (
        <div className="grille">
          {traitements.map(t => {
            const patient = gestion.getPatientParId(t.idPatient);
            return (
              <div key={t.idTraitement} className="carte">
                <div className="carte-header">
                  <h3>{t.medicament}</h3>
                  <span className={`badge ${t.estActif() ? 'statut-ok' : 'statut-neutre'}`}>{t.estActif() ? 'Actif' : t.statut}</span>
                </div>
                <div className="carte-details">
                  {estMedecin && patient && <div className="detail"><span className="label">Patient :</span><span className="valeur">{patient.getNomComplet()}</span></div>}
                  <div className="detail"><span className="label">Posologie :</span><span className="valeur">{t.posologie}</span></div>
                  <div className="detail"><span className="label">Période :</span><span className="valeur">{t.dateDebut} → {t.dateFin}</span></div>
                  {gestion.getRappelsTraitement(t.idTraitement).map(r => (
                    <div key={r.idRappel} className="detail">
                      <span className="label">Rappel {r.frequence.toLowerCase()} :</span>
                      <span className="valeur">{r.actif ? `${r.dateHeure.slice(11)}` : 'désactivé'}</span>
                    </div>
                  ))}
                </div>
                <div className="carte-actions">
                  {gestion.getRappelsTraitement(t.idTraitement).filter(r => r.actif).map(r => (
                    <button key={r.idRappel} className="btn btn-warning" onClick={() => declencher(r.idRappel)}>Tester le rappel</button>
                  ))}
                  {estMedecin && t.statut === 'En cours' && <button className="btn btn-success" onClick={() => terminer(t.idTraitement)}>Terminer</button>}
                  {estMedecin && <button className="btn btn-danger" onClick={() => supprimer(t.idTraitement)}>Supprimer</button>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ListeTraitements;