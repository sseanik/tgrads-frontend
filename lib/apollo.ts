import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://telstra-grads.herokuapp.com/graphql',
  cache: new InMemoryCache({
    addTypename: false,
  }),
});

export default client;
