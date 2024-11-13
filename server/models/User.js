import { statements } from '../db.js';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

export async function createUser(email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const id = randomUUID();
  statements.createUser.run(id, email, hashedPassword);
  return { id, email };
}

export function findUserByEmail(email) {
  return statements.findUserByEmail.get(email);
}

export function findUserById(id) {
  return statements.findUserById.get(id);
}

export async function comparePassword(user, candidatePassword) {
  return bcrypt.compare(candidatePassword, user.password);
}