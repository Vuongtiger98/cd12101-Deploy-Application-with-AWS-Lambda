import { createTodo } from '../../businessLogic/todos.mjs';
import { getUserId } from '../utils.mjs';

export const handler = async (event) => {
  const newTodo = JSON.parse(event.body);
  const userId = getUserId(event); 

  // TODO: Implement creating a new TODO item
  const todoItem = await createTodo({
    userId,
    name: newTodo.name,
    dueDate: newTodo.dueDate,
  });

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      item: todoItem,
    }),
  };
};
