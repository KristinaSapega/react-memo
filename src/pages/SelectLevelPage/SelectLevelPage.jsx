import { Link } from "react-router-dom";
import styles from "./SelectLevelPage.module.css";
import { useGameMode } from "../../contexts/GameModeContext";
import { Button } from "../../components/Button/Button";

export function SelectLevelPage() {
  const { mistakeMode, setMistakeMode } = useGameMode();

  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <h1 className={styles.title}>Выбери сложность</h1>
        <ul className={styles.levels}>
          <li className={styles.level}>
            <Link className={styles.levelLink} to={`/game/3`}>
              1
            </Link>
          </li>
          <li className={styles.level}>
            <Link className={styles.levelLink} to={`/game/6`}>
              2
            </Link>
          </li>
          <li className={styles.level}>
            <Link className={styles.levelLink} to={`/game/9`}>
              3
            </Link>
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
        <Button>Играть</Button>
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
