import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";

interface Props {
  id: string;
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

const PostDetail = ({ id }: Props) => {
  const router = useRouter();
  const { data, loading, error } = useQuery(GET_POST, { variables: { id: router.query.id } });

  /* 없는 id에 접근 시  */
  return (
    <div>
      {loading ? (
        "loading..."
      ) : (
        <>
          <h1>{data.post.data.attributes.title}</h1>
          <p>{data.post.data.attributes.body}</p>
          <span>{data.post.data.attributes.user.data.attributes.email}</span>
        </>
      )}
    </div>
  );
};

export default PostDetail;
