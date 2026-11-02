import { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import Header from './components/Header.jsx';
import GameBoard from './components/GameBoard.jsx';
import Ranking from './components/Ranking.jsx';
import { CELL_COUNT, EMPTY_CELL, LAST_NUMBER, LEVEL } from './constants/game.js';

const RECORDS_STORAGE_KEY = 'numberGameRecords';
const ERROR_FEEDBACK_DURATION_MS = 700;

function createNumbers(start, end) {
  const numbers = [];

  for (let number = start; number <= end; number++) {
    numbers.push(number);
  }

  return numbers;
}

// 배열을 복사한 뒤, 뒤에서부터 임의의 위치와 자리를 바꿉니다.
function shuffleNumbers(numbers) {
  const shuffledNumbers = [...numbers];

  for (let index = shuffledNumbers.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    const temp = shuffledNumbers[index];
    shuffledNumbers[index] = shuffledNumbers[randomIndex];
    shuffledNumbers[randomIndex] = temp;
  }

  return shuffledNumbers;
}

function loadRecords() {
  try {
    const savedRecords = localStorage.getItem(RECORDS_STORAGE_KEY);

    if (savedRecords === null) {
      return [];
    }

    const parsedRecords = JSON.parse(savedRecords);

    if (!Array.isArray(parsedRecords)) {
      return [];
    }

    return parsedRecords.filter(function (record) {
      if (record === null || typeof record !== 'object') {
        return false;
      }

      return (
        Number.isFinite(record.playedAt) &&
        Number.isFinite(new Date(record.playedAt).getTime()) &&
        Number.isInteger(record.level) && record.level > 0 &&
        Number.isFinite(record.time) && record.time >= 0
      );
    });
  } catch {
    return [];
  }
}

function App() {
  const [selectedMenu, setSelectedMenu] = useState('game');

  // 게임판 칸 수만큼 앞쪽 숫자를 섞어 표시합니다.
  const [numbers, setNumbers] = useState(function () {
    return shuffleNumbers(createNumbers(1, CELL_COUNT));
  });

  // 새로 들어갈 숫자들.
  const [remainingNumbers, setRemainingNumbers] = useState(function () {
    return shuffleNumbers(createNumbers(CELL_COUNT + 1, LAST_NUMBER));
  });
  const [nextNumber, setNextNumber] = useState(1);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [records, setRecords] = useState(loadRecords);
  const [wrongIndex, setWrongIndex] = useState(null);

  const startTime = useRef(0);
  const timer = useRef(null);
  const feedbackTimer = useRef(null);

  useEffect(function () {
    return function () {
      clearInterval(timer.current);
      clearTimeout(feedbackTimer.current);
    };
  }, []);

  function resetGame() {
    clearInterval(timer.current);
    clearTimeout(feedbackTimer.current);
    startTime.current = 0;
    setNumbers(shuffleNumbers(createNumbers(1, CELL_COUNT)));
    setRemainingNumbers(shuffleNumbers(createNumbers(CELL_COUNT + 1, LAST_NUMBER)));
    setNextNumber(1);
    setElapsedTime(0);
    setWrongIndex(null);
  }

  function handleNumberClick(index) {
    const number = numbers[index];

    if (number !== nextNumber) {
      clearTimeout(feedbackTimer.current);
      setWrongIndex(index);
      feedbackTimer.current = setTimeout(function () {
        setWrongIndex(null);
      }, ERROR_FEEDBACK_DURATION_MS);
      return;
    }

    clearTimeout(feedbackTimer.current);
    setWrongIndex(null);

    if (number === 1) {
      startTime.current = Date.now();
      timer.current = setInterval(function () {
        setElapsedTime((Date.now() - startTime.current) / 1000);
      }, 10);
    }

    if (number === LAST_NUMBER) {
      clearInterval(timer.current);
      const finishedAt = Date.now();
      const playTime = (finishedAt - startTime.current) / 1000;
      const newRecord = { playedAt: finishedAt, level: LEVEL, time: playTime };
      const newRecords = [...records, newRecord];

      setRecords(newRecords);
      localStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(newRecords));
      alert('게임 종료. 걸린 시간: ' + playTime.toFixed(2) + 's');
      resetGame();
      return;
    }

    // state 배열을 직접 수정하지 않고 복사해서 바꿉니다.
    const newNumbers = [...numbers];

    if (remainingNumbers.length > 0) {
      newNumbers[index] = remainingNumbers[0];
      setRemainingNumbers(remainingNumbers.slice(1));
    } else {
      newNumbers[index] = EMPTY_CELL;
    }

    // 남은 숫자와 새 숫자, 빈 칸을 포함해 게임판 전체를 다시 섞습니다.
    setNumbers(shuffleNumbers(newNumbers));
    setNextNumber(nextNumber + 1);
  }

  function handleRecordsReset() {
    localStorage.removeItem(RECORDS_STORAGE_KEY);
    setRecords([]);
  }

  let content;

  if (selectedMenu === 'game') {
    content = (
      <GameBoard
        numbers={numbers}
        nextNumber={nextNumber}
        wrongIndex={wrongIndex}
        onNumberClick={handleNumberClick}
      />
    );
  } else {
    content = <Ranking records={records} onReset={handleRecordsReset} />;
  }

  return (
    <>
      <Header
        selectedMenu={selectedMenu}
        onMenuChange={setSelectedMenu}
        elapsedTime={elapsedTime}
      />
      <Main>
        {content}
      </Main>
    </>
  );
}

export default App;

const Main = styled.main`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 48px 20px;
`;
