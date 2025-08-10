"use client";

import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  link: new HttpLink({
    uri: "https://clinic-backend-5udg.onrender.com/graphql",
    // uri: "http://localhost:4000/graphql",
    fetchOptions: {
      cache: "no-store",
    },
  }),
  cache: new InMemoryCache(),
});
