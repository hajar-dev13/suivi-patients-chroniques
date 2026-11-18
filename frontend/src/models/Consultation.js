class Consultation {
  constructor(idConsultation, idPatient, idMedecin, dateHeure, type, motif, statut = 'Demandée') {
    this.idConsultation = idConsultation;
    this.idPatient = idPatient;
    this.idMedecin = idMedecin;
    this.dateHeure = dateHeure;
    this.type = type; // 'Présentielle' | 'Téléconsultation'
    this.lienVisio = type === 'Téléconsultation'
      ? `https://meet.suivi-patients.ma/room-${idConsultation}` : '';
    this.motif = motif;
    this.compteRendu = '';
    this.statut = statut; // Demandée | Confirmée | Terminée | Annulée
  }
  demander() { this.statut = 'Demandée'; }
  confirmer() { this.statut = 'Confirmée'; }
  terminer() { this.statut = 'Terminée'; }
  annuler() { this.statut = 'Annulée'; }
}
export default Consultation;