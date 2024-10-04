
import { getUserId } from '../utils'; 
import { getTodosForUser } from '../../businessLogic/todos'; 
import { createLogger } from '../../utils/logger.mjs';

const logger = createLogger('getTodos');

export async function handler(event) {
  const userId = getUserId(event); 
    // TODO: Get all TODO items for a current user
  try {
    const todos = await getTodosForUser(userId); 

    return {
      statusCode: 200,
      body: JSON.stringify({
        items: todos,
      }),
    };
  } catch (error) {
    logger.error('Error fetching TODOs', { error: error.message });
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Could not fetch TODOs',
      }),
    };
  }
}