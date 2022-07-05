import { ApolloClient, InMemoryCache } from '@apollo/client';

const strapiURL = `${process.env.STRAPI_URL}/graphql`;

const client = new ApolloClient({
  uri: strapiURL,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
    },
  },
});

export default client;
