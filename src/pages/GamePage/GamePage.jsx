import { useParams } from "react-router-dom";
import { Cards } from "../../components/Cards/Cards";
import { useGameMode } from "../../contexts/GameModeContext";

export function GamePage() {
  const { pairsCount } = useParams();
  const { mistakeMode } = useGameMode(); // Получаем состояние из контекста

  return (
    <>
      <p style={{ color: "#c2f5ff" }}>Режим завершения игры: {mistakeMode ? "Включён" : "Выключен"}</p>
      <Cards pairsCount={parseInt(pairsCount, 10)} previewSeconds={5}></Cards>
    </>
  );
}
