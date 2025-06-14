import styled from "styled-components";

const Button = styled.button`
  display: inline-block;
  height: 36px;
  background-color: #59abe3;
  padding: 0px 20px;
  margin-top: 10px;
  color: white;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
  border: none;
  border: 1px solid #59abe3;
  border-radius: 50px;
  transition: background-color 0.5s, color 0.5s, border 0.5s;

  &:hover {
    background-color: white;
    color: #59abe3;
    border: 1px solid #59abe3;
  }
`;

interface Props {
  moveToUserLocation: () => void;
}

const UserLocationBtn = ({ moveToUserLocation }: Props) => {
  return <Button onClick={moveToUserLocation}>내 위치</Button>;
};
export default UserLocationBtn;
