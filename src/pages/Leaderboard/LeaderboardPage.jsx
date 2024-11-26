import { Link } from "react-router-dom";
import { Button } from "../../components/Button/Button";
import styles from "./LeaderboardPage.module.css";
import { useEffect, useState } from "react";
import { getLeaders } from "../../api";
import magicBallInactiveUrl from "./images/magic_ball_no_color.png";
import puzzleInactiveUrl from "./images/puzzle_no_color.png";
import magicBallUrl from "./images/magic_ball.png";
import puzzleUrl from "./images/puzzle.png";
import hardModeUrl from "./images/hardMode.png";
import superPowerUsedUrl from "./images/superPowerUsed.png";

export function LeaderboardPage() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  const achievements = {
    1: {
      id: 1,
      name: "Без суперсил",
      activeIcon: magicBallUrl,
      inactiveIcon: magicBallInactiveUrl,
      tooltip: superPowerUsedUrl,
    },
    2: {
      id: 2,
      name: "Сложный режим",
      activeIcon: puzzleUrl,
      inactiveIcon: puzzleInactiveUrl,
      tooltip: hardModeUrl,
    },
  };

  useEffect(() => {
    getLeaders()
      .then(data => {
        console.log("API", data);
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
          <div className={styles.achievement}>Достижение</div>
          <div className={styles.time}>Время</div>
        </div>
        {sortedLeaders.map((leader, index) => {
          return (
            <div key={`${leader.id || leader.name}-${index}`} className={styles.line}>
              <div className={styles.position}>{index + 1}</div>
              <div className={styles.user}>{leader.name}</div>
              <div className={styles.achievement}>
                {Object.values(achievements).map(achievement => (
                  <div className={styles.tooltipContainer} key={achievement.id}>
                    <img
                      className={styles.achievementImage}
                      src={
                        leader.achievements?.includes(achievement.id)
                          ? achievement.activeIcon
                          : achievement.inactiveIcon
                      }
                      alt={achievement.name}
                    />
                    {leader.achievements?.includes(achievement.id) && (
                      <div className={styles.tooltip}>
                        <img
                          src={achievement.tooltip}
                          alt={`Подсказка ${achievement.name}`}
                          className={styles.tooltipImage}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className={styles.time}>{formatTime(leader.time)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
