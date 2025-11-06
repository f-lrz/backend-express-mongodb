// src/swagger.config.ts
import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Autenticação e Filmes',
      version: '1.0.0',
      description: 'Documentação da API de mini-projeto com CRUD de filmes e autenticação JWT, criada para fins acadêmicos.',
    },
    // --- ESTA É A PARTE QUE FALTAVA ---
    tags: [
      {
        name: 'Auth',
        description: 'Endpoints de Autenticação e Registro'
      },
      {
        name: 'Movies',
        description: 'Endpoints para gerenciamento de filmes (Requer Autenticação)'
      },
      {
        name: 'Status',
        description: 'Rotas de verificação de status da API'
      }
    ],
    // ------------------------------------
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desenvolvimento Local',
      },
      {
        url: 'https://<SEU_SUBDOMINIO_VERCEL>.vercel.app', // Substitua pelo seu link do Vercel
        description: 'Servidor de Produção (Vercel)',
      },
    ],
    components: {
      // Define o esquema de segurança (Bearer Token JWT)
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Insira o token JWT (sem o "Bearer ")',
        },
      },
      // Define os Schemas (modelos de dados) reutilizáveis
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'ID único do usuário' },
            name: { type: 'string', description: 'Nome do usuário' },
            email: { type: 'string', format: 'email', description: 'Email do usuário' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        UserRegister: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', example: 'João Silva' },
            email: { type: 'string', format: 'email', example: 'joao.silva@email.com' },
            password: { type: 'string', format: 'password', example: 'senha123' },
          },
        },
        UserLogin: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'joao.silva@email.com' },
            password: { type: 'string', format: 'password', example: 'senha123' },
          },
        },
        Movie: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'ID único do filme' },
            title: { type: 'string', description: 'Título do filme' },
            director: { type: 'string', description: 'Diretor do filme' },
            genre: { type: 'string', description: 'Gênero do filme' },
            year: { type: 'number', description: 'Ano de lançamento' },
            rating: { type: 'number', description: 'Nota (0 a 10)', min: 0, max: 10 },
            watched: { type: 'boolean', description: 'Se o filme já foi assistido' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        MovieInput: {
          type: 'object',
          required: ['title'],
          properties: {
            title: { type: 'string', example: 'Interestelar' },
            director: { type: 'string', example: 'Christopher Nolan' },
            genre: { type: 'string', example: 'Ficção Científica' },
            year: { type: 'number', example: 2014 },
            rating: { type: 'number', example: 9.1 },
            watched: { type: 'boolean', example: true },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: { type: 'string', description: 'Mensagem de erro' },
          },
          example: {
            error: "Mensagem de erro detalhada."
          }
        },
        TokenResponse: {
            type: 'object',
            properties: {
                message: { type: 'string' },
                token: { type: 'string' }
            },
            example: {
                message: "Login bem-sucedido!",
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            }
        }
      },
    },
    // Define a segurança global (todas as rotas protegidas usarão 'bearerAuth')
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Caminho para os arquivos que contêm as anotações JSDoc (nossas rotas)
  apis: ['./src/routes/*.ts'], // Isso já está correto
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;