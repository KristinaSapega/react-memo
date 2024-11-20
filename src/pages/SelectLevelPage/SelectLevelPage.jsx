import { Link } from "react-router-dom";
import styles from "./SelectLevelPage.module.css";
import { useState } from "react";

export function SelectLevelPage() {
  const [mistakeMode, setMistakeMode] = useState(false);

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
            <Link className={styles.levelLink} to={`/game/3?mistakeMode=${mistakeMode}`}>
              1
            </Link>
          </li>
          <li className={styles.level}>
            <Link className={styles.levelLink} to={`/game/6?mistakeMode=${mistakeMode}`}>
              2
            </Link>
          </li>
          <li className={styles.level}>
            <Link className={styles.levelLink} to={`/game/9?mistakeMode=${mistakeMode}`}>
              3
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
