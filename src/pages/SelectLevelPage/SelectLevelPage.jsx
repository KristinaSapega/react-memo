import { Link, useNavigate } from "react-router-dom";
import styles from "./SelectLevelPage.module.css";
import { useGameMode } from "../../contexts/GameModeContext";
import { Button } from "../../components/Button/Button";
import { useState } from "react";

export function SelectLevelPage() {
  const { mistakeMode, setMistakeMode } = useGameMode();
  const [selectedLevel, setSelectedLevel] = useState(null);
  const navigate = useNavigate();

  const handleStartGame = () => {
    if (selectedLevel) {
      navigate(`/game/${selectedLevel}`);
    } else {
      alert("Пожалуйста, выберите уровень сложности!");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <h1 className={styles.title}>Выбери сложность</h1>
        <ul className={styles.levels}>
          <li
            className={`${styles.level} ${selectedLevel === 3 ? styles.active : ""}`}
            onClick={() => setSelectedLevel(3)}
          >
            1
          </li>
          <li
            className={`${styles.level} ${selectedLevel === 6 ? styles.active : ""}`}
            onClick={() => setSelectedLevel(6)}
          >
            2
          </li>
          <li
            className={`${styles.level} ${selectedLevel === 9 ? styles.active : ""}`}
            onClick={() => setSelectedLevel(9)}
          >
            3
          </li>
        </ul>
        {/* <div className={styles.box}> */}
        <label className={styles.label}>
          <input
            className={styles.checkbox}
            type="checkbox"
            checked={mistakeMode}
            onChange={e => setMistakeMode(e.target.checked)}
          />
          Легкий режим (3 жизни)
        </label>
        <Button onClick={handleStartGame}>Играть</Button>
        <div className={styles.leaderboard}>
          <Link className={styles.leaderboardLink} to="/leaderboard">
            Перейти к лидерборду
          </Link>
        </div>
        {/* </div> */}
      </div>
    </div>
  );
}
