import styled from "styled-components";

const Button = styled.button`
  height: 27px;
  background-color: #59abe3;
  padding: 0px 20px;
  color: white;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
  border: none;
  border: 1px solid #59abe3;
  transition: background-color 0.5s, color 0.5s, border 0.5s;

  &:hover {
    background-color: white;
    color: #59abe3;
    border: 1px solid #59abe3;
  }
`;

const Input = styled.input`
  all: unset;
  font-size: 14px;
`;

const Label = styled.label`
  border: 1px solid #ccc;
  width: 280px;
  height: 25px;
`;

interface SearchProps {
  onSearch: () => void;
  keyword: string;
  setKeyword: React.Dispatch<React.SetStateAction<string>>;
}

const SearchKeyWord = ({ onSearch, keyword, setKeyword }: SearchProps) => {
  const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    console.log(keyword);
  };

  return (
    <div className="flex  items-center gap-[10px] mt-[10px]">
      <Label htmlFor="input">
        <Input id="input" value={keyword} onChange={onChangeValue}></Input>
      </Label>

      <Button onClick={onSearch}>검색</Button>
    </div>
  );
};

export default SearchKeyWord;
