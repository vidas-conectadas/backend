const db = require('../config/db');
const bcrypt = require('bcryptjs');

// criar um novo usuário
const createUser = (email, password, nome, sobrenome, cpf, doador, callback) => {
  const hashedPassword = bcrypt.hashSync(password, 10);

  const query = 'INSERT INTO users (email, password, nome, sobrenome, cpf, doador) VALUES (?, ?, ?, ?, ?, ?)';
  db.run(query, [email, hashedPassword, nome, sobrenome, cpf, doador], function (err) {
    if (err) {
      return callback(err);
    }
    callback(null, this.lastID); 
  });
};

// encontrar um usuário pelo e-mail
const findUserByEmail = (email, callback) => {
  const query = 'SELECT * FROM users WHERE email = ?';
  db.get(query, [email], (err, row) => {
    if (err) {
      return callback(err);
    }
    callback(null, row);
  });
};

// verificar a senha de um usuário
const comparePassword = (inputPassword, storedPassword, callback) => {
  bcrypt.compare(inputPassword, storedPassword, (err, isMatch) => {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch); 
  });
};

const findUserByCPF = (cpf, callback) => {
  const query = 'SELECT * FROM users WHERE cpf = ?';
  db.get(query, [cpf], (err, row) => {
    if (err) {
      return callback(err);
    }
    callback(null, row); 
  });
};

const findUserById = (userId, callback) => {
  const query = 'SELECT * FROM users WHERE id = ?';
  db.get(query, [userId], (err, row) => {
    if (err) {
      return callback(err);
    }
    callback(null, row);
  });
};

module.exports = { createUser, findUserByEmail, comparePassword, findUserByCPF, findUserById };
