import { gql, useMutation } from "@apollo/client";
import { FormEvent, useCallback, useState } from "react";
import nookies from "nookies";
import { useRouter } from "next/router";
import { NextPageContext } from "next";

// Form 구성 정의
interface FormElements extends HTMLFormElement {
  username: HTMLInputElement;
  email: HTMLInputElement;
  password: HTMLInputElement;
}

const REGISTER = gql`
  mutation Register($username: String!, $email: String!, $password: String!) {
    register(input: { username: $username, email: $email, password: $password }) {
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

  const [register] = useMutation(REGISTER);
  const router = useRouter();

  const handleSubmit = useCallback(
    async (e: FormEvent<FormElements>) => {
      e.preventDefault();
      setIsLoading(true);
      const elements: FormElements = e.currentTarget;
      const username = elements.username.value;
      const email = elements.email.value;
      const password = elements.password.value;
      const result = await register({ variables: { username, email, password } });
      nookies.set(null, "token", result.data.register.jwt, { path: "/" });
      // 서버사이드라면 컨텍스트를 넣겠지만 클라이언트사이드여서 null을 넣는다
      setIsLoading(false);

      router.push("/");
    },
    [router, register]
  );

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" name="username" />
        <input type="email" placeholder="Email" name="email" />
        <input type="password" placeholder="Password" name="password" />
        <button type="submit" disabled={isLoading}>
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
