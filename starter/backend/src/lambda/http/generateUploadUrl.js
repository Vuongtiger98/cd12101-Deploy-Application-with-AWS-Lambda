import AWS from 'aws-sdk';

const s3 = new AWS.S3();

export const handler = async (event) => {
  const todoId = event.pathParameters.todoId;
  const bucketName = process.env.ATTACHMENT_S3_BUCKET; // S3 bucket name
  const urlExpiration = process.env.SIGNED_URL_EXPIRATION; // URL expiration time in seconds

  
  const uploadUrl = s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId, 
    Expires: urlExpiration,
  });

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      uploadUrl: uploadUrl,
    }),
  };
};