import { gql, useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { FormEvent, useCallback, useState } from "react";
import { GET_POST, UPDATE_POST } from "api/post";

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

  return (
    <div>
      <h1>Create Post</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="Title" defaultValue={data.post.data.attributes.title} name="titleInput" />
        <textarea placeholder="Body" defaultValue={data.post.data.attributes.body} name="body" />
        <button disabled={loading}>수정</button>
      </form>
    </div>
  );
};

export default EditPost;
