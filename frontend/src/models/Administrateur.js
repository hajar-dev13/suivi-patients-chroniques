import Utilisateur from './Utilisateur';

class Administrateur extends Utilisateur {
  constructor(id, nom, prenom, email, motDePasse) {
    super(id, nom, prenom, email, motDePasse, 'ADMIN');
  }
}
export default Administrateur;