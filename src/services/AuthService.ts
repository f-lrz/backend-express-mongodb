// src/services/AuthService.ts
import User, { IUser } from '../models/User';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';

class AuthService {
  public async register(userData: Partial<IUser>): Promise<IUser> {
    try {
      // Verifica se o email já existe
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error('Este e-mail já está em uso.');
      }

      const user = new User(userData);
      await user.save();
      logger.info(`Usuário registrado com sucesso: ${user.email}`);

      // Remove a senha do objeto retornado
      const userObject = user.toObject();
      delete userObject.password;
      
      return userObject;
    } catch (error: any) {
      logger.error(`Erro ao registrar usuário: ${error.message}`);
      throw error;
    }
  }

  public async login(email: string, password: string): Promise<string> {
    try {
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        throw new Error('Credenciais inválidas.'); // Mensagem genérica por segurança
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new Error('Credenciais inválidas.'); // Mensagem genérica por segurança
      }
      
      const secret = process.env.JWT_SECRET;
      const expiresIn = process.env.JWT_EXPIRES_IN;

      if (!secret) throw new Error('Chave JWT não configurada.');
      
      const token = jwt.sign({ id: user._id, name: user.name }, secret, { expiresIn });
      logger.info(`Login bem-sucedido para o usuário: ${email}`);
      return token;

    } catch (error: any) {
      logger.error(`Erro no login: ${error.message}`);
      throw error;
    }
  }
}

export default new AuthService();