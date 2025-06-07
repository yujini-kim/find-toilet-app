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
      <label
        htmlFor="input"
        className="border border-[#ccc] box-border w-[280px] h-[25px]"
      >
        <input
          id="input"
          className="appearance-none bg-transparent border-none outline-none"
          value={keyword}
          onChange={onChangeValue}
        ></input>
      </label>

      <button
        className="appearance-none bg-transparent border border-[#ccc] outline-none w-[50px] h-[25px] cursor-pointer"
        onClick={onSearch}
      >
        검색
      </button>
    </div>
  );
};

export default SearchKeyWord;
