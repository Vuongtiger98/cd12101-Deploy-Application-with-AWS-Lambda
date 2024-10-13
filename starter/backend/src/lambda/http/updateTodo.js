import { updateTodo } from '../../businessLogic/todos.mjs';
import { getUserId } from '../utils.mjs';
import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import cors from '@middy/http-cors';

const handler = async (event) => {
  const todoId = event.pathParameters.todoId;
  const updatedTodo = JSON.parse(event.body);
  const userId = getUserId(event); 

  try {
    // Update a TODO item with the provided id using values in the "updatedTodo" object
    await updateTodo(todoId, userId, updatedTodo);

    return {
      statusCode: 204, // No Content
      body: JSON.stringify({}), // No content to return
    };
  } catch (error) {
    console.error('Error updating TODO:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Could not update TODO',
      }),
    };
  }
};

// Wrap the handler with middy and use the necessary middleware
export const main = middy(handler)
  .use(httpErrorHandler()) // Automatically handles errors
  .use(cors({ credentials: false })); // Enable CORS