import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { FormEvent, useCallback, useState } from "react";
import { CREATE_POST } from "api/post";
import { PageContainer } from "components";
import styled from "@emotion/styled";
import Button from "components/basic/Button";
import PostEditTitle from "components/PostEditTitle/PostEditTitle";
import PostEditForm from "components/PostEditForm";

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
      console.log();
      await createPost({ refetchQueries: ["GetPosts"], variables: { title, body } });
      setLoading(false);
      router.push("/");
    },
    [createPost, router]
  );
  return (
    <PageContainer>
      <Container>
        <PostEditForm onSubmit={handleSubmit} buttonName="출간하기" loading={loading} />
      </Container>
    </PageContainer>
  );
};

export default CreatePost;

const Container = styled.div`
  display: flex;
`;
const Form = styled.form`
  width: 100%;

  input {
    width: 100%;
    font-size: 40px;
    font-weight: bold;
    line-height: 1.5;
    outline: none;
    border: none;
  }

  textarea {
    width: 100%;
    margin: 20px 0;
    font-size: 18px;
    outline: none;
    border: none;
  }
`;

const TextareaWrapper = styled.div``;
