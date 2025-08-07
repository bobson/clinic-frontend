"use client";

import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  link: new HttpLink({
    uri: "http://localhost:4000/graphql", // Replace later
    fetchOptions: {
      cache: "no-store",
    },
  }),
  cache: new InMemoryCache(),
});
