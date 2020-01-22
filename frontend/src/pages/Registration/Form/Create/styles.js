import styled, { keyframes, css } from 'styled-components';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const Container = styled.div``;

export const Content = styled.section`
  background: #fefefe;
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
    }

    hr {
      margin: 7px 0;
      border-top: 1px solid #ccc;
    }

    div.content {
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
export const Buttons = styled.div`
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

    &[disabled] {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;

export const ButtonClose = styled.button`
  background: var(--text-color-light);

  &:hover {
    background: var(--text-color-dark);
  }

  &[disabled]:hover {
    background: var(--text-color-light);
  }
`;

export const ButtonSave = styled.button`
  background: var(--color-primary);

  ${props =>
    props.saving &&
    css`
      svg {
        animation: ${rotate} 2s linear infinite;
      }
    `}

  &:hover {
    background: var(--color-primary-dark);
  }

  &[disabled]:hover {
    background: var(--color-primary);
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
