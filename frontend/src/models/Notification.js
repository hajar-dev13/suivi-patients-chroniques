class Notification {
  constructor(idNotification, idDestinataire, contenu, type = 'INFO') {
    this.idNotification = idNotification;
    this.idDestinataire = idDestinataire;
    this.contenu = contenu;
    this.dateEnvoi = new Date();
    this.lue = false;
    this.type = type; // INFO | ALERTE | RAPPEL | CONSULTATION
  }
  marquerCommeLue() { this.lue = true; }
}
export default Notification;