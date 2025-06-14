import styled from "styled-components";
import type { ToiletInfoProps } from "../types/Types";

const Contatiner = styled.div`
  position: fixed;
  width: 250px;
  height: 300px;
  top: 20px;
  left: 700px;
  transform: translateX(-50%);
  border: 1px solid #ccc;
  box-shadow: 8px 8px #59abe3;
  padding: 10px 10px;
`;

const ToiletName = styled.h1`
  font-size: 20px;
  font-weight: bold;
`;

const Text = styled.p`
  font-size: 14px;
  margin: 4px 0;
`;

const TextBox = styled.div``;

const Button = styled.button`
  position: fixed;
  right: 10px;
  bottom: 10px;
  height: 28px;
  background-color: #59abe3;
  padding: 0px 20px;
  margin-top: 8px;

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

export default function ToiletInfo({
  toiletName,
  roadAddress,
  lotNumberAddress,
  openTime,
  maleToiletCount,
  maleUrinalCount,
  femaleToiletCount,
  maleDisabledToiletCount,
  femaleDisabledToiletCount,
  setSelectedMarker,
}: ToiletInfoProps) {
  return (
    <Contatiner>
      <ToiletName>{toiletName}</ToiletName>
      <TextBox>
        <Text>
          🚩
          {roadAddress ? roadAddress : lotNumberAddress}
        </Text>
        <Text>
          🕒
          {openTime ? openTime : "정보가 제공되지 않아요"}
        </Text>
      </TextBox>

      <hr className="my-2" />
      <TextBox>
        <Text>🚻 남자 대변기: {maleToiletCount}</Text>
        <Text>🚹 소변기: {maleUrinalCount}</Text>
        <Text>🚺 여자 대변기: {femaleToiletCount}</Text>
        <Text>
          ♿ 여자장애인 화장실:
          {femaleDisabledToiletCount}
        </Text>
        <Text>♿ 남자장애인 화장실:{maleDisabledToiletCount}</Text>
      </TextBox>

      <Button onClick={() => setSelectedMarker(null)}>닫기</Button>
    </Contatiner>
  );
}
