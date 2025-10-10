// src/database/connection.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from '../utils/logger'; // Criaremos este logger em breve

dotenv.config();

const connectDB = async () => {
  const mongoURI = process.env.NODE_ENV === 'production'
    ? process.env.MONGO_URI_PROD
    : process.env.MONGO_URI_LOCAL;

  if (!mongoURI) {
    logger.error('MONGO_URI não definida nas variáveis de ambiente.');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoURI);
    logger.info('Conexão com o MongoDB estabelecida com sucesso.');
  } catch (error) {
    logger.error('Erro ao conectar com o MongoDB:', error);
    process.exit(1); // Encerra a aplicação se não conseguir conectar ao banco
  }
};

export default connectDB;