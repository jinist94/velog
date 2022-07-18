import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { FormEvent, useCallback, useState } from "react";
import { CREATE_POST } from "api/post";
import { PageContainer } from "components";
import styled from "@emotion/styled";
import Button from "components/basic/Button";

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
      await createPost({ refetchQueries: ["GetPosts"], variables: { title, body } });
      setLoading(false);
      router.push("/");
    },
    [createPost, router]
  );
  return (
    <PageContainer>
      <Container>
        <Form onSubmit={handleSubmit}>
          <input placeholder="제목을 입력하세요" name="titleInput" />
          <TextareaWrapper>
            <textarea placeholder="당신의 이야기를 적어보세요.." name="body" />
          </TextareaWrapper>
          <Button size="lg" disabled={loading} styleType="primary" style={{ paddingLeft: 20, paddingRight: 20 }}>
            출간하기
          </Button>
        </Form>
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
