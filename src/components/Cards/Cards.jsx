import { shuffle } from "lodash";
import { useEffect, useState } from "react";
import { generateDeck } from "../../utils/cards";
import styles from "./Cards.module.css";
import { EndGameModal } from "../../components/EndGameModal/EndGameModal";
import { Button } from "../../components/Button/Button";
import { Card } from "../../components/Card/Card";

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

export function Cards({ pairsCount = 3, previewSeconds = 5, mistakeMode = false }) {
  const [cards, setCards] = useState([]);
  const [status, setStatus] = useState(STATUS_PREVIEW);
  const [mistakes, setMistakes] = useState(0);
  const [previewCountdown, setPreviewCountdown] = useState(previewSeconds);
  const [gameStartDate, setGameStartDate] = useState(null);
  const [gameEndDate, setGameEndDate] = useState(null);
  const [timer, setTimer] = useState({ seconds: 0, minutes: 0 });

  function finishGame(status = STATUS_LOST) {
    setGameEndDate(new Date());
    setStatus(status);
  }

  function startGame() {
    setGameStartDate(new Date());
    setGameEndDate(null);
    setStatus(STATUS_IN_PROGRESS);
  }

  function resetGame() {
    setCards([]);
    setStatus(STATUS_PREVIEW);
    setMistakes(0);
    setPreviewCountdown(previewSeconds); // Сброс обратного отсчёта
    setGameStartDate(null);
    setGameEndDate(null);
    setTimer({ minutes: 0, seconds: 0 });
  }

  const openCard = clickedCard => {
    // Если карта уже открыта, ничего не делаем
    if (clickedCard.open) return;

    // Обновляем состояние карт: открываем кликнутую карту
    const nextCards = cards.map(card => (card.id === clickedCard.id ? { ...card, open: true } : card));
    setCards(nextCards);

    // Открытые карты на игровом поле
    const openCards = nextCards.filter(card => card.open);

    // Проверяем совпадение: есть ли пара
    const unmatched = openCards.filter(
      card => openCards.filter(c => c.suit === card.suit && c.rank === card.rank).length < 2,
    );

    if (!mistakeMode) {
      // Обычный режим: если пара не совпала, игра заканчивается
      if (unmatched.length >= 2) {
        finishGame(STATUS_LOST);
        return;
      }
    } else {
      // Режим с ошибками: увеличиваем счётчик ошибок
      if (unmatched.length >= 2) {
        setMistakes(prev => {
          const newMistakes = prev + 1;
          if (newMistakes >= 3) finishGame(STATUS_LOST);
          return newMistakes;
        });
      }
    }

    // Проверяем победу: все карты открыты
    const isPlayerWon = nextCards.every(card => card.open);
    if (isPlayerWon) {
      finishGame(STATUS_WON);
    }
  };

  useEffect(() => {
    if (status !== STATUS_PREVIEW) return;

    if (pairsCount > 36) {
      alert("Столько пар сделать невозможно");
      return;
    }

    const deck = shuffle(generateDeck(pairsCount, 10));
    setCards(deck);

    // Таймер обратного отсчёта
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

      {status === STATUS_LOST && (
        <div className={styles.modalContainer}>
          <EndGameModal
            isWon={false}
            gameDurationSeconds={timer.seconds}
            gameDurationMinutes={timer.minutes}
            onClick={resetGame}
          />
        </div>
      )}

      {status === STATUS_WON && (
        <div className={styles.modalContainer}>
          <EndGameModal
            isWon={true}
            gameDurationSeconds={timer.seconds}
            gameDurationMinutes={timer.minutes}
            onClick={resetGame}
          />
        </div>
      )}
    </div>
  );
}
