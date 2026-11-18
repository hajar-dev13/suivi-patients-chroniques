import React, { useState } from 'react';

const ListeConsultations = ({ gestion, utilisateur, rafraichir }) => {
  const estMedecin = utilisateur.role === 'MEDECIN';
  const patients = gestion.getPatients();
  const [form, setForm] = useState({ idPatient: patients[0]?.idUtilisateur || '', dateHeure: '', type: 'Présentielle', motif: '' });
  const consultations = estMedecin ? gestion.getConsultations() : gestion.getConsultationsPatient(utilisateur.idUtilisateur);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'idPatient' ? Number(value) : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (estMedecin) gestion.ajouterConsultation({ ...form, idMedecin: utilisateur.idUtilisateur });
    else gestion.demanderConsultation(utilisateur.idUtilisateur, form);
    setForm(prev => ({ ...prev, dateHeure: '', motif: '' }));
    rafraichir();
  };

  const action = (id, nom) => { gestion.changerStatutConsultation(id, nom, utilisateur.idUtilisateur); rafraichir(); };
  const supprimer = (id) => {
    if (window.confirm('Supprimer cette consultation ?')) { gestion.supprimerConsultation(id); rafraichir(); }
  };
  const compteRendu = (c) => {
    const texte = window.prompt('Compte rendu :', c.compteRendu);
    if (texte !== null) { gestion.modifierConsultation(c.idConsultation, { compteRendu: texte }); rafraichir(); }
  };
  const classeStatut = { 'Demandée': 'statut-attente', 'Confirmée': 'statut-ok', 'Terminée': 'statut-neutre', 'Annulée': 'statut-alerte' };

  return (
    <div className="liste">
      <h2>Consultations ({consultations.length})</h2>
      <div className="formulaire">
        <h2>{estMedecin ? 'Planifier une consultation' : 'Demander une consultation'}</h2>
        <form onSubmit={handleSubmit}>
          {estMedecin && (
            <div className="form-row">
              <div className="form-group">
                <label>Patient :</label>
                <select name="idPatient" value={form.idPatient} onChange={handleChange}>
                  {patients.map(p => <option key={p.idUtilisateur} value={p.idUtilisateur}>{p.getNomComplet()}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Date et heure :</label>
                <input type="datetime-local" name="dateHeure" value={form.dateHeure} onChange={handleChange} required />
              </div>
            </div>
          )}
          <div className="form-row">
            <div className="form-group">
              <label>Type :</label>
              <select name="type" value={form.type} onChange={handleChange}>
                <option>Présentielle</option><option>Téléconsultation</option>
              </select>
            </div>
            <div className="form-group">
              <label>Motif :</label>
              <input type="text" name="motif" value={form.motif} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">{estMedecin ? 'Planifier' : 'Envoyer la demande'}</button>
          </div>
        </form>
      </div>

      {consultations.length === 0 ? (
        <div className="aucun"><p>Aucune consultation</p></div>
      ) : (
        <div className="grille">
          {consultations.map(c => {
            const p = gestion.getPatientParId(c.idPatient);
            return (
              <div key={c.idConsultation} className="carte">
                <div className="carte-header">
                  <h3>{c.type}</h3>
                  <span className={`badge ${classeStatut[c.statut]}`}>{c.statut}</span>
                </div>
                <div className="carte-details">
                  {estMedecin && p && <div className="detail"><span className="label">Patient :</span><span className="valeur">{p.getNomComplet()}</span></div>}
                  <div className="detail"><span className="label">Date :</span><span className="valeur">{c.dateHeure ? new Date(c.dateHeure).toLocaleString('fr-FR') : 'À fixer'}</span></div>
                  <div className="detail"><span className="label">Motif :</span><span className="valeur">{c.motif}</span></div>
                  {c.compteRendu && <div className="detail"><span className="label">Compte rendu :</span><span className="valeur">{c.compteRendu}</span></div>}
                </div>
                <div className="carte-actions">
                  {c.lienVisio && c.statut === 'Confirmée' && (
                    <a className="btn btn-success" href={c.lienVisio} target="_blank" rel="noreferrer">Rejoindre la visio</a>
                  )}
                  {estMedecin && c.statut === 'Demandée' && <button className="btn btn-success" onClick={() => action(c.idConsultation, 'confirmer')}>Confirmer</button>}
                  {estMedecin && c.statut === 'Confirmée' && <button className="btn btn-primary" onClick={() => action(c.idConsultation, 'terminer')}>Terminer</button>}
                  {estMedecin && <button className="btn btn-secondary" onClick={() => compteRendu(c)}>Compte rendu</button>}
                  {['Demandée', 'Confirmée'].includes(c.statut) && <button className="btn btn-warning" onClick={() => action(c.idConsultation, 'annuler')}>Annuler</button>}
                  {estMedecin && <button className="btn btn-danger" onClick={() => supprimer(c.idConsultation)}>Supprimer</button>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ListeConsultations;