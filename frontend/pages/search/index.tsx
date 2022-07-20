import { useLazyQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { SEARCH_POST } from "api/post";
import { PageContainer } from "components";
import { FormEvent, useState } from "react";

const SearchPage = () => {
  const [loadPosts] = useLazyQuery(SEARCH_POST);
  const [searchResults, setSearchResults] = useState([]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const elements: HTMLFormElement = e.currentTarget;
    const keyword = elements.search.value;
    const result = await loadPosts({ variables: { keyword } });
    setSearchResults(result.data.posts.data);
    console.log(result.data.posts.data);
  };
  return (
    <PageContainer style={{ marginTop: 50 }}>
      <SearchForm onSubmit={onSubmit}>
        <SearchInput placeholder="검색어를 입력하세요" name="search" />
      </SearchForm>
      {searchResults.map((post: any) => (
        <div key={post.id}>{post.attributes.title}</div>
      ))}
    </PageContainer>
  );
};

export default SearchPage;

const SearchForm = styled.form`
  width: 100%;
  padding: 10px 20px;
  border: 1px solid #000;
`;

const SearchInput = styled.input`
  width: 100%;
  outline: 0;
  border: 0;
  line-height: 1.5;
  font-size: 24px;
  padding-top: 4px;
`;
