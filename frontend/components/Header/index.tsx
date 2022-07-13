import { useCallback } from "react";
import nookies from "nookies";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import NextLinkComposed from "../NextLinkComposed";
import Link from "next/link";
interface Props {
  token?: string;
}

const Header = ({ token }: Props) => {
  const router = useRouter();
  const handleLogout = useCallback(() => {
    nookies.destroy(null, "token", { path: "/" });
    location.href = "/";
  }, []);
  return (
    <Inner>
      <Link href="/" passHref>
        <a>Velog</a>
      </Link>
      <div>
        <button>다크모드</button>
        <button>검색</button>
        {token ? (
          <>
            <Link href="/posts/create" passHref>
              <NewPostAnchor>새 글 작성</NewPostAnchor>
            </Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <LoginButton onClick={() => router.push("/login")}>로그인</LoginButton>
            <button onClick={() => router.push("/signup")}>Sign Up</button>
          </>
        )}
      </div>
    </Inner>
  );
};

export default Header;

const Inner = styled.div`
  max-width: 1375px;
  margin: 0 auto;
  display: flex;
  height: 4rem;
  align-items: center;
  justify-content: space-between;
`;

const LoginButton = styled.button`
  background-color: black;
  color: white;
  border-radius: 20px;
  padding: 3px 12px;
`;

const NewPostAnchor = styled.a`
  border: 1px solid black;
  padding: 4px 16px;
  border-radius: 30px;
  font-weight: bold;
  margin: 0 4px;
`;
