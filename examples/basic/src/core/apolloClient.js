import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { RetryLink } from 'apollo-link-retry';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import interval from './utils/interval';
import { queryApiUrl } from '../config';

function create(initialState = {}) {
  const link = ApolloLink.from([
    new RetryLink({
      delay: 1000,
      interval: interval
    }),
    new HttpLink({
      uri: queryApiUrl,
      credentials: 'same-origin'
    })
  ]);
  const cache = new InMemoryCache().restore(initialState)
  return new ApolloClient({ link, cache })
}

let apolloClient = null
export default function initApollo(initialState) {
  // make sure to create a new client for every server-side request
  // so that data isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState)
  }

  // reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState)
  }

  return apolloClient
}
