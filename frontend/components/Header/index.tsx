import { useCallback } from "react";
import nookies from "nookies";
import { useRouter } from "next/router";
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
    <div>
      <div>Velog</div>
      {token ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <>
          <button onClick={() => router.push("/login")}>Login</button>
          <button onClick={() => router.push("/signup")}>Sign Up</button>
        </>
      )}
    </div>
  );
};

export default Header;
