import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import InputMask from 'react-input-mask';
import { useField } from '@rocketseat/unform';

import { Container } from './styles';

export default function InputMaskUnform({ name, onChange, ...rest }) {
  const ref = useRef();

  const { fieldName, registerField, defaultValue, error } = useField(name);

  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (ref.current) {
      registerField({
        name: fieldName,
        ref: ref.current,
        path: 'value',
        clearValue: pickerRef => {
          pickerRef.setInputValue(null);
        },
      });
    }
  }, [ref.current]); // eslint-disable-line

  const props = {
    ...rest,
    ref,
    id: fieldName,
    name: fieldName,
    'aria-label': fieldName,
    value,
  };

  return (
    <Container>
      <InputMask
        {...props}
        onChange={e => {
          setValue(e.target.value);
          onChange(e);
        }}
      />
      {error && <span>{error}</span>}
    </Container>
  );
}

InputMaskUnform.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
};

InputMaskUnform.defaultProps = {
  onChange: () => {},
};
