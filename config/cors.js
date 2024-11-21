const cors = require('cors');

const corsOptions = {
  origin: 'http://localhost:5173', // Permite apenas requisições do frontend rodando em localhost:5173
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
};

const configureCors = (app) => {
  app.use(cors(corsOptions)); // Configura CORS usando as opções definidas
};

module.exports = configureCors;
