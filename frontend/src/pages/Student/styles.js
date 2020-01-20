import styled from 'styled-components';

export const Content = styled.div`
  padding: 30px;
  max-width: 900px;
  margin: 0 auto;
`;

export const Loading = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h1 {
    font-size: 24px;
  }
`;

export const TableBox = styled.div`
  margin-top: 25px;
  background: #fff;
  border-radius: 4px;
  padding: 30px 15px;

  .text-right {
    text-align: right;
  }
  .text-left {
    text-align: left;
  }
  .text-center {
    text-align: center;
  }

  & div {
    display: flex;
    align-items: center;
    justify-content: space-between;

    p {
      color: var(--text-color-light);

      span {
        + span {
          margin-left: 15px;
        }
      }
    }
  }

  .pagination {
    display: flex;
  }

  table {
    margin-top: 15px;
    width: 100%;
    border-spacing: 0;

    tr {
      line-height: 30px;
    }

    tbody tr {
      &:hover {
        background: #eee;
        color: var(--text-color);
      }

      color: var(--text-color-table);
    }

    th {
      padding: 5px;
      text-transform: uppercase;
      font-weight: bold;

      svg {
        padding-top: 6px;
        cursor: pointer;

        + svg {
          margin-right: 6px;
        }
      }
    }

    td {
      padding: 5px 10px;
      button {
        border: 0;
        background: transparent;
        font-size: 12px;

        + button {
          margin-left: 10px;
        }

        &.edit-button {
          color: var(--color-info-dark);

          &:hover {
            color: var(--color-info);
          }

          &[disabled] {
            color: rgba(0, 0, 0, 0.3);
            cursor: not-allowed;
          }
        }
        &.delete-button {
          color: var(--color-error-dark);
          &:hover {
            color: var(--color-error);
          }

          &[disabled] {
            color: rgba(0, 0, 0, 0.3);
            cursor: not-allowed;
          }
        }
      }
    }
  }
`;

export const ButtonPagination = styled.button`
  display: flex;
  align-items: center;
  flex-direction: row;
  border: 0;
  border-radius: 4px;
  background: var(--color-info);
  color: #fff;

  padding: 0 10px;
  height: 36px;
  font-size: 12px;
  transition: background 0.2s;
  &:hover {
    background: var(--color-info-dark);
  }

  + button {
    margin-left: 15px;
  }

  &[disabled] {
    background: rgba(0, 0, 0, 0.3);
    cursor: not-allowed;
  }
`;

export const EmptyTable = styled.div`
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

export const DivBoxRow = styled.div`
  display: flex;
  align-items: center;

  button {
    svg {
      margin-right: 10px;
    }

    display: flex;
    align-items: center;
    margin: 0 10px 0;
    padding: 0 10px;
    height: 36px;
    background: var(--color-primary);
    color: #fff;
    font-weight: bold;
    font-size: 1.4rem;
    text-transform: uppercase;
    border: 0;
    border-radius: 4px;
    transition: background 0.2s;
    &:hover {
      background: var(--color-primary-dark);
    }
  }

  label.search {
    background: #fff;
    display: flex;
    align-items: center;
    height: 36px;
    padding-left: 10px;
    border: solid 1px #ccc;
    border-radius: 4px;
  }

  input {
    background: transparent;
    border: 0;
    padding: 0 10px 0 5px;
    color: var(--text-color);
    font-size: 14px;
    margin: 5px 0;
    &::placeholder {
      color: var(--text-color-light);
    }
  }
`;

export const Alert = styled.div`
  width: 80%;
  margin: 25px auto 0;
  color: #666;
  background: #fff;
  font-size: 75%;
  border-radius: 4px;
  border: 1px solid red;
  padding: 20px;

  h3 {
    margin-bottom: 10px;
  }
`;
