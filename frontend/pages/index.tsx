import { useQuery, gql } from "@apollo/client";
import Link from "next/link";
import NextLinkComposed from "../components/NextLinkComposed";

const GET_POST = gql`
  query GetPost {
    posts {
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
  const { data, loading, error } = useQuery(GET_POST);
  console.log(data?.posts);
  return (
    <div>
      {token && <NextLinkComposed href="/posts/create">글쓰기</NextLinkComposed>}
      {data?.posts.data.map((post: any) => (
        <Link key={post.id} href="/post/[id]" as={`/posts/${post.id}`}>
          <div>
            <h4>{post.attributes.title}</h4>
            <p>{post.attributes.body}</p>
            <span>{post.attributes.user.data?.attributes.username}</span>
          </div>
        </Link>
      ))}
      <button></button>
    </div>
  );
};

export default Home;
