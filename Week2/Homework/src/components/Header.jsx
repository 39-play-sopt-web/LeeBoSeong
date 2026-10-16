import styled from '@emotion/styled';

function Header({ selectedMenu, onMenuChange, elapsedTime }) {
  let gameClass = '';
  let rankingClass = '';

  if (selectedMenu === 'game') {
    gameClass = 'active';
  } else {
    rankingClass = 'active';
  }

  function handleGameClick() {
    // App의 setSelectedMenu 함수가 호출되는 부분
    onMenuChange('game');
  }

  function handleRankingClick() {
    onMenuChange('ranking');
  }

  let gameInfo = null;

  if (selectedMenu === 'game') {
    gameInfo = (
      <GameInfo>
        <LevelLabel>
          레벨
          <LevelSelect defaultValue="1">
            <option value="1">Level 1</option>
          </LevelSelect>
        </LevelLabel>
        <Timer>시간: {elapsedTime.toFixed(2)}초</Timer>
      </GameInfo>
    );
  }

  return (
    <HeaderBar>
      <HeaderInner>
        <Logo>1 to 50</Logo>
        <Menu>
          <MenuButton
            type="button"
            className={gameClass}
            onClick={handleGameClick}
          >
            게임
          </MenuButton>
          <MenuButton
            type="button"
            className={rankingClass}
            onClick={handleRankingClick}
          >
            랭킹
          </MenuButton>
        </Menu>
        {gameInfo}
      </HeaderInner>
    </HeaderBar>
  );
}

export default Header;

const HeaderBar = styled.header`
  background-color: white;
  border-bottom: 1px solid #d7e6df;
`;

const HeaderInner = styled.div`
  max-width: 1100px;
  min-height: 80px;
  margin: 0 auto;
  padding: 16px 24px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 16px;
`;

const Logo = styled.p`
  margin: 0;
  font-size: 24px;
  font-weight: bold;
`;

const Menu = styled.nav`
  display: flex;
  gap: 8px;
`;

const MenuButton = styled.button`
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  background-color: transparent;
  color: #53665f;
  cursor: pointer;

  &.active {
    background-color: #e0f0e8;
    color: #286c58;
    font-weight: bold;
  }
`;

const GameInfo = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 20px;
`;

const LevelLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
`;

const LevelSelect = styled.select`
  padding: 8px;
  border: 1px solid #cadbd2;
  border-radius: 6px;
  background-color: white;
  color: #243b35;
`;

const Timer = styled.span`
  min-width: 72px;
  text-align: right;
  font-size: 20px;
  font-weight: bold;
`;
