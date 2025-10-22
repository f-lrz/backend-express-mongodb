// src/services/MovieService.ts
import Movie, { IMovie } from '../models/Movie';
import logger from '../utils/logger';

// Classe para encapsular a lógica de negócios
class MovieService {

  /**
   * Cria um novo filme associado ao usuário.
   */
  public async create(movieData: Partial<IMovie>, userId: string): Promise<IMovie> {
    try {
      // Adiciona o ID do usuário aos dados do filme
      const movie = new Movie({ ...movieData, user: userId });
      await movie.save();
      logger.info(`Novo filme criado: ${movie.title} (ID: ${movie._id}) pelo usuário ${userId}`);
      return movie;
    } catch (error: any) {
      logger.error(`Erro ao criar filme: ${error.message}`, { error });
      throw error;
    }
  }

  /**
   * Lista todos os filmes de um usuário específico, com filtros.
   * Filtros são passados como query params (ex: ?genre=Ação&watched=true)
   */
  public async findAll(userId: string, filters: any): Promise<IMovie[]> {
    try {
      // Objeto de consulta base: sempre filtra pelo usuário
      const query: any = { user: userId };

      // Adiciona filtros dinâmicos da query string
      if (filters.genre) {
        query.genre = { $regex: new RegExp(filters.genre, 'i') }; // Case-insensitive
      }
      if (filters.watched) {
        query.watched = filters.watched === 'true'; // Converte string para boolean
      }
      if (filters.rating) {
        query.rating = { $gte: Number(filters.rating) }; // Maior ou igual
      }

      logger.info(`Buscando filmes para o usuário ${userId} com filtros: ${JSON.stringify(filters)}`);
      const movies = await Movie.find(query);
      return movies;
    } catch (error: any) {
      logger.error(`Erro ao buscar filmes: ${error.message}`, { error });
      throw error;
    }
  }

  /**
   * Busca um filme específico pelo ID, garantindo que pertença ao usuário.
   */
  public async findById(movieId: string, userId: string): Promise<IMovie | null> {
    try {
      // Busca pelo ID do filme E pelo ID do usuário
      const movie = await Movie.findOne({ _id: movieId, user: userId });

      if (!movie) {
        logger.warn(`Filme ${movieId} não encontrado ou não pertence ao usuário ${userId}`);
        return null; // Será tratado como 404 ou 403 no controller
      }

      logger.info(`Filme ${movieId} encontrado para o usuário ${userId}`);
      return movie;
    } catch (error: any) {
      logger.error(`Erro ao buscar filme por ID: ${error.message}`, { error });
      throw error;
    }
  }

  /**
   * Atualiza um filme (PUT ou PATCH).
   * Garante que o filme pertença ao usuário antes de atualizar.
   */
  public async update(movieId: string, movieData: Partial<IMovie>, userId: string): Promise<IMovie | null> {
    try {
      // Encontra e atualiza, garantindo que o _id e o user correspondam.
      // { new: true } retorna o documento atualizado.
      const updatedMovie = await Movie.findOneAndUpdate(
        { _id: movieId, user: userId },
        { $set: movieData }, // $set garante que seja uma atualização parcial (PATCH)
        { new: true, runValidators: true }
      );

      if (!updatedMovie) {
        logger.warn(`Falha ao atualizar: Filme ${movieId} não encontrado ou não pertence ao usuário ${userId}`);
        return null;
      }

      logger.info(`Filme ${movieId} atualizado pelo usuário ${userId}`);
      return updatedMovie;
    } catch (error: any) {
      logger.error(`Erro ao atualizar filme: ${error.message}`, { error });
      throw error;
    }
  }

  /**
   * Remove um filme, garantindo que pertença ao usuário.
   */
  public async delete(movieId: string, userId: string): Promise<boolean> {
    try {
      // Encontra e deleta, garantindo que o _id e o user correspondam.
      const result = await Movie.findOneAndDelete({ _id: movieId, user: userId });

      if (!result) {
        logger.warn(`Falha ao deletar: Filme ${movieId} não encontrado ou não pertence ao usuário ${userId}`);
        return false;
      }

      logger.info(`Filme ${movieId} deletado pelo usuário ${userId}`);
      return true;
    } catch (error: any) {
      logger.error(`Erro ao deletar filme: ${error.message}`, { error });
      throw error;
    }
  }
}

export default new MovieService();