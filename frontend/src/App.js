// src/App.js
import React, { useState } from 'react';
import GestionPatientsService from './services/GestionPatientsService';
import Login from './components/Login';
import Statistiques from './components/Statistiques';
import ListePatients from './components/ListePatients';
import FormulairePatient from './components/FormulairePatient';
import ListeMesures from './components/ListeMesures';
import ListeTraitements from './components/ListeTraitements';
import ListeConsultations from './components/ListeConsultations';
import Notifications from './components/Notifications';
import GestionUtilisateurs from './components/GestionUtilisateurs';
import './App.css';

const MENUS = {
  PATIENT: [['dashboard', 'Tableau de bord'], ['mesures', 'Mes mesures'], ['traitements', 'Mes traitements'],
    ['consultations', 'Consultations'], ['notifications', 'Notifications']],
  MEDECIN: [['dashboard', 'Tableau de bord'], ['patients', 'Patients'], ['traitements', 'Traitements'],
    ['consultations', 'Consultations'], ['utilisateurs', 'Utilisateurs et rôles'], ['notifications', 'Notifications']],
  ADMIN: [['dashboard', 'Statistiques']]
};

function App() {
  const [gestion] = useState(() => new GestionPatientsService());
  const [utilisateur, setUtilisateur] = useState(null);
  const [erreur, setErreur] = useState('');
  const [onglet, setOnglet] = useState('dashboard');
  const [patientEdit, setPatientEdit] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [idPatientMesures, setIdPatientMesures] = useState(null);
  const [, setTick] = useState(0);
  const rafraichir = () => setTick(t => t + 1);

  // Authentification
  const seConnecter = (email, motDePasse) => {
    const u = gestion.authentifier(email, motDePasse);
    if (u) { setUtilisateur(u); setErreur(''); setOnglet('dashboard'); }
    else setErreur('Email ou mot de passe incorrect.');
  };
  const seDeconnecter = () => { utilisateur.seDeconnecter(); setUtilisateur(null); setIdPatientMesures(null); };

  // CRUD patients
  const ajouterPatient = (d) => { gestion.ajouterPatient(d); setShowForm(false); rafraichir(); };
  const modifierPatient = (id, d) => { gestion.modifierPatient(id, d); setPatientEdit(null); setShowForm(false); rafraichir(); };
  const supprimerPatient = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce patient ?')) { gestion.supprimerPatient(id); rafraichir(); }
  };
  const editerPatient = (p) => { setPatientEdit(p); setShowForm(true); };
  const annulerEdition = () => { setPatientEdit(null); setShowForm(false); };
  const voirMesures = (id) => { setIdPatientMesures(id); setOnglet('mesures'); };

  if (!utilisateur) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>Suivi des Patients</h1>
          <p>Mesures, traitements et consultations au même endroit</p>
        </header>
        <Login onLogin={seConnecter} erreur={erreur} />
      </div>
    );
  }

  const nonLues = gestion.getNombreNonLues(utilisateur.idUtilisateur);
  const idMesures = utilisateur.role === 'PATIENT' ? utilisateur.idUtilisateur : idPatientMesures;

  return (
    <div className="app">
      <header className="app-header">
        <h1>Suivi des Patients</h1>
        <p>{utilisateur.getNomComplet()} — {utilisateur.role.toLowerCase()}</p>
        <button className="btn btn-secondary" onClick={seDeconnecter}>Se déconnecter</button>
      </header>

      <nav className="menu">
        {MENUS[utilisateur.role].map(([cle, libelle]) => (
          <button key={cle} className={`onglet ${onglet === cle ? 'actif' : ''}`}
            onClick={() => { setOnglet(cle); if (cle !== 'mesures') setIdPatientMesures(null); }}>
            {libelle}{cle === 'notifications' && nonLues > 0 && <span className="pastille">{nonLues}</span>}
          </button>
        ))}
      </nav>

      <div className="app-container">
        {onglet === 'dashboard' && <Statistiques gestion={gestion} utilisateur={utilisateur} />}

        {onglet === 'patients' && (
          <>
            {!showForm && <button className="btn btn-primary btn-ajouter" onClick={() => setShowForm(true)}>Ajouter un patient</button>}
            {showForm && <FormulairePatient patient={patientEdit} onAjouter={ajouterPatient} onModifier={modifierPatient} onAnnuler={annulerEdition} />}
            <ListePatients gestion={gestion} onEditer={editerPatient} onSupprimer={supprimerPatient} onVoirMesures={voirMesures} />
          </>
        )}

        {onglet === 'mesures' && idMesures && (
          <>
            {utilisateur.role === 'MEDECIN' && (
              <button className="btn btn-secondary" onClick={() => { setIdPatientMesures(null); setOnglet('patients'); }}>← Retour aux patients</button>
            )}
            <ListeMesures gestion={gestion} idPatient={idMesures} peutSaisir={utilisateur.role === 'PATIENT'} rafraichir={rafraichir} />
          </>
        )}

        {onglet === 'traitements' && <ListeTraitements gestion={gestion} utilisateur={utilisateur} rafraichir={rafraichir} />}
        {onglet === 'consultations' && <ListeConsultations gestion={gestion} utilisateur={utilisateur} rafraichir={rafraichir} />}
        {onglet === 'notifications' && <Notifications gestion={gestion} utilisateur={utilisateur} rafraichir={rafraichir} />}
        {onglet === 'utilisateurs' && utilisateur.role === 'MEDECIN' && <GestionUtilisateurs gestion={gestion} utilisateur={utilisateur} rafraichir={rafraichir} />}
      </div>
    </div>
  );
}

export default App;