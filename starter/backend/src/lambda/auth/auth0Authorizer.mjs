import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

const jwksUrl = 'https://test-endpoint.auth0.com/.well-known/jwks.json'

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader);
  const decodedToken = jsonwebtoken.decode(token, { complete: true });

  if (!decodedToken) {
    throw new Error('Invalid token');
  }

  const kid = decodedToken.header.kid;
  const jwks = await getJwks();

  const signingKey = jwks.keys.find(key => key.kid === kid);
  if (!signingKey) {
    throw new Error('Invalid token');
  }

  return jsonwebtoken.verify(token, signingKey, { algorithms: ['RS256'] });
}

async function getJwks() {
  const response = await Axios.get(jwksUrl);
  return response.data;
}


function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
