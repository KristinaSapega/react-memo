import { Link, useNavigate } from "react-router-dom";
import { Button } from "../Button/Button";
import styles from "./LeaderboardModal.module.css";
import celebrationImageUrl from "./images/celebration.png";
import { useState } from "react";
import { addLeader } from "../../api";

export function LeaderboardModal({ time }) {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  const formatTime = timeInSeconds => {
    const minutes = Math.floor(timeInSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (timeInSeconds % 60).toString().padStart(2, "0");
    return `${minutes}.${seconds}`;
  };

  const handleSubmit = () => {
    const leaderData = {
      name: userName.trim() || "Пользователь",
      time: time || 0,
    };

    addLeader(leaderData)
      .then(() => {
        navigate("/leaderboard");
      })
      .catch(error => {
        console.error("Ошибка при добавлении лидера:", error);
      });
  };

  const handlePlayButton = () => {
    navigate("/");
  };
  return (
    <div className={styles.modal}>
      <img className={styles.image} src={celebrationImageUrl} alt="celebration emodji" />
      <h2 className={styles.title}>Вы попали на лидерборд!</h2>
      <input
        className={styles.input}
        value={userName}
        onChange={e => setUserName(e.target.value)}
        placeholder="Введите имя"
      ></input>
      <p className={styles.description}>Затраченное время:</p>
      <div className={styles.time}>{formatTime(time)}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <Button onClick={handleSubmit}>Отправить</Button>
        <Button onClick={handlePlayButton}>Играть снова</Button>
      </div>
      <div className={styles.leaderboard}>
        <Link className={styles.leaderboardLink} to="/leaderboard">
          Перейти к лидерборду
        </Link>
      </div>
    </div>
  );
}
