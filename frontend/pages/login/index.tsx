import { gql, useMutation } from "@apollo/client";
import { FormEvent, useCallback, useState } from "react";
import nookies from "nookies";
import { useRouter } from "next/router";
import { NextPageContext } from "next";

interface FormElements extends HTMLFormElement {
  email: HTMLInputElement;
  password: HTMLInputElement;
}

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(input: { identifier: $email, password: $password }) {
      jwt
    }
  }
`;

export const getServerSideProps = async (ctx: NextPageContext) => {
  const { token } = nookies.get(ctx);
  if (token) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }

  return { props: {} };
};

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [login] = useMutation(LOGIN);
  const router = useRouter();

  const handleSubmit = useCallback(
    async (e: FormEvent<FormElements>) => {
      e.preventDefault();
      setIsLoading(true);
      const elements: FormElements = e.currentTarget;
      const email = elements.email.value;
      const password = elements.password.value;
      const result = await login({ variables: { email: email, password } });
      nookies.set(null, "token", result.data.login.jwt, { path: "/" });
      setIsLoading(false);

      router.push("/");
    },
    [router, login]
  );

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" name="email" />
        <input type="password" placeholder="Password" name="password" />
        <button type="submit" disabled={isLoading}>
          Login
        </button>
      </form>
    </div>
  );
};

export default SignUp;
