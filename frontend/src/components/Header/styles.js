import styled from 'styled-components';

export const Container = styled.div`
  background: #fff;
  padding: 0 30px;
`;

export const Content = styled.div`
  height: 64px;
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;

  nav {
    display: flex;
    align-items: center;

    & > :first-child {
      border-right: 1px solid #ccc;
      padding-right: 20px;
      margin-right: 20px;
    }

    a {
      font-weight: bold;
      color: var(--text-color-light);
      text-transform: uppercase;
      display: flex;
      justify-content: center;
      align-items: center;

      & + a {
        padding-left: 20px;
      }

      span.logo {
        margin: 0 auto;
        width: 60px;
        img {
          width: 28px;
          display: inline-block;
          position: relative;
          top: 2px;
          left: 8px;
        }

        img + img {
          width: 28px;
          display: inline-block;
          position: relative;
          top: 2px;
          left: -8px;
        }
      }

      span.logoText {
        font-size: 15px;
        font-weight: bold;
        color: var(--color-primary);
      }

      &.active {
        color: var(--text-color);
      }
    }
  }
  aside {
    display: flex;
    align-items: center;
  }
`;

export const ButtonBox = styled.div`
  display: flex;
  margin-left: 20px;
  padding-left: 20px;
  border-left: 1px solid #ccc;
  button {
    border: none;
    border-radius: 4px;
    padding: 10px 20px;
    color: #fff;
    background: var(--color-primary);
    &:hover {
      background: var(--color-primary-dark);
    }
  }
`;
