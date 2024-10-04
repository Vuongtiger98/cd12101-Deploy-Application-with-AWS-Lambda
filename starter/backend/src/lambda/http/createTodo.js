import { createTodo } from '../../businessLogic/todos.mjs';
import { getUserId } from '../utils.mjs';
import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';

const createTodoHandler = async (event) => {
  const newTodo = JSON.parse(event.body);
  const userId = getUserId(event); 

  // Implement creating a new TODO item
  const todoItem = await createTodo({
    userId,
    name: newTodo.name,
    dueDate: newTodo.dueDate,
  });

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: todoItem,
    }),
  };
};


export const handler = middy(createTodoHandler)
  .use(httpErrorHandler()) // Handle errors
  .use(cors({ credentials: true })); // Enable CORS