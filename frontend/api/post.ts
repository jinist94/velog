import { gql } from "@apollo/client";

export const GET_POSTS = gql`
  query GetPosts {
    posts(sort: ["createdAt:desc"]) {
      data {
        id
        attributes {
          title
          body
          createdAt
          user {
            data {
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

export const GET_POST = gql`
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

export const UPDATE_POST = gql`
  mutation UpdatePost($id: ID!, $title: String!, $body: String!) {
    updatePost(id: $id, data: { title: $title, body: $body }) {
      data {
        id
      }
    }
  }
`;

export const CREATE_POST = gql`
  mutation CreatePost($title: String!, $body: String!) {
    createPost(data: { title: $title, body: $body }) {
      data {
        id
      }
    }
  }
`;

export const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id) {
      data {
        id
      }
    }
  }
`;

export const SEARCH_POST = gql`
  query SearchPost($keyword: String!) {
    posts(filters: { title: { contains: $keyword } }) {
      data {
        id
        attributes {
          title
          body
          createdAt
          user {
            data {
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
