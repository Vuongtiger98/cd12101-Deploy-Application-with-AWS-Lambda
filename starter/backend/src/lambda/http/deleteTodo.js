import { deleteTodo } from '../../businessLogic/todos.mjs';
import { getUserId } from '../utils.mjs';

export const handler = async (event) => {
  const todoId = event.pathParameters.todoId;
  const userId = getUserId(event); 

  // TODO: Remove a TODO item by id
  await deleteTodo(todoId, userId);

  return {
    statusCode: 204, // No content
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: null, // Return an empty body
  };
};
