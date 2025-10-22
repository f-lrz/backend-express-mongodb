// src/controllers/MovieController.ts
import { Request, Response } from 'express';
import MovieService from '../services/MovieService';

// Estende a interface Request para incluir o usuário (do authMiddleware)
interface AuthenticatedRequest extends Request {
  user?: { id: string; name: string };
}

class MovieController {

  public async create(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user!.id; // Garantido pelo authMiddleware
      const movie = await MovieService.create(req.body, userId);
      return res.status(201).json(movie);
    } catch (error: any) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }

  public async getAll(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user!.id;
      // Passa os query params (filtros) para o service
      const movies = await MovieService.findAll(userId, req.query);
      return res.status(200).json(movies);
    } catch (error: any) {
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }

  public async getById(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user!.id;
      const movieId = req.params.id;
      const movie = await MovieService.findById(movieId, userId);

      if (!movie) {
        // Se não encontrou, pode ser 404 (não existe) ou 403 (existe, mas é de outro)
        // Por segurança, é comum retornar 404 em ambos os casos.
        return res.status(404).json({ error: 'Filme não encontrado.' });
      }

      return res.status(200).json(movie);
    } catch (error: any) {
      if (error.name === 'CastError') {
        return res.status(400).json({ error: 'ID do filme inválido.' });
      }
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }

  // Este método lida com PUT e PATCH
  public async update(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user!.id;
      const movieId = req.params.id;
      
      // O service usa $set, então funciona para PATCH.
      // Para um PUT "puro" (que substitui), a lógica no service seria diferente.
      // Mas para a maioria das APIs, $set é o comportamento esperado para ambos.
      const updatedMovie = await MovieService.update(movieId, req.body, userId);

      if (!updatedMovie) {
        return res.status(404).json({ error: 'Filme não encontrado.' });
      }

      return res.status(200).json(updatedMovie);
    } catch (error: any) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
      }
      if (error.name === 'CastError') {
        return res.status(400).json({ error: 'ID do filme inválido.' });
      }
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }

  public async delete(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user!.id;
      const movieId = req.params.id;
      const success = await MovieService.delete(movieId, userId);

      if (!success) {
        return res.status(404).json({ error: 'Filme não encontrado.' });
      }

      // 204 No Content é a resposta padrão para delete bem-sucedido
      return res.status(204).send();
    } catch (error: any) {
      if (error.name === 'CastError') {
        return res.status(400).json({ error: 'ID do filme inválido.' });
      }
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }
}

export default new MovieController();