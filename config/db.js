const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../database.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite');
  }
});

const createTables = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      nome TEXT NOT NULL,
      sobrenome TEXT NOT NULL,
      cpf TEXT UNIQUE NOT NULL,
      doador BOOLEAN NOT NULL
    )
  `;

  db.run(createTableQuery, (err) => {
    if (err) {
      console.error('Erro ao criar a tabela de usuários:', err.message);
    } else {
      console.log('Tabela de usuários criada ou já existe');
    }
  });
};

createTables(); 
const createDonationTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS donations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      data_doacao TEXT NOT NULL,
      local TEXT NOT NULL,
      next_donation TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `;

  db.run(createTableQuery, (err) => {
    if (err) {
      console.error('Erro ao criar a tabela de doações:', err.message);
    } else {
      console.log('Tabela de doações criada ou já existe');
    }
  });
};

createDonationTable();

module.exports = db;
