import { Link } from "react-router-dom";
import { Button } from "../../components/Button/Button";
import styles from "./LeaderboardPage.module.css";
import { useEffect } from "react";
import { useLeadersContext } from "../../contexts/LeadersContext";
import { getLeaders } from "../../api";

export function LeaderboardPage() {
  const { leaders, setLeaders } = useLeadersContext();

  useEffect(() => {
    getLeaders()
      .then(data => setLeaders(data.leaders))
      .catch(error => console.error("Ошибка при загрузке лидеров:", error));
  }, [setLeaders]);

  if (!leaders.length) {
    return <div>Загрузка...</div>;
  }
  // Сортируем игроков по времени
  const sortedLeaders = [...leaders].sort((a, b) => a.time - b.time);

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
        {sortedLeaders.map((leader, index) => (
          <div key={`${leader.id || leader.name}-${index}`} className={styles.line}>
            <div className={styles.position}>{index + 1}</div>
            <div className={styles.user}>{leader.name}</div>
            <div className={styles.time}>{leader.time} сек</div>
          </div>
        ))}
      </div>
    </div>
  );
}
