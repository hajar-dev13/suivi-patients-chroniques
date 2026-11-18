import Utilisateur from './Utilisateur';

class Medecin extends Utilisateur {
  constructor(id, nom, prenom, email, motDePasse, specialite, numOrdre) {
    super(id, nom, prenom, email, motDePasse, 'MEDECIN');
    this.specialite = specialite;
    this.numOrdre = numOrdre;
  }
}
export default Medecin;