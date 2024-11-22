import { Link } from "react-router-dom";
import styles from "./SelectLevelPage.module.css";
import { useGameMode } from "../../contexts/GameModeContext";

export function SelectLevelPage() {
  const { mistakeMode, setMistakeMode } = useGameMode();

  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <h1 className={styles.title}>Выбери сложность</h1>
        <label className={styles.checkbox}>
          <input type="checkbox" checked={mistakeMode} onChange={e => setMistakeMode(e.target.checked)} />
          Завершение после трех ошибок
        </label>
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
      </div>
    </div>
  );
}
