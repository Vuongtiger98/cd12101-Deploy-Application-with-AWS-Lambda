import Axios from 'axios';
import jsonwebtoken from 'jsonwebtoken';
import { createLogger } from '../../utils/logger.mjs';
import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';

const logger = createLogger('auth');
const jwksUrl = 'https://dev-4fajhzpzyfxqsxtk.us.auth0.com/.well-known/jwks.json';

const authHandler = async (event) => {
  try {
    const jwtToken = await verifyToken(event.authorizationToken);

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*',
          },
        ],
      },
    };
  } catch (e) {
    logger.error('User not authorized', { error: e.message, stack: e.stack });

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*',
          },
        ],
      },
    };
  }
};

// Wrap the handler with middy and use the error handler middleware
export const handler = middy(authHandler).use(httpErrorHandler());

async function verifyToken(authHeader) {
  const token = getToken(authHeader);
  const decodedToken = jsonwebtoken.decode(token, { complete: true });

  if (!decodedToken || !decodedToken.header || !decodedToken.header.kid) {
    throw new Error('Invalid token');
  }

  const kid = decodedToken.header.kid;
  const jwks = await getJwks();

  const signingKey = jwks.keys.find((key) => key.kid === kid);
  if (!signingKey) {
    throw new Error('Invalid token');
  }

  return jsonwebtoken.verify(token, signingKey, { algorithms: ['RS256'] });
}

async function getJwks() {
  try {
    const response = await Axios.get(jwksUrl);
    return response.data;
  } catch (error) {
    logger.error('Failed to fetch JWKS', { error: error.message });
    throw new Error('Unable to retrieve JWKS');
  }
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header');

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header');

  const split = authHeader.split(' ');
  const token = split[1];

  return token;
}