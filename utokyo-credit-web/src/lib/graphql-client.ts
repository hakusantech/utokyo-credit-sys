import { GraphQLClient } from 'graphql-request';

export const gqlClient = new GraphQLClient(
  process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT!,
  { 
    fetch,
    headers: {
      // For development - in production you'll want proper auth
      'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET || '',
    }
  }
);

// Client-side GraphQL client (without admin secret)
export const clientGqlClient = new GraphQLClient(
  process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT!,
  { 
    fetch,
    // Add auth headers here when implementing JWT auth
  }
); 