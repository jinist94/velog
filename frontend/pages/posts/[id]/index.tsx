import { gql, useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useCallback } from "react";
import NextLinkComposed from "../../../components/NextLinkComposed";
import { User } from "../../../interface";

interface Props {
  me?: User;
}

const GET_POST = gql`
  query GetPost($id: ID!) {
    post(id: $id) {
      data {
        id
        attributes {
          title
          body
          user {
            data {
              id
              attributes {
                username
                email
              }
            }
          }
        }
      }
    }
  }
`;

const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id) {
      data {
        id
      }
    }
  }
`;

const PostDetail = ({ me }: Props) => {
  console.log(me, "me");
  const router = useRouter();
  const { data, loading, error } = useQuery(GET_POST, { variables: { id: router.query.id } });

  const [deletePost] = useMutation(DELETE_POST);

  const handleDelete = useCallback(async () => {
    if (confirm("정말로 삭제하시겠습니까?")) {
      await deletePost({
        refetchQueries: ["GetPosts"],
        variables: { id: router.query.id },
      });
      router.push("/");
    }
  }, [deletePost, router]);

  return (
    <div>
      {loading ? (
        "loading..."
      ) : (
        <>
          {me?.id === data.post.data.attributes.user.data.id ? (
            <>
              <button onClick={handleDelete}>삭제</button>
              <NextLinkComposed href="/posts/[id]/edit" as={`/posts/${router.query.id}/edit`}>
                수정
              </NextLinkComposed>
            </>
          ) : (
            ""
          )}
          <h1>{data.post.data.attributes.title}</h1>
          <p>{data.post.data.attributes.body}</p>
          <span>{data.post.data.attributes.user.data.attributes.email}</span>
        </>
      )}
    </div>
  );
};

export default PostDetail;
