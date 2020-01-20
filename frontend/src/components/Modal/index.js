import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { Container, Content } from './styles';

export default function Modal({ children, visible }) {
  const elRef = useRef(null);
  if (!elRef.current) {
    const div = document.createElement('div');
    elRef.current = div;
  }

  useEffect(() => {
    const modalRoot = document.getElementById('modal');
    modalRoot.appendChild(elRef.current);

    return () => modalRoot.removeChild(elRef.current);
  }, []);

  return createPortal(
    <TransitionGroup component={null}>
      {visible && (
        <CSSTransition classNames="dialog" timeout={300}>
          <Container>
            <Content>{children}</Content>
          </Container>
        </CSSTransition>
      )}
    </TransitionGroup>,
    elRef.current
  );
}
