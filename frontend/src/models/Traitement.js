class Traitement {
  constructor(idTraitement, idPatient, idMedecin, medicament, posologie, dateDebut, dateFin, statut = 'En cours') {
    this.idTraitement = idTraitement;
    this.idPatient = idPatient;
    this.idMedecin = idMedecin;
    this.medicament = medicament;
    this.posologie = posologie;
    this.dateDebut = dateDebut;
    this.dateFin = dateFin;
    this.statut = statut; // En cours | Terminé
  }
  estActif() {
    return this.statut === 'En cours' && new Date(this.dateFin) >= new Date(new Date().toDateString());
  }
  terminer() { this.statut = 'Terminé'; }
}
export default Traitement;