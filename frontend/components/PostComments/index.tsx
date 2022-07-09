import { gql, useMutation, useQuery } from "@apollo/client";
import { FormEvent, useCallback } from "react";

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

interface Props {
  postId: string;
}

const PostComments = ({ postId }: Props) => {
  const [createComment] = useMutation(CREATE_COMMENT);
  const { data, loading } = useQuery(GET_COMMENTS, {
    variables: { postId },
  });

  const onCreateComment = useCallback(
    async (e: FormEvent<CommentFormElements>) => {
      e.preventDefault();
      const elements = e.currentTarget;
      const comment = elements.comment.value;

      await createComment({
        refetchQueries: ["GetComments"],
        variables: { body: comment, postId },
      });
      elements.comment.value = "";
    },
    [createComment, postId]
  );

  return (
    <div>
      <h2>comment</h2>
      <form onSubmit={onCreateComment}>
        <input placeholder="Comment" name="comment" />
        <button>등록</button>
      </form>
      <div>
        {data.comments.data.map((comment: any) => (
          <div key={comment.id}>
            {comment.attributes.body} <span>{comment.attributes.user.data.attributes.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostComments;
