import { useMutation, useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { CREATE_COMMENT, DELETE_COMMENT, GET_COMMENTS, UPDATE_COMMENT } from "api/comments";
import { useRouter } from "next/router";
import { FormEvent, useCallback } from "react";
import { User } from "../../interface";

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
  const router = useRouter();

  const [createComment] = useMutation(CREATE_COMMENT);
  const [updateComment] = useMutation(UPDATE_COMMENT);
  const [deleteComment] = useMutation(DELETE_COMMENT);

  const onCreateComment = useCallback(
    async (e: FormEvent<CommentFormElements>) => {
      e.preventDefault();
      if (!me) {
        alert("로그인이 필요한 서비스입니다.");
        router.push("/login");
        return;
      }

      const elements = e.currentTarget;
      const comment = elements.comment.value;

      await createComment({
        refetchQueries: ["GetComments"],
        variables: { body: comment, postId },
      });
      elements.comment.value = "";
    },
    [createComment, postId, router, me]
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
      <CommentCount>{data?.comments.data.length}개의 댓글</CommentCount>
      <CommentAddForm onSubmit={onCreateComment}>
        <CommentAddInput placeholder="댓글을 작성하세요" name="comment" />
        <ButtonWrapper>
          <CommentAddButton>댓글 작성</CommentAddButton>
        </ButtonWrapper>
      </CommentAddForm>
      <CommentList>
        {data?.comments.data.map((comment: any) => (
          <CommentItem key={comment.id}>
            <UserInfo>
              <Username>{comment.attributes.user.data.attributes.username}</Username>
              <CommentButtons>
                {me?.id === comment.attributes.user.data.id && (
                  <div>
                    <button onClick={() => onUpdateComment(comment.id)}>수정</button>
                    <button onClick={() => onDeleteComment(comment.id)}>삭제</button>
                  </div>
                )}
              </CommentButtons>
            </UserInfo>
            <p>{comment.attributes.body}</p>
          </CommentItem>
        ))}
      </CommentList>
    </div>
  );
};

const CommentCount = styled.h4`
  font-size: 16px;
  font-weight: bold;
  line-height: 1.5;
  margin-bottom: 1rem;
`;

const CommentAddForm = styled.form``;
const CommentAddInput = styled.input`
  font-size: 16px;
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
  border: 1px solid #f1f3f5;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
`;

const CommentAddButton = styled.button`
  background-color: #12b886;
  font-size: 16px;
  font-weight: bold;
  color: white;
  padding: 6px 20px;
  border-radius: 4px;
`;

const CommentList = styled.ul`
  margin-top: 30px;
`;
const CommentItem = styled.li`
  padding: 30px 0;
  border-bottom: 1px solid #f1f3f5;
`;
const Username = styled.span`
  font-size: 18px;
  font-weight: bold;
`;
const UserInfo = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
`;

const CommentButtons = styled.div`
  color: #868e96;
`;

export default PostComments;
