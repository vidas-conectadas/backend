const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors'); // Importe o módulo cors
const authRoutes = require('./routes/authRoutes');

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const port = 5000;

// Configurar CORS para aceitar solicitações do seu frontend
const corsOptions = {
  origin: 'http://localhost:5173', // Permite o frontend rodando em localhost:5173
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
  credentials: true, // Permite o envio de cookies e cabeçalhos de autenticação
};

app.use(cors(corsOptions)); // Use CORS no seu app

// Usar o body-parser para interpretar o corpo da requisição
app.use(bodyParser.json());

// Definir as rotas de autenticação
app.use('/api/auth', authRoutes);

// Iniciar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
