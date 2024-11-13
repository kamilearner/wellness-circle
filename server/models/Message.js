import { statements } from '../db.js';
import { randomUUID } from 'crypto';

export function createMessage(userId, groupId, content) {
  const id = randomUUID();
  statements.createMessage.run(id, userId, groupId, content);
  return { id, userId, groupId, content };
}

export function getMessagesByGroupId(groupId) {
  return statements.getMessagesBySupportGroupId.all(groupId);
}

export function getMessageById(id) {
  return statements.getMessageById.get(id);
}