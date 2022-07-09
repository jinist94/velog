import { gql, useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { FormEvent, useCallback } from "react";
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

const CREATE_COMMENT = gql`
  mutation CreateComment($body: String!, $postId: ID!) {
    createComment(data: { body: $body, post: $postId }) {
      data {
        id
        attributes {
          body
        }
      }
    }
  }
`;

const GET_COMMENTS = gql`
  query GetComments($postId: ID!) {
    comments(filters: { post: { id: { eq: $postId } } }, sort: ["createdAt:desc"]) {
      data {
        id
        attributes {
          body
          user {
            data {
              id
              attributes {
                username
              }
            }
          }
        }
      }
    }
  }
`;
interface CommentFormElements extends HTMLFormElement {
  comment: HTMLInputElement;
}

const PostDetail = ({ me }: Props) => {
  console.log(me, "me");
  const router = useRouter();
  const { data, loading, error } = useQuery(GET_POST, { variables: { id: router.query.id } });
  const { data: commentsData, loading: commentLoading } = useQuery(GET_COMMENTS, {
    variables: { postId: router.query.id },
  });

  const [deletePost] = useMutation(DELETE_POST);
  const [createComment] = useMutation(CREATE_COMMENT);

  const handleDelete = useCallback(async () => {
    if (confirm("정말로 삭제하시겠습니까?")) {
      await deletePost({
        refetchQueries: ["GetPosts"],
        variables: { postId: router.query.id },
      });
      router.push("/");
    }
  }, [deletePost, router]);

  const onCreateComment = useCallback(
    async (e: FormEvent<CommentFormElements>) => {
      e.preventDefault();
      const elements = e.currentTarget;
      const comment = elements.comment.value;

      await createComment({
        refetchQueries: ["GetComments"],
        variables: { body: comment, postId: router.query.id },
      });
      elements.comment.value = "";
    },
    [createComment, router]
  );

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
          <div>
            <h2>comment</h2>
            <form onSubmit={onCreateComment}>
              <input placeholder="Comment" name="comment" />
              <button>등록</button>
            </form>
            <div>
              {commentsData?.comments.data.map((comment: any) => (
                <div key={comment.id}>
                  {comment.attributes.body} <span>{comment.attributes.user.data.attributes.username}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PostDetail;
