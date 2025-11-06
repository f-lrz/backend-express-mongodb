// src/routes/authRoutes.ts
import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// --- Rotas Públicas ---

/**
 * @swagger
 * tags:
 * name: Auth
 * description: Endpoints de Autenticação e Registro
 */

/**
 * @swagger
 * /api/auth/register:
 * post:
 * summary: Registra um novo usuário
 * tags: [Auth]
 * description: Cria uma nova conta de usuário com nome, e-mail e senha.
 * security: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/UserRegister'
 * responses:
 * 201:
 * description: Usuário criado com sucesso
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message:
 * type: string
 * user:
 * $ref: '#/components/schemas/User'
 * 400:
 * description: Dados inválidos (ex: e-mail ou senha fora do formato)
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ErrorResponse'
 * 409:
 * description: E-mail já está em uso
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ErrorResponse'
 * 500:
 * description: Erro interno do servidor
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/register', AuthController.register);

/**
 * @swagger
 * /api/auth/login:
 * post:
 * summary: Realiza o login do usuário
 * tags: [Auth]
 * description: Autentica o usuário com e-mail e senha e retorna um token JWT.
 * security: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/UserLogin'
 * responses:
 * 200:
 * description: Login bem-sucedido
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/TokenResponse'
 * 400:
 * description: E-mail ou senha não fornecidos
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ErrorResponse'
 * 401:
 * description: Credenciais inválidas
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ErrorResponse'
 * 500:
 * description: Erro interno do servidor
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/login', AuthController.login);

// --- Rota Protegida ---
// O middleware `authMiddleware` será executado antes do controller

/**
 * @swagger
 * /api/auth/protected:
 * get:
 * summary: Rota protegida de exemplo
 * tags: [Auth]
 * description: Endpoint de teste para verificar a validade de um token JWT. Requer autenticação.
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Acesso autorizado
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message:
 * type: string
 * user:
 * type: object
 * properties:
 * id:
 * type: string
 * name:
 * type: string
 * 401:
 * description: Token inválido ou não fornecido
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/protected', authMiddleware, AuthController.getProtected);

export default router;