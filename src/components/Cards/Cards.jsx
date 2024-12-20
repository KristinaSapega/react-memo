import { shuffle } from "lodash";
import { useEffect, useState } from "react";
import { generateDeck } from "../../utils/cards";
import styles from "./Cards.module.css";
import { EndGameModal } from "../../components/EndGameModal/EndGameModal";
import { Button } from "../../components/Button/Button";
import { Card } from "../../components/Card/Card";
import { useGameMode } from "../../contexts/GameModeContext";
import { LeaderboardModal } from "../LeaderboardModal/LeaderboardModal";
import insightUrl from "./images/eye.png";
import insightTooltipUrl from "./images/eye_tooltip.png";

// Игра закончилась
const STATUS_LOST = "STATUS_LOST";
const STATUS_WON = "STATUS_WON";
// Идет игра: карты закрыты, игрок может их открыть
const STATUS_IN_PROGRESS = "STATUS_IN_PROGRESS";
// Начало игры: игрок видит все карты в течение нескольких секунд
const STATUS_PREVIEW = "STATUS_PREVIEW";

function getTimerValue(startDate, endDate) {
  if (!startDate && !endDate) {
    return { minutes: 0, seconds: 0 };
  }

  if (!endDate) endDate = new Date();

  const diffInSeconds = Math.floor((endDate.getTime() - startDate.getTime()) / 1000);
  const minutes = Math.floor(diffInSeconds / 60);
  const seconds = diffInSeconds % 60;

  return { minutes, seconds };
}

export function Cards({ pairsCount = 3, previewSeconds = 5 }) {
  const [cards, setCards] = useState([]);
  const [status, setStatus] = useState(STATUS_PREVIEW);
  const [previewCountdown, setPreviewCountdown] = useState(previewSeconds);
  const [gameStartDate, setGameStartDate] = useState(null);
  const [gameEndDate, setGameEndDate] = useState(null);
  const [timer, setTimer] = useState({ seconds: 0, minutes: 0 });
  const [currentPair, setCurrentPair] = useState([]); // Хранит пару открытых карт
  const { mistakeMode, mistakes, addMistake, resetMistakes } = useGameMode();
  const [currentModal, setCurrentModal] = useState(null); // Управление модальными окнами
  const [superPowerUsed, setSuperPowerUsed] = useState(false);

  function activateSuperPower() {
    if (superPowerUsed || status !== STATUS_IN_PROGRESS) return;

    setSuperPowerUsed(true);
    const pausedTime = new Date();
    setGameEndDate(pausedTime);

    // Открыть все карты
    const allOpenCards = cards.map(card => ({ ...card, open: true }));
    setCards(allOpenCards);

    // Возвращаем скрытие ненайденных карт
    setTimeout(() => {
      const resetCards = allOpenCards.map(
        card => (card.matched ? card : { ...card, open: false }), // Закрываем только ненайденные карты
      );
      setCards(resetCards);

      const timePaused = new Date().getTime() - pausedTime.getTime();
      setGameStartDate(prev => new Date(prev.getTime() + timePaused)); // Продолжаем таймер с учётом паузы
      setGameEndDate(null); // Снимаем остановку таймера
    }, 5000);
  }

  function finishGame(status = STATUS_LOST) {
    setGameEndDate(new Date());
    setStatus(status);

    if (status === "STATUS_WON") {
      setCurrentModal(pairsCount === 9 ? "leaderboard" : "victory");
    } else {
      setCurrentModal("defeat");
    }
  }

  function startGame() {
    setGameStartDate(new Date());
    setGameEndDate(null);
    setStatus(STATUS_IN_PROGRESS);
  }

  function resetGame() {
    setCards([]);
    setStatus(STATUS_PREVIEW);
    setPreviewCountdown(previewSeconds); // Сброс обратного отсчёта
    setGameStartDate(null);
    setGameEndDate(null);
    setTimer({ minutes: 0, seconds: 0 });
    resetMistakes(); // Сброс ошибок
    setCurrentModal(null); // Закрыть модальное окно
    setSuperPowerUsed(false); // Сбрасываем суперсилу
  }

  const openCard = clickedCard => {
    if (clickedCard.open || currentPair.some(card => card.id === clickedCard.id)) return;

    const nextCards = cards.map(card => (card.id === clickedCard.id ? { ...card, open: true } : card));
    setCards(nextCards);

    const updatedPair = [...currentPair, clickedCard];

    if (updatedPair.length === 2) {
      const [firstCard, secondCard] = updatedPair;

      if (firstCard.suit === secondCard.suit && firstCard.rank === secondCard.rank) {
        // Помечаем пары как найденные
        const matchedCards = nextCards.map(card =>
          card.id === firstCard.id || card.id === secondCard.id ? { ...card, matched: true } : card,
        );
        setCards(matchedCards);
        setCurrentPair([]);
        const isPlayerWon = matchedCards.every(card => card.matched);
        if (isPlayerWon) finishGame(STATUS_WON);
      } else {
        setTimeout(() => {
          const closedCards = nextCards.map(card =>
            card.id === firstCard.id || card.id === secondCard.id ? { ...card, open: false } : card,
          );
          setCards(closedCards);
          setCurrentPair([]);
          if (mistakeMode) {
            addMistake();
            if (mistakes + 1 >= 3) finishGame(STATUS_LOST);
          } else {
            finishGame(STATUS_LOST);
          }
        }, 1000);
      }
    } else {
      setCurrentPair(updatedPair);
    }
  };

  useEffect(() => {
    if (status !== STATUS_PREVIEW) return;

    const deck = shuffle(generateDeck(pairsCount, 10));
    setCards(deck);

    const countdownInterval = setInterval(() => {
      setPreviewCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          startGame();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [status, pairsCount, previewSeconds]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer(getTimerValue(gameStartDate, gameEndDate));
    }, 300);
    return () => clearInterval(intervalId);
  }, [gameStartDate, gameEndDate]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.timer}>
          {status === STATUS_PREVIEW ? (
            <div>
              <p className={styles.previewText}>Запоминайте пары!</p>
              <p className={styles.previewDescription}>Игра начнется через {previewCountdown} секунд</p>
            </div>
          ) : (
            <>
              <div className={styles.timerValue}>
                <div className={styles.timerDescription}>min</div>
                <div>{timer.minutes.toString().padStart(2, "0")}</div>
              </div>
              .
              <div className={styles.timerValue}>
                <div className={styles.timerDescription}>sec</div>
                <div>{timer.seconds.toString().padStart(2, "0")}</div>
              </div>
            </>
          )}
        </div>
        {mistakeMode && <div className={styles.mistakes}>Осталось попыток: {3 - mistakes}</div>}
        {status === STATUS_IN_PROGRESS && !superPowerUsed ? (
          <div className={styles.powerBox} onClick={activateSuperPower}>
            <div className={styles.tooltipContainer}>
              <img className={styles.power} src={insightUrl} alt="insight-power" />
              <div className={styles.tooltip}>
                <img className={styles.tooltipImage} src={insightTooltipUrl} alt="tooltip" />
              </div>
            </div>
          </div>
        ) : null}
        {status === STATUS_IN_PROGRESS && <Button onClick={resetGame}>Начать заново</Button>}
      </div>

      <div className={styles.cards}>
        {cards.map(card => (
          <Card
            key={card.id}
            onClick={() => openCard(card)}
            open={status !== STATUS_IN_PROGRESS ? true : card.open}
            suit={card.suit}
            rank={card.rank}
          />
        ))}
      </div>

      {currentModal === "leaderboard" && (
        <LeaderboardModal
          time={timer.minutes * 60 + timer.seconds}
          superPowerUsed={superPowerUsed}
          hardMode={pairsCount === 9}
        />
      )}
      {currentModal === "victory" && (
        <EndGameModal
          isWon={true}
          gameDurationSeconds={timer.seconds}
          gameDurationMinutes={timer.minutes}
          onClick={resetGame}
        />
      )}
      {currentModal === "defeat" && (
        <EndGameModal
          isWon={false}
          gameDurationSeconds={timer.seconds}
          gameDurationMinutes={timer.minutes}
          onClick={resetGame}
        />
      )}
    </div>
  );
}
