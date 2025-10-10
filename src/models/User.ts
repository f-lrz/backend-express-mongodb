// src/models/User.ts
import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

// Interface para tipagem forte do documento do usuário
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // Opcional, pois não será retornado nas queries
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'O nome é obrigatório.'],
  },
  email: {
    type: String,
    required: [true, 'O e-mail é obrigatório.'],
    unique: true,
    lowercase: true,
    match: [/.+\@.+\..+/, 'Por favor, insira um e-mail válido.'],
  },
  password: {
    type: String,
    required: [true, 'A senha é obrigatória.'],
    select: false, // Não retorna a senha em queries por padrão
  },
}, { timestamps: true });

// Middleware (pre-hook) para fazer o hash da senha antes de salvar
UserSchema.pre<IUser>('save', async function (next) {
  // Executa a função apenas se a senha foi modificada (ou é nova)
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Método para comparar a senha informada com o hash salvo no banco
UserSchema.methods.comparePassword = function (password: string): Promise<boolean> {
  if (!this.password) {
    return Promise.resolve(false);
  }
  return bcrypt.compare(password, this.password);
};

const User = model<IUser>('User', UserSchema);

export default User;