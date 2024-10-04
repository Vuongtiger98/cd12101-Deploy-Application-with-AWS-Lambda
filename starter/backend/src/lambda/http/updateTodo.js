import { updateTodo } from '../../businessLogic/todos.mjs';
import { getUserId } from '../utils.mjs';

export const handler = async (event) => {
  const todoId = event.pathParameters.todoId;
  const updatedTodo = JSON.parse(event.body);
  const userId = getUserId(event); 

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  const result = await updateTodo(todoId, userId, updatedTodo);

  return {
    statusCode: 204, //No Content
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(result), 
  };
};