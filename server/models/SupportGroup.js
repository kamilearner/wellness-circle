import { statements } from '../db.js';
import { randomUUID } from 'crypto';

export function createSupportGroup(name, description, category, imageUrl) {
  const id = randomUUID();
  statements.createSupportGroup.run(id, name, description, category, imageUrl);
  return { id, name, description, category, imageUrl };
}

export function getSupportGroupById(id) {
  return statements.getSupportGroupById.get(id);
}

export function getAllSupportGroups() {
  return statements.getAllSupportGroups.all();
}

export function addMessage(groupId, userId, content) {
  const id = randomUUID();
  statements.createMessage.run(id, userId, groupId, content);
  return statements.getMessageById.get(id);
}

export function getMessages(groupId) {
  return statements.getMessagesBySupportGroupId.all(groupId);
}