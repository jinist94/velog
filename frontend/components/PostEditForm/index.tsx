import styled from "@emotion/styled";
import Button from "components/basic/Button";
import { FormEvent, FormEventHandler } from "react";
import PostEditTextarea from "./PostEditTextarea";
import PostEditTitle from "./PostEditTitle";

interface PostEditFormProps {
  buttonName?: string;
  onSubmit?: (e: FormEvent<FormElements>) => void;
  loading?: boolean;
  defaultTitle?: string;
  defaultBody?: string;
}

interface FormElements extends HTMLFormElement {
  titleInput: HTMLInputElement;
  body: HTMLInputElement;
}

const PostEditForm = ({ onSubmit, buttonName, loading, defaultTitle, defaultBody }: PostEditFormProps) => {
  return (
    <Form onSubmit={onSubmit}>
      <PostEditTitle placeholder="제목을 입력해주세요." defaultValue={defaultTitle} name="titleInput" />
      <PostEditTextarea placeholder="당신의 이야기를 적어보세요.." defaultValue={defaultBody} name="body" />
      <Button size="lg" disabled={loading} styleType="primary" style={{ paddingLeft: 20, paddingRight: 20 }}>
        {buttonName}
      </Button>
    </Form>
  );
};

const Form = styled.form``;
export default PostEditForm;
