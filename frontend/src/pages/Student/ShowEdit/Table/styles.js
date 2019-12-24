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

    span {
      font-size: 1.4rem;
      font-weight: normal;
      margin-left: 15px;
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
  grid-template-columns: 100px 40px 40px 40px 40px 40px 40px 40px;
  grid-template-rows: 40px 40px 40px 40px 40px 40px 40px 40px 40px 40px 40px 40px;

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
  position: relative;
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

  &:hover {
    div:first-child {
      display: block;
    }
  }
`;

export const DayPopover = styled.div`
  display: none;
  position: absolute;
  width: 100px;
  left: 50%;
  bottom: 40px; /* calc(100%);*/
  background: var(--color-primary);
  border-radius: 4px;
  padding: 5px;
  z-index: 100;
  border: solid 1px var(--color-primary);
  color: white;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    bottom: -10px;
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 10px solid var(--color-primary);
  }

  span {
    display: block;
    line-height: 2;
  }
`;

export const CheckinInfo = styled.div`
  margin-top: 7px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  ${props =>
    props.checkins.map(
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
