import React from 'react';
import PropTypes from 'prop-types';

import { Container } from './styles';

export default function LoadingIndicator({ color, size, stroke }) {
  return (
    <Container color={color} size={size - 5}>
      <circle
        className="path"
        cx={(size - 5) / 2}
        cy={(size - 5) / 2}
        r={(size - 5) / 2 - stroke}
        fill="none"
        strokeWidth={stroke}
      />
    </Container>
  );
}

LoadingIndicator.propTypes = {
  color: PropTypes.string,
  size: PropTypes.number,
  stroke: PropTypes.number,
};

LoadingIndicator.defaultProps = {
  color: '#444',
  size: 20,
  stroke: 2,
};
