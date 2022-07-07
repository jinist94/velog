import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import type { AppProps } from "next/app";
import nookies from "nookies";

const httpLink = createHttpLink({
  uri: "http://localhost:1337/graphql",
});

const authLink = setContext((_, { headers }) => {
  // 서버사이드에서도 사용할 수 있도록 cookie 사용.
  const { token } = nookies.get();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  // uri: "http://localhost:1337/graphql",
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
