import { ApolloClient, ApolloProvider, createHttpLink, gql, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import type { AppContext, AppProps } from "next/app";
import nookies from "nookies";
import Header from "../components/Header";
import { User } from "../interface";
import "../styles/reset.css";
import "../styles/app.css";

import { createUploadLink } from "apollo-upload-client";

const httpLink = createUploadLink({
  uri: "http://localhost:1337/graphql",
});

const authLink = setContext((_, { nextContext, headers }) => {
  // 서버사이드에서도 사용할 수 있도록 cookie 사용.
  const { token } = nookies.get(nextContext);
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
      <Header token={pageProps.token} />
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

MyApp.getInitialProps = async (appCtx: AppContext) => {
  const { token } = nookies.get(appCtx.ctx);

  /* 로그인한 유저의 정보 내려주기 */

  let me: User | null = null;
  if (token) {
    const QUERY = gql`
      query Me {
        me {
          id
          username
          email
        }
      }
    `;

    const { data } = await client.query<{ me: User }>({ query: QUERY, context: { nextContext: appCtx.ctx } });
    me = data.me;
    console.log(me, "me");
  }
  return { pageProps: { token, me } };
};

export default MyApp;
