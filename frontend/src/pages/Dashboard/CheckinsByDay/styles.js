import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  border-radius: 4px;
  padding: 30px;

  header {
    align-self: flex-start;
    margin-bottom: 16px;

    h2 {
      span {
        font-size: 1.2rem;
        font-weight: normal;
      }
    }
  }
`;

export const BoxGrid = styled.div`
  /* height: 15vh; */
  margin: 0;
  display: grid;
  grid-template:
    [row1-start] 'month1' [row1-end]
    [row2-start] 'month1' [row2-end]
    [row3-start] 'month1' [row3-end]
    [row4-start] 'month1' [row4-end]
    [row5-start] 'month2' [row5-end]
    [row6-start] 'month2' [row6-end]
    [row7-start] 'month2' [row7-end]
    [row8-start] 'month2' [row8-end]
    [row9-start] 'month3' [row9-end]
    [row10-start] 'month3' [row10-end]
    [row11-start] 'month3' [row11-end]
    [row12-start] 'month3' [row12-end];
  grid-template-columns: 100px 60px 60px 60px 60px 60px 60px 60px;
  grid-template-rows: 60px 60px 60px 60px 60px 60px 60px 60px 60px 60px 60px 60px;

  .month {
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--text-color-light);
  }

  .month1 {
    grid-area: month1;
  }

  .month2 {
    grid-area: month2;
  }

  .month3 {
    grid-area: month3;
  }
`;

export const Day = styled.div`
  position: relative;
  background: white;
  border: solid 1px rgba(0, 0, 0, 0.3);
  font-size: 1rem;
  color: var(--text-color-light);
  padding: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const CheckinInfo = styled.div`
  margin-top: 7px;

  span {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: var(--color-primary);
    font-size: 0.85rem;
    color: #fff;
  }
`;

export const EmptyList = styled.div`
  min-height: 250px;
  margin-top: 15px;
  background: #fff;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  p {
    color: var(--text-color-light);
  }
`;
