import styled from '@emotion/styled';
import { BOARD_SIZE, EMPTY_CELL } from '../constants/game.js';

function GameBoard({ numbers, nextNumber, wrongIndex, onNumberClick }) {
  return (
    <GameSection>
      <Title>숫자 순서대로 클릭하기</Title>
      <NextNumber>
        다음 숫자 <strong>{nextNumber}</strong>
      </NextNumber>
      <Board>
        {numbers.map(function (number, index) {
          let buttonText = number;
          let buttonClass = '';

          if (number === EMPTY_CELL) {
            buttonText = '';
            buttonClass = 'empty';
          } else if (index === wrongIndex) {
            buttonClass = 'wrong';
          }

          return (
            <NumberButton
              key={index}
              type="button"
              className={buttonClass}
              disabled={number === EMPTY_CELL}
              onClick={function () {
                onNumberClick(index);
              }}
            >
              {buttonText}
            </NumberButton>
          );
        })}
      </Board>
      <Feedback role="status">
        {wrongIndex !== null && `다음 숫자 ${nextNumber}부터 눌러 주세요.`}
      </Feedback>
    </GameSection>
  );
}

export default GameBoard;

const GameSection = styled.section`
  text-align: center;
`;

const Title = styled.h1`
  margin: 0 0 12px;
  font-size: 26px;
`;

const NextNumber = styled.p`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin: 28px 0 20px;

  strong {
    font-size: 32px;
    color: var(--color-primary);
  }
`;

const Board = styled.div`
  display: grid;
  grid-template-columns: repeat(${BOARD_SIZE}, 1fr);
  gap: 12px;
  max-width: 400px;
  margin: 0 auto;
`;

const NumberButton = styled.button`
  aspect-ratio: 1;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background-color: var(--color-surface);
  color: var(--color-text);
  font-size: 32px;
  font-weight: bold;
  cursor: pointer;

  &:active {
    background-color: var(--color-primary-light);
    transform: scale(0.94);
  }

  &.empty {
    visibility: hidden;
  }

  &.wrong {
    border-color: var(--color-danger);
    background-color: var(--color-danger-light);
    color: var(--color-danger);
  }
`;

const Feedback = styled.p`
  min-height: 24px;
  margin: 16px 0 0;
  color: var(--color-danger);
`;
