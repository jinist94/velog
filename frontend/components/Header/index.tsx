import { useCallback } from "react";
import nookies from "nookies";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
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
      <div>Velog</div>
      <div>
        <button>다크모드</button>
        <button>검색</button>
        {token ? (
          <button onClick={handleLogout}>Logout</button>
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
