import styled from "@emotion/styled";
import { PageContainer } from "components";
import { FormEvent } from "react";

const SearchPage = () => {
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
  };
  return (
    <PageContainer style={{ marginTop: 50 }}>
      <SearchForm onSubmit={onSubmit}>
        <SearchInput placeholder="검색어를 입력하세요" />
      </SearchForm>
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
