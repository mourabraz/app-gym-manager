import styled from 'styled-components';

export const Container = styled.div`
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow: auto;
  background: rgb(0, 0, 0);
  background: rgba(0, 0, 0, 0.6);
`;

export const ModalContent = styled.section`
  position: relative;
  background: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  border-radius: 4px;
  width: 80%;
  max-width: 700px;
  height: auto;

  display: flex;
  flex-direction: column;

  form {
    padding: 0;

    header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      h1 {
        font-size: 2.4rem;
      }

      .buttons {
        display: flex;
        justify-content: center;
        align-items: center;

        button {
          svg {
            margin-right: 10px;
          }

          border: 0;
          padding: 0 10px;
          margin-left: 10px;
          border-radius: 4px;
          color: #fff;
          font-size: 1.2rem;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 36px;
        }

        button.save {
          background: var(--color-primary);

          &:hover {
            background: var(--color-primary-dark);
          }
        }

        button.close {
          background: var(--text-color-light);

          &:hover {
            background: var(--text-color-dark);
          }
        }
      }
    }

    hr {
      margin: 7px 0;
      border-top: 1px solid #ccc;
    }

    div.content {
      padding: 30px;

      label {
        display: block;
        text-transform: uppercase;
        font-weight: bold;
        margin-top: 20px;
      }

      input {
        width: 100%;
        border: 1px solid #eee;
        padding: 10px 15px;
        border-radius: 4px;
        margin-top: 5px;
        margin-bottom: 3px;
      }

      > span {
        margin-left: 10px;
        font-size: 1.2rem;
        font-stretch: italic;
        text-transform: none;
        color: var(--color-error);
      }
    }
  }
`;

export const DivBoxRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

export const DivBoxColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  max-width: 200px;

  label {
    display: block;
    align-self: flex-start;

    span {
      text-transform: none;

      &.age {
        margin-left: 25px;
        font-weight: normal;
      }
    }
  }

  & + div {
    padding-left: 20px;
  }
`;
