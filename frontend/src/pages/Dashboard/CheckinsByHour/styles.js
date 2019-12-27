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

export const EmptyGraph = styled.div`
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
