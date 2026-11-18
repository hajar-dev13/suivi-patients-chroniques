import React from 'react';

const Notifications = ({ gestion, utilisateur, rafraichir }) => {
  const notifications = gestion.getNotifications(utilisateur.idUtilisateur);
  const classes = { ALERTE: 'statut-alerte', RAPPEL: 'statut-attente', CONSULTATION: 'statut-ok', INFO: 'statut-neutre' };

  return (
    <div className="liste">
      <h2>Notifications et rappels ({notifications.length})</h2>
      {notifications.length === 0 ? (
        <div className="aucun"><p>Aucune notification</p></div>
      ) : (
        <ul className="notifications">
          {notifications.map(n => (
            <li key={n.idNotification} className={n.lue ? 'lue' : 'non-lue'}>
              <span className={`badge ${classes[n.type]}`}>{n.type}</span>
              <span className="contenu">{n.contenu}</span>
              <span className="date">{n.dateEnvoi.toLocaleString('fr-FR')}</span>
              {!n.lue && (
                <button className="btn btn-secondary" onClick={() => { gestion.marquerNotificationLue(n.idNotification); rafraichir(); }}>
                  Marquer comme lue
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;