import { gql, useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { FormEvent, useCallback, useState } from "react";
import { GET_POST, UPDATE_POST } from "api/post";
import PostEditForm from "components/PostEditForm";
import { PageContainer } from "components";

interface FormElements extends HTMLFormElement {
  titleInput: HTMLInputElement;
  body: HTMLInputElement;
}

const EditPost = () => {
  const router = useRouter();
  const { data, loading, error } = useQuery(GET_POST, { variables: { id: router.query.id } });
  console.log(data);

  const [updatePost] = useMutation(UPDATE_POST);

  const handleSubmit = useCallback(
    async (e: FormEvent<FormElements>) => {
      e.preventDefault();

      const elements: FormElements = e.currentTarget;
      const title = elements.titleInput.value;
      const body = elements.body.value;
      await updatePost({ refetchQueries: ["GetPosts"], variables: { id: router.query.id, title, body } });

      router.push("/");
    },
    [updatePost, router]
  );

  if (loading) {
    return;
  }
  return (
    <PageContainer>
      <PostEditForm
        onSubmit={handleSubmit}
        buttonName="수정"
        loading={loading}
        defaultTitle={data.post.data.attributes.title}
        defaultBody={data.post.data.attributes.body}
      />
    </PageContainer>
  );
};

export default EditPost;
