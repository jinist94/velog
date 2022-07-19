import { gql } from "@apollo/client";

export const CREATE_COMMENT = gql`
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

export const GET_COMMENTS = gql`
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

export const DELETE_COMMENT = gql`
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

export const UPDATE_COMMENT = gql`
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
