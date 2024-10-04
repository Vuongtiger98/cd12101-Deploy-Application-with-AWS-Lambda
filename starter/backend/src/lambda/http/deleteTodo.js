import { deleteTodo } from '../../businessLogic/todos.mjs';
import { getUserId } from '../utils.mjs';
import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';

const deleteTodoHandler = async (event) => {
  const todoId = event.pathParameters.todoId;
  const userId = getUserId(event); 

  // Remove a TODO item by id
  await deleteTodo(todoId, userId);

  return {
    statusCode: 204, // No content
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: null, // Return an empty body
  };
};


export const handler = middy(deleteTodoHandler)
  .use(httpErrorHandler()) // Handle errors
  .use(cors({ credentials: true })); // Enable CORS