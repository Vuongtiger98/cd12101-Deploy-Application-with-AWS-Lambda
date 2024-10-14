import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const docClient = new AWS.DynamoDB.DocumentClient();
const TODOS_TABLE = process.env.TODOS_TABLE;

export const createTodo = async (todo) => {
  const params = {
    TableName: process.env.TODOS_TABLE,
    Item: {
      userId: todo.userId,
      todoId: generateId(), // You can implement a function to generate a unique ID
      name: todo.name,
      dueDate: todo.dueDate,
      createdAt: new Date().toISOString(),
      done: false,
    },
  };

  await docClient.put(params).promise();
  return params.Item;
};

export async function getTodosForUser(userId) {
    const params = {
      TableName: TODOS_TABLE,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    };
  
    const result = await docClient.query(params).promise();
    return result.Items || []; // Return an empty array if there are no items
  }

export const updateTodo = async (todoId, userId, updatedTodo) => {
const params = {
    TableName: process.env.TODOS_TABLE,
    Key: {
    userId: userId,
    todoId: todoId,
    },
    UpdateExpression: 'set #name = :name, #dueDate = :dueDate, #done = :done',
    ExpressionAttributeNames: {
    '#name': 'name',
    '#dueDate': 'dueDate',
    '#done': 'done',
    },
    ExpressionAttributeValues: {
    ':name': updatedTodo.name,
    ':dueDate': updatedTodo.dueDate,
    ':done': updatedTodo.done,
    },
    ReturnValues: 'ALL_NEW', // Return the updated item
};

const result = await docClient.update(params).promise();
return result.Attributes; // Return the updated attributes
};

export const deleteTodo = async (todoId, userId) => {
    const params = {
      TableName: process.env.TODOS_TABLE,
      Key: {
        userId: userId,
        todoId: todoId,
      },
    };
  
    await docClient.delete(params).promise();
  };

// Function to generate a unique ID 
const generateId = () => {
    return uuidv4(); 
};