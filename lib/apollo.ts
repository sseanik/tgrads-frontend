import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';

const client = new ApolloClient({
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
    },
  },
  ssrMode: typeof window === 'undefined',
  link: createUploadLink({
    uri: `${process.env.NEXT_PUBLIC_STRAPI_URL}/graphql`,
  }),
  cache: new InMemoryCache(),
});

export default client;
