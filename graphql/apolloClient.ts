"use client";

import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  link: new HttpLink({
    uri: "https://clinic-backend-5udg.onrender.com/graphql",
    fetchOptions: {
      cache: "no-store",
    },
  }),
  cache: new InMemoryCache(),
});
