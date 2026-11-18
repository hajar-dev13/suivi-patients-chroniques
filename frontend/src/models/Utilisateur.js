class Utilisateur {
  constructor(idUtilisateur, nom, prenom, email, motDePasse, role) {
    this.idUtilisateur = idUtilisateur;
    this.nom = nom;
    this.prenom = prenom;
    this.email = email;
    this.motDePasse = motDePasse;
    this.role = role; // 'PATIENT' | 'MEDECIN' | 'ADMIN'
    this.dateCreation = new Date();
  }
  sAuthentifier(email, motDePasse) {
    return this.email === email && this.motDePasse === motDePasse;
  }
  seDeconnecter() { return true; }
  getNomComplet() { return `${this.prenom} ${this.nom}`; }
}
export default Utilisateur;