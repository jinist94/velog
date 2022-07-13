import { useQuery, gql } from "@apollo/client";
import { css, Global } from "@emotion/react";
import styled from "@emotion/styled";
import Link from "next/link";
import Text from "../components/basic/Text";
import NextLinkComposed from "../components/NextLinkComposed";

const GET_POSTS = gql`
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

interface Prop {
  token?: string;
}

const Home = ({ token }: Prop) => {
  const { data, loading, error } = useQuery(GET_POSTS);

  return (
    <PostContainer>
      <Global styles={BodyStyle} />

      {data?.posts.data.map((post: any) => (
        <Link key={post.id} href="/posts/[id]" as={`/posts/${post.id}`}>
          <PostCard>
            <PostContent>
              <PostHeader>{post.attributes.title}</PostHeader>
              <Text size="xs" block>
                {post.attributes.body}
              </Text>
            </PostContent>
            <UserInfo>
              <Text size="xs" block>
                by {post.attributes.user.data?.attributes.username}
              </Text>
            </UserInfo>
          </PostCard>
        </Link>
      ))}
    </PostContainer>
  );
};

export default Home;

const PostContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  max-width: 1375px;
  margin: 0 auto;
`;

const PostCard = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(20% - 10px);
  min-height: 200px;
  background-color: white;
  box-sizing: border-box;
  box-shadow: rgb(0 0 0 / 4%) 0px 4px 16px 0px;
`;

const PostHeader = styled.h3`
  font-weight: bold;
  font-size: 12px;
  line-height: 1.5em;
`;

const UserInfo = styled.div`
  padding: 10px;
  border-top: 1px solid #f1f3f5;
`;

const PostContent = styled.div`
  padding: 10px;
  flex: 1 1 0%;
`;

const BodyStyle = css`
  body {
    background-color: #f8f9fa;
  }
`;
