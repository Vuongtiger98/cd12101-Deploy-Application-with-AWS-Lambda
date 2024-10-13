import AWS from 'aws-sdk';
import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';

const s3 = new AWS.S3();

const handler = async (event) => {
  const todoId = event.pathParameters.todoId; // Extract todoId from path parameters
  const bucketName = process.env.ATTACHMENT_S3_BUCKET; // S3 bucket name
  const urlExpiration = process.env.SIGNED_URL_EXPIRATION; // URL expiration time in seconds

  // Generate the signed URL
  const uploadUrl = s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId, 
    Expires: urlExpiration,
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      uploadUrl: uploadUrl,
    }),
  };
};

// Wrap the handler with middy and use the necessary middleware
export const main = middy(handler)
  .use(httpErrorHandler()) // Automatically handles errors
  .use(cors({ credentials: false })); // Enable CORS