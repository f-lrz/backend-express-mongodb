// src/models/Movie.ts
import { Schema, model, Document, Types } from 'mongoose';

// Interface para tipagem forte do documento do filme
export interface IMovie extends Document {
  title: string;
  director?: string;
  genre?: string;
  year?: number;
  rating?: number;
  watched: boolean;
  user: Types.ObjectId; // Referência ao usuário dono do filme
}

const MovieSchema = new Schema<IMovie>({
  title: {
    type: String,
    required: [true, 'O título é obrigatório.'],
  },
  director: {
    type: String,
  },
  genre: {
    type: String,
  },
  year: {
    type: Number,
  },
  rating: {
    type: Number,
    min: [0, 'A nota não pode ser menor que 0.'],
    max: [10, 'A nota não pode ser maior que 10.'],
  },
  watched: {
    type: Boolean,
    default: false,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Referencia ao model 'User'
    required: true,
    select: false, // Não retorna o ID do usuário por padrão
  },
}, { timestamps: true });

const Movie = model<IMovie>('Movie', MovieSchema);

export default Movie;