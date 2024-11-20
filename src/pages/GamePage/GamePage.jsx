import { useParams, useSearchParams } from "react-router-dom";

import { Cards } from "../../components/Cards/Cards";

export function GamePage() {
  const { pairsCount } = useParams();
  const [searchParams] = useSearchParams();
  const mistakeMode = searchParams.get("mistakeMode") === "true";

  return (
    <>
      <p style={{ color: "#c2f5ff" }}>Режим завершения игры: {mistakeMode ? "Включён" : "Выключен"}</p>
      <Cards pairsCount={parseInt(pairsCount, 10)} previewSeconds={5} mistakeMode={mistakeMode}></Cards>
    </>
  );
}
