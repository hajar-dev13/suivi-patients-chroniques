import Patient from '../models/Patient';
import Medecin from '../models/Medecin';
import Administrateur from '../models/Administrateur';
import Mesure from '../models/Mesure';
import Consultation from '../models/Consultation';
import Traitement from '../models/Traitement';
import Rappel from '../models/Rappel';
import Notification from '../models/Notification';

class GestionPatientsService {
  constructor() {
    this.utilisateurs = [];
    this.mesures = [];
    this.consultations = [];
    this.traitements = [];
    this.rappels = [];
    this.notifications = [];
    this.ids = { user: 1, mesure: 1, consultation: 1, traitement: 1, rappel: 1, notif: 1 };
    this.initialiserDonnees();
  }

  initialiserDonnees() { // Données d'exemple
    this.utilisateurs.push(new Administrateur(this.ids.user++, 'Bennani', 'Sara', 'admin@suivi.ma', 'admin123'));
    this.utilisateurs.push(new Medecin(this.ids.user++, 'Alami', 'Youssef', 'medecin@suivi.ma', 'medecin123', 'Cardiologie', 'MED-4521'));
    this.ajouterPatient({ nom: 'Tazi', prenom: 'Fatima', email: 'fatima@suivi.ma', motDePasse: 'patient123',
      dateNaissance: '1972-09-30', sexe: 'Femme', telephone: '0662345678', adresse: 'Marrakech' });

    this.ajouterMesure(3, { typeMesure: 'Poids', valeur: 68 });
  }

  //  Authentification 
  authentifier(email, motDePasse) {
    return this.utilisateurs.find(u => u.sAuthentifier(email, motDePasse)) || null;
  }

  //  Utilisateurs (Administrateur) 
  getUtilisateurs() { return [...this.utilisateurs]; }
  getUtilisateurParId(id) { return this.utilisateurs.find(u => u.idUtilisateur === id); }
  getMedecins() { return this.utilisateurs.filter(u => u.role === 'MEDECIN'); }

  ajouterUtilisateur(d) {
    let u;
    if (d.role === 'MEDECIN') u = new Medecin(this.ids.user++, d.nom, d.prenom, d.email, d.motDePasse, d.specialite || 'Généraliste', d.numOrdre || '');
    else if (d.role === 'ADMIN') u = new Administrateur(this.ids.user++, d.nom, d.prenom, d.email, d.motDePasse);
    else u = new Patient(this.ids.user++, d.nom, d.prenom, d.email, d.motDePasse, d.dateNaissance || '2000-01-01', d.sexe, d.telephone, d.adresse);
    this.utilisateurs.push(u);
    return u;
  }
  changerRole(id, role) {
    const i = this.utilisateurs.findIndex(u => u.idUtilisateur === id);
    if (i === -1) return null;
    const u = this.utilisateurs[i];
    let n; // on recrée l'objet pour qu'il ait les bonnes méthodes/attributs
    if (role === 'MEDECIN') n = new Medecin(id, u.nom, u.prenom, u.email, u.motDePasse, u.specialite || 'Généraliste', u.numOrdre || '');
    else if (role === 'ADMIN') n = new Administrateur(id, u.nom, u.prenom, u.email, u.motDePasse);
    else n = new Patient(id, u.nom, u.prenom, u.email, u.motDePasse, u.dateNaissance || '2000-01-01', u.sexe || 'Homme', u.telephone || '', u.adresse || '');
    n.dateCreation = u.dateCreation;
    this.utilisateurs[i] = n;
    return n;
  }
  supprimerUtilisateur(id) {
    const i = this.utilisateurs.findIndex(u => u.idUtilisateur === id);
    if (i === -1) return null;
    this.mesures = this.mesures.filter(m => m.idPatient !== id);
    this.consultations = this.consultations.filter(c => c.idPatient !== id && c.idMedecin !== id);
    const ids = this.traitements.filter(t => t.idPatient === id || t.idMedecin === id).map(t => t.idTraitement);
    this.rappels = this.rappels.filter(r => !ids.includes(r.idTraitement));
    this.traitements = this.traitements.filter(t => !ids.includes(t.idTraitement));
    this.notifications = this.notifications.filter(n => n.idDestinataire !== id);
    return this.utilisateurs.splice(i, 1)[0];
  }

  // Patients (CRUD) 
  ajouterPatient(d) {
    const p = new Patient(this.ids.user++, d.nom, d.prenom, d.email, d.motDePasse || 'patient123',
      d.dateNaissance, d.sexe, d.telephone, d.adresse);
    this.utilisateurs.push(p);
    return p;
  }
  getPatients() { return this.utilisateurs.filter(u => u.role === 'PATIENT'); }
  getPatientParId(id) { return this.getPatients().find(p => p.idUtilisateur === id); }
  modifierPatient(id, d) {
    const p = this.getPatientParId(id);
    if (!p) return null;
    Object.assign(p, d); // conserve les méthodes de la classe
    return p;
  }
  supprimerPatient(id) { return this.supprimerUtilisateur(id); }

  // Rechercher + filtrer + paginer
  rechercherPatients(terme = '', sexe = '', page = 1, taille = 4) {
    const t = terme.toLowerCase();
    const filtres = this.getPatients().filter(p =>
      (!t || p.nom.toLowerCase().includes(t) || p.prenom.toLowerCase().includes(t) || p.email.toLowerCase().includes(t)) &&
      (!sexe || p.sexe === sexe));
    const pages = Math.max(1, Math.ceil(filtres.length / taille));
    const courante = Math.min(page, pages);
    return { items: filtres.slice((courante - 1) * taille, courante * taille), total: filtres.length, pages, page: courante };
  }

  //  Mesures (CRUD + alerte) 
  ajouterMesure(idPatient, d) {
    const m = new Mesure(this.ids.mesure++, idPatient, d.typeMesure, Number(d.valeur),
      d.dateMesure ? new Date(d.dateMesure) : new Date(), d.commentaire);
    this.mesures.push(m);
    if (m.estAnormale()) this.alerterMedecin(m); // <<extend>> Alerter le médecin
    return m;
  }
  getMesuresPatient(idPatient) {
    return this.mesures.filter(m => m.idPatient === idPatient)
      .sort((a, b) => new Date(b.dateMesure) - new Date(a.dateMesure));
  }
  modifierMesure(id, d) {
    const m = this.mesures.find(x => x.idMesure === id);
    if (!m) return null;
    Object.assign(m, d, { valeur: Number(d.valeur) });
    if (m.estAnormale()) this.alerterMedecin(m);
    return m;
  }
  supprimerMesure(id) {
    const i = this.mesures.findIndex(m => m.idMesure === id);
    return i !== -1 ? this.mesures.splice(i, 1)[0] : null;
  }
  alerterMedecin(m) {
    const p = this.getPatientParId(m.idPatient);
    this.getMedecins().forEach(med => this.creerNotification(med.idUtilisateur,
      `Anomalie : ${p.getNomComplet()} — ${m.typeMesure} = ${m.valeur} ${m.unite}`, 'ALERTE'));
  }

  //  Traitements (CRUD) + rappels 
  ajouterTraitement(d) {
    const t = new Traitement(this.ids.traitement++, d.idPatient, d.idMedecin, d.medicament,
      d.posologie, d.dateDebut, d.dateFin);
    this.traitements.push(t);
    // <<include>> Programmer les rappels
    this.programmerRappel(t.idTraitement, {
      message: `Prendre ${t.medicament} : ${t.posologie}`,
      dateHeure: `${d.dateDebut}T${d.heureRappel || '08:00'}`,
      frequence: d.frequenceRappel || 'Quotidien' });
    this.creerNotification(t.idPatient, `Nouveau traitement prescrit : ${t.medicament}`, 'INFO');
    return t;
  }
  getTraitements() { return [...this.traitements]; }
  getTraitementsPatient(idPatient) { return this.traitements.filter(t => t.idPatient === idPatient); }
  modifierTraitement(id, d) {
    const t = this.traitements.find(x => x.idTraitement === id);
    return t ? Object.assign(t, d) : null;
  }
  terminerTraitement(id) {
    const t = this.traitements.find(x => x.idTraitement === id);
    if (t) { t.terminer(); this.getRappelsTraitement(id).forEach(r => r.desactiver()); }
    return t || null;
  }
  supprimerTraitement(id) {
    const i = this.traitements.findIndex(t => t.idTraitement === id);
    if (i === -1) return null;
    this.rappels = this.rappels.filter(r => r.idTraitement !== id);
    return this.traitements.splice(i, 1)[0];
  }

  programmerRappel(idTraitement, d) {
    const r = new Rappel(this.ids.rappel++, idTraitement, d.message, d.dateHeure, d.frequence);
    this.rappels.push(r);
    return r;
  }
  getRappelsTraitement(idTraitement) { return this.rappels.filter(r => r.idTraitement === idTraitement); }
  supprimerRappel(id) {
    const i = this.rappels.findIndex(r => r.idRappel === id);
    return i !== -1 ? this.rappels.splice(i, 1)[0] : null;
  }
  // Un rappel déclenche une notification pour le patient
  declencherRappel(idRappel) {
    const r = this.rappels.find(x => x.idRappel === idRappel);
    const t = r && this.traitements.find(x => x.idTraitement === r.idTraitement);
    if (r && t && r.envoyer()) return this.creerNotification(t.idPatient, r.message, 'RAPPEL');
    return null;
  }

  // ---------- Consultations ----------
  demanderConsultation(idPatient, { motif, type }) {
    const med = this.getMedecins()[0];
    const c = new Consultation(this.ids.consultation++, idPatient, med ? med.idUtilisateur : null, '', type, motif, 'Demandée');
    this.consultations.push(c);
    this.getMedecins().forEach(m => this.creerNotification(m.idUtilisateur,
      `Demande de consultation de ${this.getPatientParId(idPatient).getNomComplet()} : ${motif}`, 'CONSULTATION'));
    return c;
  }
  ajouterConsultation(d) {
    const c = new Consultation(this.ids.consultation++, d.idPatient, d.idMedecin, d.dateHeure,
      d.type, d.motif, d.statut || 'Confirmée');
    this.consultations.push(c);
    this.creerNotification(c.idPatient, `Consultation planifiée le ${new Date(c.dateHeure).toLocaleString('fr-FR')}`, 'CONSULTATION');
    return c;
  }
  getConsultations() { return [...this.consultations]; }
  getConsultationsPatient(id) { return this.consultations.filter(c => c.idPatient === id); }
  modifierConsultation(id, d) {
    const c = this.consultations.find(x => x.idConsultation === id);
    return c ? Object.assign(c, d) : null;
  }
  changerStatutConsultation(id, action, idMedecin) {
    const c = this.consultations.find(x => x.idConsultation === id);
    if (!c) return null;
    c[action](); // confirmer | terminer | annuler
    if (idMedecin && !c.idMedecin) c.idMedecin = idMedecin;
    // <<include>> Envoyer une notification
    this.creerNotification(c.idPatient, `Votre consultation est maintenant : ${c.statut}`, 'CONSULTATION');
    return c;
  }
  supprimerConsultation(id) {
    const i = this.consultations.findIndex(c => c.idConsultation === id);
    return i !== -1 ? this.consultations.splice(i, 1)[0] : null;
  }

  // ---------- Notifications ----------
  creerNotification(idDestinataire, contenu, type) {
    const n = new Notification(this.ids.notif++, idDestinataire, contenu, type);
    this.notifications.push(n);
    return n;
  }
  getNotifications(idUser) {
    return this.notifications.filter(n => n.idDestinataire === idUser)
      .sort((a, b) => b.dateEnvoi - a.dateEnvoi);
  }
  getNombreNonLues(idUser) { return this.getNotifications(idUser).filter(n => !n.lue).length; }
  marquerNotificationLue(id) {
    const n = this.notifications.find(x => x.idNotification === id);
    if (n) n.marquerCommeLue();
    return n || null;
  }

  // ---------- Statistiques ----------
  getStatistiques(utilisateur) {
    if (utilisateur.role === 'PATIENT') {
      const id = utilisateur.idUtilisateur;
      const mesures = this.getMesuresPatient(id);
      return {
        mesures: mesures.length,
        anomalies: mesures.filter(m => m.estAnormale()).length,
        traitementsActifs: this.getTraitementsPatient(id).filter(t => t.estActif()).length,
        consultationsAVenir: this.getConsultationsPatient(id).filter(c => ['Demandée', 'Confirmée'].includes(c.statut)).length
      };
    }
    const patients = this.getPatients();
    return {
      patients: patients.length,
      mesures: this.mesures.length,
      anomalies: this.mesures.filter(m => m.estAnormale()).length,
      traitementsActifs: this.traitements.filter(t => t.estActif()).length,
      consultationsEnAttente: this.consultations.filter(c => c.statut === 'Demandée').length,
      utilisateurs: this.utilisateurs.length
    };
  }

  //  Export (CSV ouvrable dans Excel) 
  exporterCSV(type) {
    const esc = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
    let lignes;
    if (type === 'patients') {
      lignes = [['ID', 'Nom', 'Prénom', 'Email', 'Sexe', 'Âge', 'Téléphone']].concat(
        this.getPatients().map(p => [p.idUtilisateur, p.nom, p.prenom, p.email, p.sexe, p.getAge(), p.telephone]));
    } else {
      lignes = [['ID', 'Patient', 'Type', 'Valeur', 'Unité', 'Date', 'Anormale']].concat(
        this.mesures.map(m => [m.idMesure, this.getPatientParId(m.idPatient)?.getNomComplet(), m.typeMesure,
          m.valeur, m.unite, new Date(m.dateMesure).toLocaleString('fr-FR'), m.estAnormale() ? 'Oui' : 'Non']));
    }
    return '\uFEFF' + lignes.map(l => l.map(esc).join(';')).join('\n');
  }
}

export default GestionPatientsService;