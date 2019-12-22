import styled, { css } from 'styled-components';

export const Container = styled.div`
  background: #fff;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;

  h2 {
    align-self: flex-start;
    margin-bottom: 15px;
  }
`;

export const BoxGrid = styled.div`
  /* height: 15vh; */
  margin: 0;
  display: grid;
  grid-template:
    [row1-start] 'month1' [row1-end]
    [row2-start] 'month1' [row2-end]
    [row3-start] 'month2' [row3-end]
    [row4-start] 'month2' [row4-end]
    [row5-start] 'month2' [row5-end]
    [row6-start] 'month3' [row6-end]
    [row7-start] 'month3' [row7-end];
  grid-template-columns: 100px 40px 40px 40px 40px 40px 40px 40px 40px 40px 40px 40px 40px;
  grid-template-rows: 40px 40px 40px 40px 40px 40px 40px;

  .month {
    display: flex;
    justify-content: center;
    align-items: center;
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
  /* position: relative; */
  background: white;
  border: solid 1px rgba(0, 0, 0, 0.3);
  font-size: 1rem;
  color: var(--text-color-light);
  text-align: center;
  padding: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const CheckinInfo = styled.div`
  margin-top: 7px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  ${props =>
    props.hasCheckins.map(
      () => css`
        &::after {
          width: 8px;
          height: 8px;
          background: var(--color-primary);
          content: '';
          border-radius: 50%;
        }
      `
    )}

  span {
    margin-right: 5px;
    font-size: 0.85rem;
  }
`;
