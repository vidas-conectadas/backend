const db = require('../config/db');
const bcrypt = require('bcryptjs'); 

// criar uma nova doação
const createDonation = (userId, data_doacao, local, nextDonationDate, callback) => {
  const query = 'INSERT INTO donations (user_id, data_doacao, local, next_donation) VALUES (?, ?, ?, ?)';
  db.run(query, [userId, data_doacao, local, nextDonationDate], function (err) {
    if (err) {
      return callback(err);
    }
    callback(null, this.lastID); 
  });
};

// buscar todas as doações de um usuário
const findDonationsByUserId = (userId, page, limit = 5, callback) => {
  const offset = (page - 1) * limit; // Calcula o deslocamento baseado na página
  const query = 'SELECT * FROM donations WHERE user_id = ? ORDER BY data_doacao DESC LIMIT ? OFFSET ?';
  
  db.all(query, [userId, limit, offset], (err, rows) => {
    if (err) {
      return callback(err);
    }
    
    // Conta o total de doações para saber o número total de páginas
    db.get('SELECT COUNT(*) AS count FROM donations WHERE user_id = ?', [userId], (err, row) => {
      if (err) {
        return callback(err);
      }
      callback(null, rows, row.count);  // Retorna as doações e o total de doações
    });
  });
};



// encontrar uma doação pelo ID
const findDonationByIdAndUser = (donationId, userId, callback) => {
    const query = 'SELECT * FROM donations WHERE id = ? AND user_id = ?';

    db.get(query, [donationId, userId], (err, row) => {
        if (err) {
            return callback(err);
        }
        callback(null, row);
    });
};

// atualizar a doação
const updateDonation = (donationId, data_doacao, local, callback) => {
    const query = 'UPDATE donations SET data_doacao = ?, local = ? WHERE id = ?';

    db.run(query, [data_doacao, local, donationId], function (err) {
        if (err) {
            return callback(err);
        }
        callback(null);
    });
};

// deletar a doação
const deleteDonation = (donationId, callback) => {
    const query = 'DELETE FROM donations WHERE id = ?';

    db.run(query, [donationId], function (err) {
        if (err) {
            return callback(err);
        }
        callback(null);
    });
};

module.exports = { createDonation, findDonationsByUserId, findDonationByIdAndUser, updateDonation, deleteDonation };
