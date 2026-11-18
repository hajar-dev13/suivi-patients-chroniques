class Rappel {
  constructor(idRappel, idTraitement, message, dateHeure, frequence = 'Quotidien') {
    this.idRappel = idRappel;
    this.idTraitement = idTraitement;
    this.message = message;
    this.dateHeure = dateHeure;
    this.frequence = frequence; // Quotidien | Hebdomadaire | Unique
    this.actif = true;
  }
  envoyer() { return this.actif; }
  desactiver() { this.actif = false; }
}
export default Rappel;