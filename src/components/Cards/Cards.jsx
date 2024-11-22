import { shuffle } from "lodash";
import { useEffect, useState } from "react";
import { generateDeck } from "../../utils/cards";
import styles from "./Cards.module.css";
import { EndGameModal } from "../../components/EndGameModal/EndGameModal";
import { Button } from "../../components/Button/Button";
import { Card } from "../../components/Card/Card";
import { useGameMode } from "../../contexts/GameModeContext";

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
    setPreviewCountdown(previewSeconds); // Сброс обратного отсчёта
    setGameStartDate(null);
    setGameEndDate(null);
    setTimer({ minutes: 0, seconds: 0 });
    resetMistakes(); // Сброс ошибок через контекст
  }

  const openCard = clickedCard => {
    // Если карта уже открыта или уже выбрана для проверки, ничего не делаем
    if (clickedCard.open || currentPair.some(card => card.id === clickedCard.id)) return;

    // Открываем кликнутую карту
    const nextCards = cards.map(card => (card.id === clickedCard.id ? { ...card, open: true } : card));
    setCards(nextCards);

    const updatedPair = [...currentPair, clickedCard];

    if (updatedPair.length === 2) {
      // Если открыта пара карт
      const [firstCard, secondCard] = updatedPair;

      if (firstCard.suit === secondCard.suit && firstCard.rank === secondCard.rank) {
        // Карты совпали
        setCurrentPair([]); // Сбрасываем текущую пару
        const isPlayerWon = nextCards.every(card => card.open); // Проверяем, выиграл ли игрок
        if (isPlayerWon) finishGame(STATUS_WON);
      } else {
        // Карты не совпали
        setTimeout(() => {
          // Закрываем обе карты
          const closedCards = nextCards.map(card =>
            card.id === firstCard.id || card.id === secondCard.id ? { ...card, open: false } : card,
          );
          setCards(closedCards);
          setCurrentPair([]); // Сбрасываем текущую пару

          if (mistakeMode) {
            // Если включен режим ошибок
            addMistake();
            if (mistakes + 1 >= 3) {
              finishGame(STATUS_LOST);
            }
          } else {
            // Если режим ошибок выключен, игра заканчивается сразу
            finishGame(STATUS_LOST);
          }
        }, 1000); // Задержка для показа несоответствия
      }
    } else {
      // Сохраняем текущую пару, если открыта только одна карта
      setCurrentPair(updatedPair);
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
