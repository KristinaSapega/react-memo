import { Link } from "react-router-dom";
import { Button } from "../../components/Button/Button";
import styles from "./LeaderboardPage.module.css";
import { useEffect, useState } from "react";
import { getLeaders } from "../../api";

export function LeaderboardPage() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaders()
      .then(data => {
        setLeaders(data.leaders);
        setLoading(false);
      })
      .catch(error => {
        console.error("Ошибка при загрузке лидеров:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  // Сортируем игроков по времени
  const sortedLeaders = [...leaders].sort((a, b) => a.time - b.time);

  const formatTime = timeInSeconds => {
    const minutes = Math.floor(timeInSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (timeInSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Лидерборд</h1>
        <Button>
          <Link to="/" className={styles.buttonLink}>
            Начать игру
          </Link>
        </Button>
      </div>
      <div className={styles.board}>
        <div className={styles.titleLine}>
          <div className={styles.position}>Позиция</div>
          <div className={styles.user}>Пользователь</div>
          <div className={styles.time}>Время</div>
        </div>
        {sortedLeaders.map((leader, index) => (
          <div key={`${leader.id || leader.name}-${index}`} className={styles.line}>
            <div className={styles.position}>{index + 1}</div>
            <div className={styles.user}>{leader.name}</div>
            <div className={styles.time}>{formatTime(leader.time)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
