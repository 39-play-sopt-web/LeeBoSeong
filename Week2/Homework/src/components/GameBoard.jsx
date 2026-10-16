import styled from '@emotion/styled';

function GameBoard({ numbers, nextNumber, onNumberClick }) {
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

          if (number === 0) {
            buttonText = '';
            buttonClass = 'empty';
          }

          return (
            <NumberButton
              key={index}
              type="button"
              className={buttonClass}
              disabled={number === 0}
              onClick={function () {
                onNumberClick(index);
              }}
            >
              {buttonText}
            </NumberButton>
          );
        })}
      </Board>
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
    color: #286c58;
  }
`;

const Board = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  max-width: 400px;
  margin: 0 auto;
`;

const NumberButton = styled.button`
  aspect-ratio: 1;
  border: 1px solid #cadbd2;
  border-radius: 10px;
  background-color: white;
  color: #243b35;
  font-size: 32px;
  font-weight: bold;
  cursor: pointer;

  &:active {
    background-color: #e0f0e8;
    transform: scale(0.94);
  }

  &.empty {
    visibility: hidden;
  }
`;
