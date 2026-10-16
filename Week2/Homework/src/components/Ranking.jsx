import styled from '@emotion/styled';

function Ranking({ records, onReset }) {
  const sortedRecords = [...records].sort(function (first, second) {
    return first.time - second.time;
  });

  let rankingContent;

  if (records.length === 0) {
    rankingContent = <EmptyMessage>기록 없음.</EmptyMessage>;
  } else {
    rankingContent = (
      <Table>
        <thead>
          <tr>
            <th scope="col">순위</th>
            <th scope="col">레벨</th>
            <th scope="col">플레이 시간</th>
            <th scope="col">플레이 일시</th>
          </tr>
        </thead>
        <tbody>
          {sortedRecords.map(function (record, index) {
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>Level {record.level}</td>
                <td>{record.time.toFixed(2)}초</td>
                <td>{record.playedAt}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  }

  return (
    <section>
      <RankingHeader>
        <Title>플레이 기록</Title>
        <ResetButton type="button" onClick={onReset}>
          기록 초기화
        </ResetButton>
      </RankingHeader>
      {rankingContent}
    </section>
  );
}

export default Ranking;

const RankingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 26px;
`;

const ResetButton = styled.button`
  padding: 6px 10px;
  border: 1px solid #cadbd2;
  border-radius: 6px;
  background-color: white;
  color: #65776f;

  cursor: pointer;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  text-align: center;
  font-size: 14px;

  th {
    padding: 16px 8px;
    border-bottom: 1px solid #d7e6df;
    background-color: #e0f0e8;
  }

  td {
    padding: 16px 8px;
    border-bottom: 1px solid #d7e6df;
  }
`;

const EmptyMessage = styled.p`
  margin: 0;
  padding: 64px 16px;
  background-color: white;
  color: #65776f;
  text-align: center;
`;
