import React, { useState } from 'react';
import CartePatient from './CartePatient';

const ListePatients = ({ gestion, onEditer, onSupprimer, onVoirMesures }) => {
  const [recherche, setRecherche] = useState('');
  const [sexe, setSexe] = useState('');
  const [page, setPage] = useState(1);

  const { items, total, pages, page: pageCourante } = gestion.rechercherPatients(recherche, sexe, page);

  return (
    <div className="liste">
      <h2>Patients ({total})</h2>
      <div className="filtres">
        <input type="text" placeholder="Rechercher (nom, prénom, email)..." value={recherche}
          onChange={(e) => { setRecherche(e.target.value); setPage(1); }} />
        <select value={sexe} onChange={(e) => { setSexe(e.target.value); setPage(1); }}>
          <option value="">Tous les sexes</option>
          <option>Homme</option>
          <option>Femme</option>
        </select>
      </div>

      {items.length === 0 ? (
        <div className="aucun">
          <p>Aucun patient trouvé</p>
          <p className="sous-titre">Modifiez la recherche ou ajoutez un patient</p>
        </div>
      ) : (
        <div className="grille">
          {items.map(p => (
            <CartePatient key={p.idUtilisateur} patient={p}
              nbAnomalies={gestion.getMesuresPatient(p.idUtilisateur).filter(m => m.estAnormale()).length}
              onEditer={onEditer} onSupprimer={onSupprimer} onVoirMesures={onVoirMesures} />
          ))}
        </div>
      )}

      <div className="pagination">
        <button className="btn btn-secondary" disabled={pageCourante <= 1} onClick={() => setPage(pageCourante - 1)}>Précédent</button>
        <span>Page {pageCourante} / {pages}</span>
        <button className="btn btn-secondary" disabled={pageCourante >= pages} onClick={() => setPage(pageCourante + 1)}>Suivant</button>
      </div>
    </div>
  );
};

export default ListePatients;