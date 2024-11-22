import { Link, Navigate } from "react-router-dom";
import { Button } from "../Button/Button";
import styles from "./LeaderboardModal.module.css";
import celebrationImageUrl from "./images/celebration.png";

export function LeaderboardModal() {
  const handlePlayButton = () => {
    Navigate("/");
  };
  return (
    <div className={styles.modal}>
      <img className={styles.image} src={celebrationImageUrl} alt="celebration emodji" />
      <h2 className={styles.title}>Вы попали на лидерборд!</h2>
      <input className={styles.input} name="user" placeholder="Введите имя"></input>
      <p className={styles.description}>Затраченное время:</p>
      <div className={styles.time}></div>
      <Button>Отправить</Button>
      <Button>onClick={handlePlayButton}Играть снова</Button>
      <div className={styles.leaderboard}>
        <Link className={styles.leaderboardLink} to="/leaderboard">
          Перейти к лидерборду
        </Link>
      </div>
    </div>
  );
}
