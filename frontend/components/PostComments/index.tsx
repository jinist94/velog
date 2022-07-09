import { gql, useMutation, useQuery } from "@apollo/client";
import { FormEvent, useCallback } from "react";
import { User } from "../../interface";

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

const DELETE_COMMENT = gql`
  mutation DeleteComment($id: ID!) {
    deleteComment(id: $id) {
      data {
        id
        attributes {
          body
        }
      }
    }
  }
`;

const UPDATE_COMMENT = gql`
  mutation UpdateComment($id: ID!, $body: String!) {
    updateComment(id: $id, data: { body: $body }) {
      data {
        id
        attributes {
          body
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
  me?: User;
}

const PostComments = ({ postId, me }: Props) => {
  const { data, loading } = useQuery(GET_COMMENTS, {
    variables: { postId },
  });

  const [createComment] = useMutation(CREATE_COMMENT);
  const [updateComment] = useMutation(UPDATE_COMMENT);
  const [deleteComment] = useMutation(DELETE_COMMENT);

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

  const onDeleteComment = useCallback(
    (commentId: string) => {
      if (confirm("정말 삭제하시겠습니까?")) {
        deleteComment({ refetchQueries: ["GetComments"], variables: { id: commentId } });
      }
    },
    [deleteComment]
  );

  const onUpdateComment = useCallback(
    async (commentId: string) => {
      const body = prompt("수정할 내용을 입력하세요.", "");
      updateComment({ refetchQueries: ["GetComments"], variables: { id: commentId, body } });
    },
    [updateComment]
  );

  return (
    <div>
      <h2>comment</h2>
      <form onSubmit={onCreateComment}>
        <input placeholder="Comment" name="comment" />
        <button>등록</button>
      </form>
      <div>
        {data?.comments.data.map((comment: any) => (
          <div key={comment.id}>
            <p>{comment.attributes.body}</p>
            <span>{comment.attributes.user.data.attributes.username}</span>
            {me?.id === comment.attributes.user.data.id && (
              <div>
                <button onClick={() => onUpdateComment(comment.id)}>수정</button>
                <button onClick={() => onDeleteComment(comment.id)}>삭제</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostComments;
