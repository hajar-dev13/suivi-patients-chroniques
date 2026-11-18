export const TYPES_MESURE = {
  'Glycémie': 'g/L',
  'Tension systolique': 'mmHg',
  'Fréquence cardiaque': 'bpm',
  'Température': '°C',
  'Poids': 'kg'
};

class Mesure {
  constructor(idMesure, idPatient, typeMesure, valeur, dateMesure = new Date(), commentaire = '') {
    this.idMesure = idMesure;
    this.idPatient = idPatient;
    this.typeMesure = typeMesure;
    this.valeur = valeur;
    this.unite = TYPES_MESURE[typeMesure] || '';
    this.dateMesure = dateMesure;
    this.commentaire = commentaire;
  }
  estAnormale() {
    const v = Number(this.valeur);
    switch (this.typeMesure) {
      case 'Glycémie': return v < 0.7 || v > 1.26;
      case 'Tension systolique': return v < 90 || v > 140;
      case 'Fréquence cardiaque': return v < 50 || v > 110;
      case 'Température': return v < 35.5 || v > 38;
      default: return false;
    }
  }
}
export default Mesure;