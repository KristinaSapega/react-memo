import { Link } from "react-router-dom";
import { Button } from "../../components/Button/Button";
import styles from "./LeaderboardPage.module.css";

export function LeaderboardPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Лидерборд</h1>
        <Button>
          <Link to="/">Начать игру</Link>
        </Button>
      </div>
      <div className={styles.board}>
        <div className={styles.titleLine}>
          <div className={styles.position}>Позиция</div>
          <div className={styles.user}>Пользователь</div>
          <div className={styles.time}>Время</div>
        </div>
        <div className={styles.line}>
          <div className={styles.position}></div>
          <div className={styles.user}></div>
          <div className={styles.time}></div>
        </div>
      </div>
    </div>
  );
}
