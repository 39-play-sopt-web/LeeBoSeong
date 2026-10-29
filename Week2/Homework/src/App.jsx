import { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import Header from './components/Header.jsx';
import GameBoard from './components/GameBoard.jsx';
import Ranking from './components/Ranking.jsx';

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
  const savedRecords = localStorage.getItem('numberGameRecords');

  if (savedRecords === null) {
    return [];
  }

  return JSON.parse(savedRecords);
}

function App() {
  const [selectedMenu, setSelectedMenu] = useState('game');

  // 처음에 9칸에 들어 있는 숫자. 섞인 1 ~ 9
  const [numbers, setNumbers] = useState(function () {
    return shuffleNumbers(createNumbers(1, 9));
  });

  // 새로 들어갈 숫자들.
  const [remainingNumbers, setRemainingNumbers] = useState(function () {
    return shuffleNumbers(createNumbers(10, 18));
  });
  const [nextNumber, setNextNumber] = useState(1);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [records, setRecords] = useState(loadRecords);

  const startTime = useRef(0);
  const timer = useRef(null);

  useEffect(function () {
    return function () {
      clearInterval(timer.current);
    };
  }, []);

  function resetGame() {
    clearInterval(timer.current);
    startTime.current = 0;
    setNumbers(shuffleNumbers(createNumbers(1, 9)));
    setRemainingNumbers(shuffleNumbers(createNumbers(10, 18)));
    setNextNumber(1);
    setElapsedTime(0);
  }

  function handleNumberClick(index) {
    const number = numbers[index];

    if (number !== nextNumber) {
      return;
    }

    if (number === 1) {
      startTime.current = Date.now();
      timer.current = setInterval(function () {
        setElapsedTime((Date.now() - startTime.current) / 1000);
      }, 10);
    }

    if (number === 18) {
      clearInterval(timer.current);
      const finishedAt = Date.now();
      const playTime = (finishedAt - startTime.current) / 1000;
      const newRecord = { playedAt: finishedAt, level: 1, time: playTime };
      const newRecords = [...records, newRecord];

      setRecords(newRecords);
      localStorage.setItem('numberGameRecords', JSON.stringify(newRecords));
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
      newNumbers[index] = 0;
    }

    // 남은 숫자와 새 숫자, 빈 칸을 포함해 게임판 전체를 다시 섞습니다.
    setNumbers(shuffleNumbers(newNumbers));
    setNextNumber(nextNumber + 1);
  }

  function handleRecordsReset() {
    localStorage.removeItem('numberGameRecords');
    setRecords([]);
  }

  let content;

  if (selectedMenu === 'game') {
    content = (
      <GameBoard
        numbers={numbers}
        nextNumber={nextNumber}
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
