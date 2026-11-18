import Utilisateur from './Utilisateur';

class Patient extends Utilisateur {
  constructor(id, nom, prenom, email, motDePasse, dateNaissance, sexe, telephone, adresse) {
    super(id, nom, prenom, email, motDePasse, 'PATIENT');
    this.dateNaissance = dateNaissance;
    this.sexe = sexe;
    this.telephone = telephone;
    this.adresse = adresse;
  }
  getAge() {
    return new Date().getFullYear() - new Date(this.dateNaissance).getFullYear();
  }
}
export default Patient;