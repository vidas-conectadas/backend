const User = require('../models/User');
const Donation = require('../models/Donation');
const jwt = require('jsonwebtoken');

// novo usuário
const register = (req, res) => {
  const { email, password, nome, sobrenome, cpf, doador } = req.body;

  if (!email || !password || !nome || !sobrenome || !cpf || doador === undefined) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
  }

  User.findUserByCPF(cpf, (err, existingUser) => {
    if (err) {
      return res.status(500).json({ message: 'Erro no servidor', error: err.message });
    }

    if (existingUser) {
      return res.status(400).json({ message: 'CPF já está registrado!' });
    }

    User.findUserByEmail(email, (err, existingEmailUser) => {
      if (err) {
        return res.status(500).json({ message: 'Erro no servidor', error: err.message });
      }

      if (existingEmailUser) {
        return res.status(400).json({ message: 'Usuário já existe!' });
      }

      User.createUser(email, password, nome, sobrenome, cpf, doador, (err, userId) => {
        if (err) {
          return res.status(500).json({ message: 'Erro ao criar usuário', error: err.message });
        }

        res.status(201).json({ message: 'Usuário criado com sucesso!', userId });
      });
    });
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByEmail(email, (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Erro no servidor', error: err.message });
    }

    if (!user) {
      return res.status(400).json({ message: 'Usuário não encontrado!' });
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao comparar senha', error: err.message });
      }

      if (!isMatch) {
        return res.status(400).json({ message: 'Senha incorreta!' });
      }

      // token JWT
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: '1h', 
      });

      res.status(200).json({ token });
    });
  });
};

const getUserData = (req, res) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'Token não fornecido!' });
  }

  const tokenValue = token.split(' ')[1];

  jwt.verify(tokenValue, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido ou expirado!' });
    }

    User.findUserById(decoded.userId, (err, user) => { 
      if (err) {
        return res.status(500).json({ message: 'Erro ao buscar usuário', error: err.message });
      }

      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado!' });
      }

      res.status(200).json({
        id: user.id,
        email: user.email,
        nome: user.nome,
        sobrenome: user.sobrenome,
        cpf: user.cpf,
        doador: user.doador
      });
    });
  });
};

module.exports = { register, login, getUserData };
