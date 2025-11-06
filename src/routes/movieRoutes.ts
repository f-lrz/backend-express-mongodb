// src/routes/movieRoutes.ts
import { Router } from 'express';
import MovieController from '../controllers/MovieController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 * name: Movies
 * description: Endpoints para gerenciamento de filmes (Requer Autenticação)
 */

// Aplica o middleware de autenticação a TODAS as rotas deste arquivo
router.use(authMiddleware);

/**
 * @swagger
 * /api/movies:
 * post:
 * summary: Cria um novo filme
 * tags: [Movies]
 * description: Adiciona um novo filme à lista do usuário autenticado.
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/MovieInput'
 * responses:
 * 201:
 * description: Filme criado com sucesso
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Movie'
 * 400:
 * description: Dados inválidos (ex: título faltando)
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ErrorResponse'
 * 401:
 * description: Não autorizado (token inválido/ausente)
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
router.post('/', MovieController.create);

/**
 * @swagger
 * /api/movies:
 * get:
 * summary: Lista todos os filmes do usuário (com filtros)
 * tags: [Movies]
 * description: Retorna a lista de filmes do usuário autenticado. Permite filtros via query params.
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: query
 * name: genre
 * schema:
 * type: string
 * description: Filtrar por gênero (case-insensitive)
 * example: Ficção
 * - in: query
 * name: watched
 * schema:
 * type: boolean
 * description: Filtrar por filmes assistidos (true/false)
 * example: true
 * - in: query
 * name: rating
 * schema:
 * type: number
 * description: Filtrar por nota (maior ou igual à nota fornecida)
 * example: 8.5
 * responses:
 * 200:
 * description: Lista de filmes
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Movie'
 * 401:
 * description: Não autorizado
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ErrorResponse'
 * 500:
 * description: Erro interno
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', MovieController.getAll);

/**
 * @swagger
 * /api/movies/{id}:
 * get:
 * summary: Retorna detalhes de um filme
 * tags: [Movies]
 * description: Busca um filme específico pelo ID, verificando se pertence ao usuário autenticado.
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: O ID do filme
 * example: 68fba263aade6e7b3c5408a7
 * responses:
 * 200:
 * description: Detalhes do filme
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Movie'
 * 400:
 * description: ID do filme inválido (CastError)
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ErrorResponse'
 * 401:
 * description: Não autorizado
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ErrorResponse'
 * 404:
 * description: Filme não encontrado (ou não pertence ao usuário)
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ErrorResponse'
 * 500:
 * description: Erro interno
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', MovieController.getById);

/**
 * @swagger
 * /api/movies/{id}:
 * put:
 * summary: Atualiza (substitui) um filme
 * tags: [Movies]
 * description: Substitui (método PUT) todos os dados de um filme. Requer o corpo completo do objeto.
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: O ID do filme
 * example: 68fba263aade6e7b3c5408a7
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/MovieInput'
 * responses:
 * 200:
 * description: Filme substituído com sucesso
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Movie'
 * 400:
 * description: ID inválido ou corpo da requisição incompleto
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ErrorResponse'
 * 401:
 * description: Não autorizado
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ErrorResponse'
 * 404:
 * description: Filme não encontrado
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:id', MovieController.replace);

/**
 * @swagger
 * /api/movies/{id}:
 * patch:
 * summary: Atualiza parcialmente um filme
 * tags: [Movies]
 * description: Atualiza (método PATCH) um ou mais campos de um filme.
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: O ID do filme
 * example: 68fba263aade6e7b3c5408a7
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/MovieInput'
 * examples:
 * watched_only:
 * summary: Apenas atualizando 'watched'
 * value:
 * watched: true
 * rating_and_genre:
 * summary: Atualizando 'rating' e 'genre'
 * value:
 * rating: 9.5
 * genre: "Aventura"
 * responses:
 * 200:
 * description: Filme atualizado com sucesso
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Movie'
 * 400:
 * description: ID inválido ou dados de validação incorretos
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ErrorResponse'
 * 401:
 * description: Não autorizado
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ErrorResponse'
 * 404:
 * description: Filme não encontrado
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ErrorResponse'
 */
router.patch('/:id', MovieController.update);

/**
 * @swagger
 * /api/movies/{id}:
 * delete:
 * summary: Remove um filme
 * tags: [Movies]
 * description: Remove um filme da lista do usuário autenticado.
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: O ID do filme
 * example: 68fba263aade6e7b3c5408a7
 * responses:
 * 204:
 * description: Filme deletado com sucesso (No Content)
 * 400:
 * description: ID inválido
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ErrorResponse'
 * 401:
 * description: Não autorizado
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ErrorResponse'
 * 404:
 * description: Filme não encontrado
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', MovieController.delete);

export default router;