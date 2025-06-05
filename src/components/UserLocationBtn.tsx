interface Props {
  moveToUserLocation: () => void;
}

const UserLocationBtn = ({ moveToUserLocation }: Props) => {
  return (
    <button
      onClick={moveToUserLocation}
      className="appearance-none bg-transparent border border-[#ccc] outline-none  h-[25px]"
    >
      내 위치
    </button>
  );
};
export default UserLocationBtn;
