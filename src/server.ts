// src/server.ts
import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import connectDB from './database/connection';
import authRoutes from './routes/authRoutes';
import movieRoutes from './routes/movieRoutes';
import logger from './utils/logger';
import cors from 'cors';

// --- Imports do Swagger ---
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.config'; // Nosso arquivo de config
// --------------------------

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  'http://localhost:5173',
  'https://frontend-react-mongodb.filipe2025.tech'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

// Middleware para o Express entender JSON
app.use(express.json());

// Conecta ao MongoDB
connectDB();

// --- Configuração do Swagger ---
// Serve a documentação na rota /docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// -----------------------------

// Rotas da Aplicação
app.use('/api/auth', authRoutes); 
app.use('/api/movies', movieRoutes);

// Rota raiz para verificação
/**
 * @swagger
 * /:
 * get:
 * summary: Rota raiz da API
 * tags: [Status]
 * description: Retorna uma mensagem indicando que a API está no ar.
 * responses:
 * 200:
 * description: Mensagem de sucesso
 * content:
 * application/json:
 * schema:
 * type: string
 * example: API de Autenticação com JWT (e Filmes) está rodando!
 */
app.get('/', (req, res) => {
  res.send('API de Autenticação com JWT (e Filmes) está rodando!');
});

// Middleware de tratamento de erros de JSON mal formatado
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err) {
    logger.error('Requisição com JSON mal formatado recebida.', err);
    return res.status(400).json({ error: 'JSON mal formatado.' });
  }
  next();
});

app.listen(PORT, () => {
  logger.info(`Servidor rodando em http://localhost:${PORT}`);
  logger.info(`Documentação Swagger disponível em http://localhost:${PORT}/docs`); // Log para o Swagger
});