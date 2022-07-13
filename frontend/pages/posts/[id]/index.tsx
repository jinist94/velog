import { gql, useMutation, useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { FormEvent, useCallback } from "react";
import Text from "../../../components/basic/Text";
import NextLinkComposed from "../../../components/NextLinkComposed";
import PostComments from "../../../components/PostComments";
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
  const router = useRouter();
  const { data, loading, error } = useQuery(GET_POST, { variables: { id: router.query.id } });
  console.log(typeof router.query.id, "router.query.id");

  const [deletePost] = useMutation(DELETE_POST);

  const handleDelete = useCallback(async () => {
    if (confirm("정말로 삭제하시겠습니까?")) {
      await deletePost({
        refetchQueries: ["GetPosts"],
        variables: { postId: router.query.id },
      });
      router.push("/");
    }
  }, [deletePost, router]);

  return (
    <Container>
      {loading ? (
        "loading..."
      ) : (
        <>
          <PostTitle>{data.post.data.attributes.title}</PostTitle>
          <PostInfo>
            <Text size={16}>{data.post.data.attributes.user.data.attributes.email}</Text>
            {me?.id === data.post.data.attributes.user.data.id && (
              <PostButtons>
                <NextLinkComposed href="/posts/[id]/edit" as={`/posts/${router.query.id}/edit`}>
                  수정
                </NextLinkComposed>
                <button onClick={handleDelete}>삭제</button>
              </PostButtons>
            )}
          </PostInfo>

          <PostContent>
            <p>{data.post.data.attributes.body}</p>
          </PostContent>
          <PostComments postId={router.query.id as string} me={me} />
        </>
      )}
    </Container>
  );
};

export default PostDetail;

const Container = styled.div`
  width: 768px;
  margin: 0 auto;
`;

const PostTitle = styled.h1`
  font-weight: bold;
  color: #212529;
  font-size: 48px;
  margin-bottom: 2rem;
`;

const PostContent = styled.div`
  margin: 48px 0;
`;

const PostInfo = styled.div`
  display: flex;
  justify-content: space-between;
`;

const PostButtons = styled.div`
  color: #868e96;
`;