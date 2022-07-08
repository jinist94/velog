import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { FormEvent, useCallback, useState } from "react";

const CREATE_POST = gql`
  mutation CreatePost($title: String!, $body: String!) {
    createPost(data: { title: $title, body: $body }) {
      data {
        id
      }
    }
  }
`;

interface FormElements extends HTMLFormElement {
  titleInput: HTMLInputElement;
  body: HTMLInputElement;
}

const CreatePost = () => {
  const [loading, setLoading] = useState(false);
  const [createPost] = useMutation(CREATE_POST);
  const router = useRouter();

  const handleSubmit = useCallback(
    async (e: FormEvent<FormElements>) => {
      e.preventDefault();

      setLoading(true);
      const elements: FormElements = e.currentTarget;
      const title = elements.titleInput.value;
      const body = elements.body.value;
      await createPost({ variables: { title, body } });
      setLoading(false);
      /* 페이지 이동 시 추가된 post가 보이지 않는 오류 있음 */
      router.push("/");
    },
    [createPost, router]
  );
  return (
    <div>
      <h1>Create Post</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="Title" name="titleInput" />
        <textarea placeholder="Body" name="body" />
        <button disabled={loading}>등록</button>
      </form>
    </div>
  );
};

export default CreatePost;