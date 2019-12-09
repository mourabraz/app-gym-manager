import styled from 'styled-components';

export const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Content = styled.div`
  background: #fff;
  width: 100%;
  max-width: 350px;
  text-align: center;
  border-radius: 4px;
  padding: 40px 30px;
  form {
    display: flex;
    flex-direction: column;
    margin-top: 30px;
    label {
      text-transform: uppercase;
      font-weight: bold;
      text-align: left;
    }
    input + label {
      margin-top: 15px;
    }
    input {
      border: solid 1px #ccc;
      border-radius: 4px;
      height: 44px;
      padding: 0 15px;
      color: var(--text-color);
      margin: 5px 0;
      &::placeholder {
        color: var(--text-color-light);
      }
    }
    span {
      color: var(--color-error);
      align-self: flex-start;
      margin: 0 0 10px;
      font-weight: bold;
    }
    button {
      margin: 20px 0 0;
      height: 44px;
      background: var(--color-primary);
      font-weight: bold;
      color: #fff;
      border: 0;
      border-radius: 4px;
      font-size: 16px;
      transition: background 0.2s;
      &:hover {
        background: var(--color-primary-dark);
      }
    }
  }
`;
