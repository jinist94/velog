import { ChangeEvent, useCallback, useState } from "react";
import nookies from "nookies";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import NextLinkComposed from "../NextLinkComposed";
import Link from "next/link";
import { gql, useMutation } from "@apollo/client";
interface Props {
  token?: string;
}

const UPDATE_POST = gql`
  mutation UpdatePost($id: ID!, $title: String!, $body: String!) {
    updatePost(id: $id, data: { title: $title, body: $body }) {
      data {
        id
      }
    }
  }
`;

const UPLOAD_IMAGE = gql`
  mutation Upload($file: Upload!) {
    upload(file: $file) {
      data {
        id
        attributes {
          name
        }
      }
    }
  }
`;

const Header = ({ token }: Props) => {
  const router = useRouter();
  const [uploadImage] = useMutation(UPLOAD_IMAGE);
  const [image, setImage] = useState<File | null>(null);
  const handleLogout = useCallback(() => {
    nookies.destroy(null, "token", { path: "/" });
    location.href = "/";
  }, []);

  const onImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      console.log(e.target.files[0]);
      // setImage(e.target.files[0]);
      uploadImage({ variables: { file: e.target.files[0] } });
    }
  };
  return (
    <Inner>
      <Link href="/" passHref>
        <a>Velog</a>
      </Link>
      <div>
        <div>
          <input type="file" name="files" onChange={onImageChange} alt="image" />
        </div>
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
