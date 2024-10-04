import { getUserId } from '../utils'; 
import { getTodosForUser } from '../../businessLogic/todos'; 
import { createLogger } from '../../utils/logger.mjs';
import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import cors from '@middy/http-cors';

const logger = createLogger('getTodos');

const handler = async (event) => {
  const userId = getUserId(event); 
  // Get all TODO items for a current user
  try {
    const todos = await getTodosForUser(userId); 

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        items: todos,
      }),
    };
  } catch (error) {
    logger.error('Error fetching TODOs', { error: error.message });
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        message: 'Could not fetch TODOs',
      }),
    };
  }
};

// Wrap the handler with middy and use the necessary middleware
export const main = middy(handler)
  .use(httpErrorHandler()) // Automatically handles errors
  .use(cors({
    credentials: true // Enable CORS with credentials
  }));