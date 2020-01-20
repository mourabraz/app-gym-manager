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

export const Content = styled.section`
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
`;
