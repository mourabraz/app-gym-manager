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

export const List = styled.table`
  background: #fff;
  border-collapse: collapse;

  thead tr {
    th {
      padding: 10px 15px;
    }
  }

  tbody tr {
    td {
      padding: 5px 10px;
    }

    td:first-child {
      border-top-left-radius: 20px;
      border-bottom-left-radius: 20px;
    }

    td:last-child {
      border-top-right-radius: 20px;
      border-bottom-right-radius: 20px;
    }

    &:hover {
      background: #ccc;
    }
  }

  .text-center {
    text-align: center;
  }

  .text-right {
    text-align: right;
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
