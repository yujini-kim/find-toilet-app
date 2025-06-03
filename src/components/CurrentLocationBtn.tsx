interface BtnProps {
  onClick: () => Promise<void>;
}

export default function CurrentLocationBtn({ onClick }: BtnProps) {
  return <button onClick={onClick}>내 위치</button>;
}
